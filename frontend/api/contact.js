const MAX_BODY_SIZE = 10_000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

const handler = {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response(null, {
        status: 405,
        headers: { allow: "POST" },
      });
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().startsWith("application/json")) {
      return json({ error: "Content-Type must be application/json." }, 415);
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_SIZE) {
      return json({ error: "Request is too large." }, 413);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body." }, 400);
    }

    // Bots commonly fill hidden fields. Return success without forwarding spam.
    if (clean(body.website, 200)) {
      return json({ delivered: true });
    }

    const firstName = clean(body.first_name, 80);
    const lastName = clean(body.last_name, 80);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 160);
    const message = clean(body.message, 2_000);
    const language = ["ru", "uz", "en"].includes(body.language)
      ? body.language
      : "ru";

    if (!firstName || !lastName || !phone || !email || !message) {
      return json({ error: "All fields are required." }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Invalid email address." }, 400);
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) {
      console.error("Telegram contact-form environment variables are missing.");
      return json({ error: "Contact service is not configured." }, 503);
    }

    const telegramText = [
      "📩 Новая заявка с сайта Air Time",
      "",
      `Имя: ${firstName} ${lastName}`,
      `Телефон: ${phone}`,
      `Email: ${email}`,
      `Язык сайта: ${language.toUpperCase()}`,
      "",
      "Сообщение:",
      message,
    ].join("\n");

    try {
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramText,
            disable_web_page_preview: true,
          }),
        }
      );

      if (!telegramResponse.ok) {
        console.error(
          `Telegram rejected a contact-form message with status ${telegramResponse.status}.`
        );
        return json({ error: "Message delivery failed." }, 502);
      }

      return json({ delivered: true });
    } catch (error) {
      console.error("Telegram contact-form request failed.", error);
      return json({ error: "Message delivery failed." }, 502);
    }
  },
};

export default handler;
