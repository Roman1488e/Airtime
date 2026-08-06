import { Dictionary, GetDictionaryType, Locale } from "@/types";
import "server-only";
// import { Dictionary, GetDictionaryType, Locale } from "./types";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./en.json").then((module) => module.default as Dictionary),
  ru: () => import("./ru.json").then((module) => module.default as Dictionary),
  uz: () => import("./uz.json").then((module) => module.default as Dictionary),
};

export const getDictionary: GetDictionaryType = async (locale: string) => {
  // Agar locale qo'llab-quvvatlanmasa, 'uz' ga o'tkaziladi
  const validLocale = (locale in dictionaries ? locale : "uz") as Locale;
  return dictionaries[validLocale]();
};
