"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn, getCategoryTitle } from "@/lib/utils";
import type { Category, Dictionary, Locale } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/lib/i18n";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Locale;
  dictionary: Dictionary;
  categories: Category[];
}

export default function MobileMenu({
  isOpen,
  onClose,
  lang,
  dictionary,
  categories,
}: MobileMenuProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Menyu ochilganda body scroll bo'lishini oldini olish
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC tugmasi bosilganda menyuni yopish
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Til o'zgartirish
  const changeLanguage = (newLang: Locale) => {
    const pathWithoutLang = pathname.replace(`/${lang}`, "");
    router.push(`/${newLang}${pathWithoutLang}`);
    onClose();
  };

  // Kategoriyaga o'tish
  const navigateToCategory = (categorySlug: string) => {
    router.push(
      categorySlug
        ? `/${lang}/products?slug=${categorySlug}`
        : `/${lang}/products`
    );
    onClose();
  };

  // Til nomini olish
  const getLanguageName = (locale: string): string => {
    if (locale === "en") return dictionary.common.english;
    if (locale === "ru") return dictionary.common.russian;
    return dictionary.common.uzbek;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        ref={menuRef}
        className="fixed top-[72px] inset-x-0 max-h-[calc(100vh-72px)] overflow-y-auto bg-white shadow-lg z-50 md:hidden"
      >
        {/* Close button */}

        <nav className="flex flex-col p-4 space-y-4 pt-12">
          <Link
            href={`/${lang}`}
            className={cn(
              "text-gray-800 py-2 px-4 font-semibold hover:bg-gray-100 rounded-md transition-colors duration-200",
              pathname === `/${lang}` && "text-[#383084] bg-gray-50"
            )}
            onClick={onClose}
          >
            {dictionary.common.home}
          </Link>

          <div className="relative">
            <button
              className={cn(
                "w-full text-left flex items-center justify-between text-gray-800 py-2 px-4 font-semibold hover:bg-gray-100 rounded-md transition-colors duration-200",
                categoriesOpen && "text-[#383084] bg-gray-50"
              )}
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              aria-expanded={categoriesOpen}
            >
              {dictionary.common.categories}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  categoriesOpen && "transform rotate-180"
                )}
              />
            </button>

            {categoriesOpen && (
              <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200 ml-4">
                <button
                  className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  onClick={() => navigateToCategory("")}
                >
                  {dictionary.common.allProducts}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id.toString()}
                    className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    onClick={() => navigateToCategory(category.slug.toString())}
                  >
                    {getCategoryTitle(category, lang)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/${lang}/featured`}
            className={cn(
              "text-gray-800 py-2 px-4 font-semibold hover:bg-gray-100 rounded-md transition-colors duration-200",
              pathname === `/${lang}/featured` && "text-[#383084] bg-gray-50"
            )}
            onClick={onClose}
          >
            {dictionary.common.featuredProducts}
          </Link>

          <Link
            href={`/${lang}/about`}
            className={cn(
              "text-gray-800 py-2 px-4 font-semibold hover:bg-gray-100 rounded-md transition-colors duration-200",
              pathname === `/${lang}/about` && "text-[#383084] bg-gray-50"
            )}
            onClick={onClose}
          >
            {dictionary.common.aboutUs}
          </Link>

          <Link
            href={`/${lang}/contacts`}
            className={cn(
              "text-gray-800 py-2 px-4 font-semibold hover:bg-gray-100 rounded-md transition-colors duration-200",
              pathname === `/${lang}/contacts` && "text-[#383084] bg-gray-50"
            )}
            onClick={onClose}
          >
            {dictionary.common.contacts}
          </Link>

          <div className="relative">
            <button
              className={cn(
                "w-full text-left flex items-center justify-between text-gray-800 py-2 px-4 font-semibold hover:bg-gray-100 rounded-md transition-colors duration-200",
                languageOpen && "text-[#383084] bg-gray-50"
              )}
              onClick={() => setLanguageOpen(!languageOpen)}
              aria-expanded={languageOpen}
            >
              {dictionary.common.selectLanguage}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  languageOpen && "transform rotate-180"
                )}
              />
            </button>

            {languageOpen && (
              <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200 ml-4">
                {locales.map((locale) => (
                  <button
                    key={locale}
                    className={cn(
                      "block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200",
                      locale === lang && "text-[#383084] font-medium"
                    )}
                    onClick={() => changeLanguage(locale as Locale)}
                  >
                    {getLanguageName(locale)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
