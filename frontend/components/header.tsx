"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronDown, X, Menu } from "lucide-react";
import { cn, getCategoryTitle } from "@/lib/utils";
import SearchBox from "./search-box";
import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/lib/i18n";
import type { Category, Dictionary, Locale } from "@/types";
import MobileMenu from "./mobile-menu";
import useOnClickOutside from "@/hooks/use-click-outside";

interface HeaderProps {
  hasHero?: boolean;
  lang: Locale;
  dictionary: Dictionary;
  categories: Category[];
}

export default function Header({
  hasHero = false,
  lang,
  dictionary,
  categories,
}: HeaderProps) {
  const [state, setState] = useState({
    scrolled: false,
    searchOpen: false,
    languageMenuOpen: false,
    mobileMenuOpen: false,
    categoriesMenuOpen: false,
    isMounted: false,
  });

  const pathname = usePathname();
  const router = useRouter();

  const languageMenuRef = useRef<HTMLDivElement>(null);
  const categoriesMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    updateState({ isMounted: true });
  }, [updateState]);

  useEffect(() => {
    if (!state.isMounted) return;

    const handleScroll = () => {
      updateState({ scrolled: window.scrollY > 10 });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [state.isMounted, updateState]);

  useEffect(() => {
    updateState({
      mobileMenuOpen: false,
      searchOpen: false,
      categoriesMenuOpen: false,
      languageMenuOpen: false,
    });
  }, [pathname, updateState]);

  useOnClickOutside(
    languageMenuRef,
    () => updateState({ languageMenuOpen: false }),
    !state.mobileMenuOpen && state.languageMenuOpen
  );

  useOnClickOutside(
    categoriesMenuRef,
    () => updateState({ categoriesMenuOpen: false }),
    !state.mobileMenuOpen && state.categoriesMenuOpen
  );

  useOnClickOutside(
    searchRef,
    () => updateState({ searchOpen: false }),
    state.searchOpen
  );

  const toggleSearch = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateState({
        searchOpen: !state.searchOpen,
        mobileMenuOpen: false,
        categoriesMenuOpen: false,
        languageMenuOpen: false,
      });
    },
    [updateState, state.searchOpen]
  );

  const toggleLanguageMenu = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateState({
        languageMenuOpen: !state.languageMenuOpen,
        categoriesMenuOpen: false,
        searchOpen: false,
      });
    },
    [state.languageMenuOpen, updateState]
  );

  const toggleCategoriesMenu = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateState({
        categoriesMenuOpen: !state.categoriesMenuOpen,
        languageMenuOpen: false,
        searchOpen: false,
      });
    },
    [state.categoriesMenuOpen, updateState]
  );

  const toggleMobileMenu = useCallback(() => {
    updateState({
      mobileMenuOpen: !state.mobileMenuOpen,
      searchOpen: false,
      categoriesMenuOpen: false,
      languageMenuOpen: false,
    });
  }, [state.mobileMenuOpen, updateState]);

  const closeMobileMenu = useCallback(() => {
    updateState({ mobileMenuOpen: false });
  }, [updateState]);
  const closeSearch = useCallback(() => {
    updateState({ searchOpen: false });
  }, [updateState]);

  const changeLanguage = useCallback(
    (newLang: Locale, e: React.MouseEvent) => {
      e.stopPropagation();
      const pathWithoutLang = pathname.replace(`/${lang}`, "");
      router.push(`/${newLang}${pathWithoutLang}`);
      updateState({ languageMenuOpen: false, mobileMenuOpen: false });
    },
    [pathname, lang, router, updateState]
  );

  const navigateToCategory = useCallback(
    (categorySlug: string, e: React.MouseEvent) => {
      e.stopPropagation();
      router.push(
        categorySlug
          ? `/${lang}/products?slug=${categorySlug}`
          : `/${lang}/products`
      );
      updateState({ categoriesMenuOpen: false, mobileMenuOpen: false });
    },
    [lang, router, updateState]
  );

  const getLanguageName = useCallback(
    (locale: string): string => {
      if (locale === "en") return dictionary.common.english;
      if (locale === "ru") return dictionary.common.russian;
      return dictionary.common.uzbek;
    },
    [dictionary]
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        {
          "bg-transparent": hasHero && !state.scrolled,
          "bg-[#d3f0f1] shadow-md": !hasHero || state.scrolled,
        }
      )}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-24 py-4">
        <div className="flex items-center justify-between">
          <Link href={`/${lang}`} className="flex items-center z-10">
            <Image
              src="/logo.svg"
              alt="Air Time"
              width={150}
              height={50}
              className="h-10 sm:h-12 md:h-15 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link
              href={`/${lang}`}
              className={cn(
                "text-gray-800 relative overflow-hidden font-semibold hover:text-[#383084] transition-colors duration-300 group",
                pathname === `/${lang}` && "text-[#383084]"
              )}
            >
              {dictionary.common.home}
              <span
                className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-[#383084] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                  pathname === `/${lang}` && "scale-x-100"
                )}
              />
            </Link>

            <div className="relative" ref={categoriesMenuRef}>
              <button
                className={cn(
                  "text-gray-800 relative overflow-hidden font-semibold hover:text-[#383084] transition-colors duration-300 flex items-center group",
                  state.categoriesMenuOpen && "text-[#383084]"
                )}
                onClick={toggleCategoriesMenu}
                aria-expanded={state.categoriesMenuOpen}
                aria-haspopup="true"
              >
                {dictionary.common.categories}{" "}
                <ChevronDown
                  className={cn(
                    "ml-1 h-4 w-4 transition-transform duration-200",
                    state.categoriesMenuOpen && "transform rotate-180"
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-[#383084] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                    state.categoriesMenuOpen && "scale-x-100"
                  )}
                />
              </button>

              {state.isMounted && state.categoriesMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white border animate-in fade-in-50 slide-in-from-top-5 z-20">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      href={`/${lang}/products`}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-800 font-medium"
                      role="menuitem"
                      onClick={(e) => navigateToCategory("", e)}
                    >
                      {dictionary.common.allProducts}
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id.toString()}
                        href={`/${lang}/products?slug=${category.slug}`}
                        className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-800 font-medium"
                        role="menuitem"
                        onClick={(e) =>
                          navigateToCategory(category.slug.toString(), e)
                        }
                      >
                        {getCategoryTitle(category, lang)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/${lang}/featured`}
              className={cn(
                "text-gray-800 relative overflow-hidden font-semibold hover:text-[#383084] transition-colors duration-300 group",
                pathname === `/${lang}/featured` && "text-[#383084]"
              )}
            >
              {dictionary.common.featuredProducts}
              <span
                className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-[#383084] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                  pathname === `/${lang}/featured` && "scale-x-100"
                )}
              />
            </Link>

            <Link
              href={`/${lang}/about`}
              className={cn(
                "text-gray-800 relative overflow-hidden font-semibold hover:text-[#383084] transition-colors duration-300 group",
                pathname === `/${lang}/about` && "text-[#383084]"
              )}
            >
              {dictionary.common.aboutUs}
              <span
                className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-[#383084] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                  pathname === `/${lang}/about` && "scale-x-100"
                )}
              />
            </Link>

            <Link
              href={`/${lang}/contacts`}
              className={cn(
                "text-gray-800 relative overflow-hidden font-semibold hover:text-[#383084] transition-colors duration-300 group",
                pathname === `/${lang}/contacts` && "text-[#383084]"
              )}
            >
              {dictionary.common.contacts}
              <span
                className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-[#383084] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                  pathname === `/${lang}/contacts` && "scale-x-100"
                )}
              />
            </Link>

            <div className="relative" ref={languageMenuRef}>
              <button
                className={cn(
                  "flex items-center text-gray-800 relative overflow-hidden font-semibold hover:text-[#383084] transition-colors duration-300 group",
                  state.languageMenuOpen && "text-[#383084]"
                )}
                onClick={toggleLanguageMenu}
                aria-expanded={state.languageMenuOpen}
                aria-haspopup="true"
              >
                {dictionary.common.selectLanguage}{" "}
                <ChevronDown
                  className={cn(
                    "ml-1 h-4 w-4 transition-transform duration-200",
                    state.languageMenuOpen && "transform rotate-180"
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-[#383084] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                    state.languageMenuOpen && "scale-x-100"
                  )}
                />
              </button>

              {state.isMounted && state.languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border animate-in fade-in-50 slide-in-from-top-5 z-20">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {locales.map((locale) => (
                      <button
                        key={locale}
                        className={cn(
                          "block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-800 transition-colors duration-150",
                          locale === lang
                            ? "font-medium text-[#383084]"
                            : "text-gray-700"
                        )}
                        onClick={(e) => changeLanguage(locale as Locale, e)}
                        role="menuitem"
                      >
                        {getLanguageName(locale)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleSearch}
              className="text-gray-800  hover:text-[#383084] transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              aria-label={state.searchOpen ? "Close search" : "Search"}
              aria-expanded={state.searchOpen}
            >
              {state.searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          </nav>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleSearch}
              className="text-gray-800 hover:text-[#383084] transition-colors duration-200 p-2"
              aria-label={state.searchOpen ? "Close search" : "Search"}
              aria-expanded={state.searchOpen}
            >
              {state.searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>

            <button
              className="text-gray-800 hover:text-[#383084] transition-colors duration-200 p-2"
              onClick={toggleMobileMenu}
              aria-label={state.mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={state.mobileMenuOpen}
            >
              {state.mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <SearchBox
          isOpen={state.searchOpen}
          onClose={closeSearch}
          lang={lang}
          dictionary={dictionary}
        />

        {/* Yangi MobileMenu komponentini ishlatish */}
        <MobileMenu
          isOpen={state.mobileMenuOpen}
          onClose={closeMobileMenu}
          lang={lang}
          dictionary={dictionary}
          categories={categories}
        />
      </div>
    </header>
  );
}
