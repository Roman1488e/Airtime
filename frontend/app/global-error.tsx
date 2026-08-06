"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="uz">
      <body>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
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
              Jiddiy xatolik yuz berdi
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Kechirasiz, ilovada jiddiy muammo yuz berdi. Sahifani yangilang
              yoki keyinroq qayta urinib ko&apos;ring.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={reset}
                className="inline-flex items-center px-6 py-3 bg-[#383084] text-white font-semibold rounded-lg hover:bg-[#2d2670] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#383084] focus:ring-offset-2"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Qayta urinish
              </button>
              <Link
                href="/uz"
                className="inline-flex items-center px-6 py-3 bg-white text-[#383084] font-semibold rounded-lg border-2 border-[#383084] hover:bg-[#383084] hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#383084] focus:ring-offset-2"
              >
                <Home className="mr-2 h-5 w-5" />
                Bosh sahifa
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Texnik yordam
              </h3>
              <p className="text-gray-600 mb-4">
                Agar muammo takrorlanayotgan bo&apos;lsa, bizning texnik yordam
                xizmatimiz bilan bog&apos;laning
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <a
                  href="tel:+998977443230"
                  className="text-[#383084] hover:text-[#2d2670] font-medium"
                >
                  📞 +998 97 744 32 30
                </a>
                <a
                  href="mailto:support@airtime.uz"
                  className="text-[#383084] hover:text-[#2d2670] font-medium"
                >
                  ✉️ support@airtime.uz
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
