import { Category, HeroSlide, Locale } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCategoryTitle = (category: Category, lang: Locale): string => {
  return (
    category.translations[lang]?.title ||
    category.translations["en"]?.title ||
    ""
  );
};

export const getDescription = (slide: HeroSlide, lang: Locale) => {
  const description =
    slide.translations[lang]?.description ||
    slide.translations.uz.description ||
    slide.translations.ru.description ||
    slide.translations.en.description ||
    "";
  return { __html: description };
};
