import Link from "next/link";
import Image from "next/image";
import { Search, Home } from "lucide-react";

export default function NotFound() {
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
          Sahifa topilmadi
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki
          ko&apos;chirilgan. Bosh sahifaga qayting yoki qidiruv orqali kerakli
          mahsulotni toping.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/uz"
            className="inline-flex items-center px-6 py-3 bg-[#383084] text-white font-semibold rounded-lg hover:bg-[#2d2670] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#383084] focus:ring-offset-2"
          >
            <Home className="mr-2 h-5 w-5" />
            Bosh sahifa
          </Link>
          <Link
            href="/uz/products"
            className="inline-flex items-center px-6 py-3 bg-surface text-[#383084] font-semibold rounded-lg border-2 border-[#383084] hover:bg-[#383084] hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#383084] focus:ring-offset-2"
          >
            <Search className="mr-2 h-5 w-5" />
            Mahsulotlar
          </Link>
        </div>

        {/* Popular Categories */}
        <div className="bg-surface border border-surface-border rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Mashhur bo&apos;limlar
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/uz/products"
              className="p-4 rounded-lg bg-gray-50 hover:bg-[#d3f0f1] transition-colors duration-200 text-center"
            >
              <div className="text-2xl mb-2">🌬️</div>
              <span className="text-sm font-medium text-gray-700">
                Barcha mahsulotlar
              </span>
            </Link>
            <Link
              href="/uz/featured"
              className="p-4 rounded-lg bg-gray-50 hover:bg-[#d3f0f1] transition-colors duration-200 text-center"
            >
              <div className="text-2xl mb-2">⭐</div>
              <span className="text-sm font-medium text-gray-700">
                Mashhur mahsulotlar
              </span>
            </Link>
            <Link
              href="/uz/about"
              className="p-4 rounded-lg bg-gray-50 hover:bg-[#d3f0f1] transition-colors duration-200 text-center"
            >
              <div className="text-2xl mb-2">ℹ️</div>
              <span className="text-sm font-medium text-gray-700">
                Biz haqimizda
              </span>
            </Link>
            <Link
              href="/uz/contacts"
              className="p-4 rounded-lg bg-gray-50 hover:bg-[#d3f0f1] transition-colors duration-200 text-center"
            >
              <div className="text-2xl mb-2">📞</div>
              <span className="text-sm font-medium text-gray-700">
                Kontaktlar
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
