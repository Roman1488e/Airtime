import Link from "next/link";
import Image from "next/image";
import { Search, Home } from "lucide-react";
import type { Locale } from "@/types";

interface NotFoundPageProps {
  params: { lang: Locale };
}

const getNotFoundMessages = (lang: Locale) => {
  const messages = {
    uz: {
      title: "Sahifa topilmadi",
      description:
        "Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan. Bosh sahifaga qayting yoki qidiruv orqali kerakli mahsulotni toping.",
      goHome: "Bosh sahifa",
      products: "Mahsulotlar",
      popularCategories: "Mashhur bo'limlar",
      allProducts: "Barcha mahsulotlar",
      featuredProducts: "Mashhur mahsulotlar",
      aboutUs: "Biz haqimizda",
      contacts: "Kontaktlar",
    },
    ru: {
      title: "Страница не найдена",
      description:
        "Извините, страница, которую вы ищете, не существует или была перемещена. Вернитесь на главную страницу или найдите нужный товар через поиск.",
      goHome: "Главная страница",
      products: "Товары",
      popularCategories: "Популярные разделы",
      allProducts: "Все товары",
      featuredProducts: "Популярные товары",
      aboutUs: "О нас",
      contacts: "Контакты",
    },
    en: {
      title: "Page Not Found",
      description:
        "Sorry, the page you are looking for doesn't exist or has been moved. Return to the homepage or find the product you need through search.",
      goHome: "Homepage",
      products: "Products",
      popularCategories: "Popular Categories",
      allProducts: "All Products",
      featuredProducts: "Featured Products",
      aboutUs: "About Us",
      contacts: "Contacts",
    },
  };
  return messages[lang];
};

export default function NotFound({ params }: NotFoundPageProps) {
  const lang = params?.lang || "ru";
  const messages = getNotFoundMessages(lang);

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

        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-bold text-[#383084] opacity-20">
            404
          </h1>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {messages.title}
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {messages.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center px-6 py-3 bg-[#383084] text-white font-semibold rounded-lg hover:bg-[#2d2670] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#383084] focus:ring-offset-2"
          >
            <Home className="mr-2 h-5 w-5" />
            {messages.goHome}
          </Link>
          <Link
            href={`/${lang}/products`}
            className="inline-flex items-center px-6 py-3 bg-surface text-[#383084] font-semibold rounded-lg border-2 border-[#383084] hover:bg-[#383084] hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#383084] focus:ring-offset-2"
          >
            <Search className="mr-2 h-5 w-5" />
            {messages.products}
          </Link>
        </div>

        {/* Popular Categories */}
        <div className="bg-surface border border-surface-border rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {messages.popularCategories}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href={`/${lang}/products`}
              className="p-4 rounded-lg bg-gray-50 hover:bg-[#d3f0f1] transition-colors duration-200 text-center"
            >
              <div className="text-2xl mb-2">🌬️</div>
              <span className="text-sm font-medium text-gray-700">
                {messages.allProducts}
              </span>
            </Link>
            <Link
              href={`/${lang}/featured`}
              className="p-4 rounded-lg bg-gray-50 hover:bg-[#d3f0f1] transition-colors duration-200 text-center"
            >
              <div className="text-2xl mb-2">⭐</div>
              <span className="text-sm font-medium text-gray-700">
                {messages.featuredProducts}
              </span>
            </Link>
            <Link
              href={`/${lang}/about`}
              className="p-4 rounded-lg bg-gray-50 hover:bg-[#d3f0f1] transition-colors duration-200 text-center"
            >
              <div className="text-2xl mb-2">ℹ️</div>
              <span className="text-sm font-medium text-gray-700">
                {messages.aboutUs}
              </span>
            </Link>
            <Link
              href={`/${lang}/contacts`}
              className="p-4 rounded-lg bg-gray-50 hover:bg-[#d3f0f1] transition-colors duration-200 text-center"
            >
              <div className="text-2xl mb-2">📞</div>
              <span className="text-sm font-medium text-gray-700">
                {messages.contacts}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
