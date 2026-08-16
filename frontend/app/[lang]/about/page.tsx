import Footer from "@/components/footer";
import GetInTouch from "@/components/get-in-touch";
import Header from "@/components/header";
import { getDictionary } from "@/dictionaries";

import {
  fetchAboutCompany,
  fetchAboutImages,
  fetchCategories,
} from "@/lib/api";
import type { Locale } from "@/types";
// import { Metadata } from "next";
import Image from "next/image";

// export const metadata: Metadata = {
//   metadataBase: new URL("https://airtime.uz"),
//   title: {
//     template: "About",
//     default: "Biz haqimizda | Air Time - Havoni tozalovchi spreylar",
//   },
//   description:
//     "Air Time haqida ko'proq bilib oling - O'zbekistondagi havoni tozalovchi spreylar va xushbo'ylantiruvchi mahsulotlar ishlab chiqaruvchi yetakchi kompaniya. Bizning missiyamiz, brendlarimiz va mahsulotlarimiz bilan tanishing.",
//   keywords: [
//     "air time",
//     "havo xushbo'ylantiruvchi",
//     "tozalovchi spreylar",
//     "xushbo'y spreylar",
//     "ekologik mahsulotlar",
//     "biz haqimizda",
//     "O'zbekiston",
//     "Toshkent",
//     "havo tozalash",
//     "xushbo'ylantiruvchi mahsulotlar",
//   ],
//   authors: [{ name: "Air Time" }],
//   creator: "Air Time",
//   publisher: "Air Time",
//   formatDetection: {
//     email: true,
//     address: true,
//     telephone: true,
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },
//   openGraph: {
//     type: "website",
//     locale: "uz_UZ",
//     url: "https://airtime.uz/about",
//     siteName: "Air Time",
//     title: "Biz haqimizda | Air Time - Havoni tozalovchi spreylar",
//     description:
//       "Air Time - O'zbekistondagi havoni tozalovchi spreylar va xushbo'ylantiruvchi mahsulotlar bo'yicha yetakchi kompaniya. Bizning missiyamiz va mahsulotlarimiz bilan tanishing.",
//     images: [
//       {
//         url: "/images/about-og-image.jpg",
//         width: 1200,
//         height: 630,
//         alt: "Air Time - Biz haqimizda",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Biz haqimizda | Air Time - Havoni tozalovchi spreylar",
//     description:
//       "Air Time - O'zbekistondagi havoni tozalovchi spreylar va xushbo'ylantiruvchi mahsulotlar bo'yicha yetakchi kompaniya. Bizning missiyamizni kashf eting!",
//     images: ["/images/about-twitter-image.jpg"],
//     creator: "@airtime",
//   },
//   alternates: {
//     canonical: "https://airtime.uz/about",
//     languages: {
//       en: "https://airtime.uz/en/about",
//       ru: "https://airtime.uz/ru/about",
//       uz: "https://airtime.uz/uz/about",
//     },
//   },
//   icons: {
//     icon: [
//       { url: "/favicon.ico" },
//       { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
//       { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
//     ],
//     apple: [
//       { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
//     ],
//     other: [
//       {
//         rel: "mask-icon",
//         url: "/safari-pinned-tab.svg",
//       },
//     ],
//   },
//   manifest: "/site.webmanifest",
//   verification: {
//     google: "google-site-verification-code",
//     yandex: "yandex-verification-code",
//   },
// };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const aboutCompany = await fetchAboutCompany();
  const categories = await fetchCategories();
  const companyInfo = aboutCompany.length > 0 ? aboutCompany[0] : null;
  const aboutImage = await fetchAboutImages();

  return (
    <>
      <main className="min-h-screen">
        <Header
          hasHero={true}
          lang={lang}
          categories={categories}
          dictionary={dict}
        />

        <section className="py-16 md:py-24 bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_50%,#f8f6ff_100%)]">
          <div className="container mx-auto px-4 md:px-8 lg:px-24">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12 text-center">
                <p className="text-primary uppercase tracking-wider font-medium mb-2">
                  {dict.about.title || "The Company"}
                </p>
                <h1 className="text-4xl md:text-5xl font-bold">
                  {companyInfo?.translations[lang]?.title || "Air TIME"}
                </h1>
              </div>

              {companyInfo?.image && (
                <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] mb-12 rounded-xl overflow-hidden">
                  <Image
                    src={companyInfo.image || "/default.png"}
                    alt={companyInfo.translations[lang]?.title || "Company"}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                {companyInfo?.translations[lang]?.description ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: companyInfo.translations[lang]?.description,
                    }}
                  />
                ) : (
                  <>
                    <p className="text-gray-500">
                      {dict.about.noDescription || "No description available."}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#eff8fc]">
          <div className="container mx-auto px-4 md:px-8 lg:px-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {dict.about.ourProducts || "Our Products"}
            </h2>

            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={aboutImage[0]?.image || "/group.png"}
                alt="Our Products"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="container mx-auto px-4 md:px-8 lg:px-24 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {dict.about.ourMission || "Our Mission"}
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              {dict.about.missionStatement ||
                "To provide high-quality products that enhance everyday life while maintaining our commitment to sustainability and innovation."}
            </p>
          </div>
        </section>
      </main>
      <GetInTouch dictionary={dict} lang={lang} />
      <Footer dictionary={dict} lang={lang} />
    </>
  );
}
