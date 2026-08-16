"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import type { Locale } from "@/types";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
  params: { lang: Locale };
}

const getErrorMessages = (lang: Locale) => {
  const messages = {
    uz: {
      title: "Xatolik yuz berdi",
      description:
        "Kechirasiz, sahifani yuklashda muammo yuz berdi. Iltimos, qayta urinib ko'ring yoki bosh sahifaga qayting.",
      tryAgain: "Qayta urinish",
      goHome: "Bosh sahifa",
      needHelp: "Yordam kerakmi?",
      helpDescription: "Agar muammo davom etsa, biz bilan bog'laning",
    },
    ru: {
      title: "Произошла ошибка",
      description:
        "Извините, возникла проблема при загрузке страницы. Пожалуйста, попробуйте еще раз или вернитесь на главную страницу.",
      tryAgain: "Попробовать снова",
      goHome: "Главная страница",
      needHelp: "Нужна помощь?",
      helpDescription: "Если проблема продолжается, свяжитесь с нами",
    },
    en: {
      title: "An Error Occurred",
      description:
        "Sorry, there was a problem loading the page. Please try again or return to the homepage.",
      tryAgain: "Try Again",
      goHome: "Homepage",
      needHelp: "Need Help?",
      helpDescription: "If the problem persists, contact us",
    },
  };
  return messages[lang];
};

export default function Error({ error, reset, params }: ErrorPageProps) {
  const lang = params?.lang || "ru";
  const messages = getErrorMessages(lang);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-muted to-background flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo.svg"
            alt="Air Time"
            width={200}
            height={80}
            className="h-16 w-auto mx-auto object-contain"
            priority
          />
        </div>

        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {messages.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {messages.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 bg-[#383084] text-white font-semibold rounded-lg hover:bg-[#2d2670] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#383084] focus:ring-offset-2"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            {messages.tryAgain}
          </button>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center px-6 py-3 bg-surface text-[#383084] font-semibold rounded-lg border-2 border-[#383084] hover:bg-[#383084] hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#383084] focus:ring-offset-2"
          >
            <Home className="mr-2 h-5 w-5" />
            {messages.goHome}
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {messages.needHelp}
          </h3>
          <p className="text-gray-600 mb-4">{messages.helpDescription}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a
              href="tel:+998977443230"
              className="text-[#383084] hover:text-[#2d2670] font-medium"
            >
              📞 +998 97 744 32 30
            </a>
            <a
              href="mailto:info@airtime.uz"
              className="text-[#383084] hover:text-[#2d2670] font-medium"
            >
              ✉️ info@airtime.uz
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
