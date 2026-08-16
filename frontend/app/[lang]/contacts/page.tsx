import Footer from "@/components/footer";
import Header from "@/components/header";
import { getDictionary } from "@/dictionaries";
import { fetchCategories, fetchContactInfo, fetchFAQs } from "@/lib/api";
import type { Locale } from "@/types";
import FaqAccordion from "@/components/faq-accordion";
import ContactForm from "@/components/contact-form";

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const faqs = await fetchFAQs();
  const contactInfo = await fetchContactInfo();
  const categories = await fetchCategories();

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <Header
          categories={categories}
          hasHero={false}
          lang={lang}
          dictionary={dict}
        />

        <section className="py-16  mt-[5rem]">
          <div className="container mx-auto px-4 md:px-8 lg:px-24">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {dict.contacts.faqTitle || "Frequently Asked Questions"}
            </h1>

            <div className="max-w-4xl mx-auto space-y-12">
              {faqs.length > 0 ? (
                faqs.map((faqCategory) => (
                  <div key={faqCategory.id} className="space-y-6">
                    <h2 className="text-2xl font-bold">
                      {faqCategory.translations[lang as Locale]?.title ||
                        faqCategory.translations.en?.title}
                    </h2>
                    <div className="space-y-4">
                      {faqCategory.questions_answers.map((qa) => (
                        <FaqAccordion
                          key={qa.id}
                          question={
                            qa.translations[lang as Locale]?.question ||
                            qa.translations.en?.question ||
                            ""
                          }
                          answer={
                            qa.translations[lang as Locale]?.answer ||
                            qa.translations.en?.answer ||
                            ""
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Fallback content if no FAQs are returned from API
                <>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Where to use?</h2>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <FaqAccordion
                          key={`where-${i}`}
                          question={`Question about where to use ${i}`}
                          answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Who should use?</h2>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <FaqAccordion
                          key={`who-${i}`}
                          question={`Question about who should use ${i}`}
                          answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">
                      How important is this?
                    </h2>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <FaqAccordion
                          key={`importance-${i}`}
                          question={`Question about importance ${i}`}
                          answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section
          className="relative py-16 md:py-24 bg-cover bg-center"
          style={{ backgroundImage: "url('/get-in-touchs.png')" }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="container mx-auto px-4 md:px-8 lg:px-24 relative z-10">
            <div className="bg-surface/95 backdrop-blur-sm border border-surface-border rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
              <div className="p-6 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                  {dict.contacts.title}
                </h2>
                <ContactForm
                  lang={lang}
                  contactInfo={contactInfo}
                  dictionary={dict}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer dictionary={dict} lang={lang} />
    </>
  );
}
