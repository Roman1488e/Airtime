import { Metadata } from "next";
import type React from "react";
import { Toaster } from "react-hot-toast";
import GotoUp from "@/components/goto-up";
import Script from "next/script";
import { Locale } from "@/types";

export function generateStaticParams() {
  return ["uz", "ru", "en"].map((lang) => ({ lang }));
}

// Metadata generatsiya qilish funksiyasi
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;

  // Har bir til uchun metadata
  const metadata = {
    uz: {
      title: {
        template: "%s | Air Time",
        default: "Air Time — Uslub bilan nafas oling, did bilan yashang",
      },
      description:
        "Air Time — zamonaviy va uslubli havo tarqatuvchi vositalarni ishlab chiqaruvchi brend bo'lib, kundalik hayotingizni qulaylik va ilhom bilan to'ldiradi. Bizning aromatlarimiz sizning uslubingizni aks ettiradi, kayfiyatingizni ko'taradi va har qanday makonga o'ziga xoslik bag'ishlaydi — uyda, ofisda yoki mashinada.",
      keywords: [
        "havo tarqatuvchi vositalar",
        "air time",
        "xushbo'y spreylar",
        "aromatizatorlar",
        "uy uchun aromatizatorlar",
        "mashina uchun aromatizatorlar",
        "ofis uchun aromatizatorlar",
        "uslubli aromatizatorlar",
        "zamonaviy aromatizatorlar",
        "O'zbekiston",
        "Toshkent",
      ],
      ogTitle: "Air Time — Uslub bilan nafas oling, did bilan yashang",
      ogDescription:
        "Air Time — zamonaviy va uslubli havo tarqatuvchi vositalarni ishlab chiqaruvchi brend bo'lib, kundalik hayotingizni qulaylik va ilhom bilan to'ldiradi.",
      twitterTitle: "Air Time — Uslub bilan nafas oling, did bilan yashang",
      twitterDescription:
        "Air Time — zamonaviy va uslubli havo tarqatuvchi vositalarni ishlab chiqaruvchi brend bo'lib, kundalik hayotingizni qulaylik va ilhom bilan to'ldiradi.",
    },
    ru: {
      title: {
        template: "%s | Air Time",
        default: "Air Time — Дыши красиво. Живи со вкусом",
      },
      description:
        "Air Time — это производитель стильных и современных освежителей воздуха, превращающих повседневность в атмосферу уюта и вдохновения. Мы создаём ароматы, которые подчёркивают стиль, формируют настроение и придают пространству индивидуальность — будь то дом, офис или автомобиль.",
      keywords: [
        "освежители воздуха",
        "air time",
        "ароматизаторы",
        "ароматические спреи",
        "домашние ароматизаторы",
        "автомобильные ароматизаторы",
        "офисные ароматизаторы",
        "стильные ароматизаторы",
        "современные ароматизаторы",
        "Узбекистан",
        "Ташкент",
      ],
      ogTitle: "Air Time — Дыши красиво. Живи со вкусом",
      ogDescription:
        "Air Time — это производитель стильных и современных освежителей воздуха, превращающих повседневность в атмосферу уюта и вдохновения.",
      twitterTitle: "Air Time — Дыши красиво. Живи со вкусом",
      twitterDescription:
        "Air Time — это производитель стильных и современных освежителей воздуха, превращающих повседневность в атмосферу уюта и вдохновения.",
    },
    en: {
      title: {
        template: "%s | Air Time",
        default: "Air Time — Breathe in style. Live with taste",
      },
      description:
        "Air Time is a creator of stylish, modern air fresheners that transform everyday spaces into cozy, inspiring atmospheres. Our scents are crafted to reflect your style, uplift your mood, and bring a unique character to any environment — from your home to your car.",
      keywords: [
        "air fresheners",
        "air time",
        "fragrance products",
        "home fragrances",
        "car fresheners",
        "office fragrances",
        "stylish air fresheners",
        "modern fragrances",
        "room scents",
        "Uzbekistan",
        "Tashkent",
      ],
      ogTitle: "Air Time — Breathe in style. Live with taste",
      ogDescription:
        "Air Time is a creator of stylish, modern air fresheners that transform everyday spaces into cozy, inspiring atmospheres.",
      twitterTitle: "Air Time — Breathe in style. Live with taste",
      twitterDescription:
        "Air Time is a creator of stylish, modern air fresheners that transform everyday spaces into cozy, inspiring atmospheres.",
    },
  };

  // Tanlangan til uchun metadata
  const selectedMetadata = metadata[lang] || metadata.uz;

  // Umumiy brandga oid ma'lumotlar
  const brandKeywords = [
    "Air Time",
    "AIR TIME",
    "airtime",
    "AIRTIME",
    "ФШКЕШЬУ",
    "ФШК ЕШЬУ",
    "фшкешьу",
    "фшк ешьу",
    "фшк",
    "фшк ешь",
    "ФШК",
    "ФШК ЕШЬ",
  ];

  return {
    metadataBase: new URL("https://airtime.uz"),
    title: selectedMetadata.title,
    description: selectedMetadata.description,
    keywords: [...selectedMetadata.keywords, ...brandKeywords],
    authors: [{ name: "Air Time" }],
    creator: "Air Time",
    publisher: "Air Time",
    formatDetection: {
      email: true,
      address: true,
      telephone: true,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: lang === "en" ? "en_US" : lang === "ru" ? "ru_RU" : "uz_UZ",
      url: `https://airtime.uz/${lang}`,
      siteName: "Air Time",
      title: selectedMetadata.ogTitle,
      description: selectedMetadata.ogDescription,
      images: [
        {
          url: "/group.png",
          width: 1200,
          height: 630,
          alt: selectedMetadata.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: selectedMetadata.twitterTitle,
      description: selectedMetadata.twitterDescription,
      images: ["/group.png"],
      creator: "@airtime",
    },
    alternates: {
      canonical: `https://airtime.uz/${lang}`,
      languages: {
        en: "https://airtime.uz/en",
        ru: "https://airtime.uz/ru",
        uz: "https://airtime.uz/uz",
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        {
          rel: "mask-icon",
          url: "/safari-pinned-tab.svg",
        },
      ],
    },
    manifest: "/site.webmanifest",
    verification: {
      google: "google-site-verification-code",
      yandex: "yandex-verification-code",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  // Til asosida strukturalangan ma'lumotlarni yaratish
  const { lang } = await params;
  const structuredDataByLang = {
    uz: {
      description:
        "Air Time — zamonaviy va uslubli havo tarqatuvchi vositalarni ishlab chiqaruvchi brend bo'lib, kundalik hayotingizni qulaylik va ilhom bilan to'ldiradi.",
      slogan: "Uslub bilan nafas oling, did bilan yashang",
    },
    ru: {
      description:
        "Air Time — это производитель стильных и современных освежителей воздуха, превращающих повседневность в атмосферу уюта и вдохновения.",
      slogan: "Дыши красиво. Живи со вкусом",
    },
    en: {
      description:
        "Air Time is a creator of stylish, modern air fresheners that transform everyday spaces into cozy, inspiring atmospheres.",
      slogan: "Breathe in style. Live with taste",
    },
  };

  const selectedData = structuredDataByLang[lang] || structuredDataByLang.uz;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Air Time",
    url: `https://airtime.uz/${lang}`,
    logo: "https://airtime.uz/logo.png",
    description: selectedData.description,
    slogan: selectedData.slogan,
    sameAs: [
      "https://www.instagram.com/airtimeuz?igsh=ZjFyazhtMDB0bndl",
      "https://t.me/Airtime_support_bot",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+998977443230",
      contactType: "customer service",
      availableLanguage: ["Uzbek", "Russian", "English"],
    },
  };

  return (
    <>
      <Script
        id="org-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
      <Toaster />
      <GotoUp />
    </>
  );
}
