import { Dictionary, GetDictionaryType, Locale } from "@/types";
import "server-only";
// import { Dictionary, GetDictionaryType, Locale } from "./types";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./en.json").then((module) => module.default as Dictionary),
  ru: () => import("./ru.json").then((module) => module.default as Dictionary),
  uz: () => import("./uz.json").then((module) => module.default as Dictionary),
};

export const getDictionary: GetDictionaryType = async (locale: string) => {
  // Unsupported or missing locales fall back to the site's default language.
  const validLocale = (locale in dictionaries ? locale : "ru") as Locale;
  return dictionaries[validLocale]();
};
