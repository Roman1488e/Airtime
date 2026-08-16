import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { Dictionary, Locale } from "@/types";
import { fetchCategories, fetchContactInfo, fetchSocialLinks } from "@/lib/api";
import { getCategoryTitle } from "@/lib/utils";
import { BiLogoTelegram } from "react-icons/bi";

interface FooterProps {
  lang: Locale;
  dictionary: Dictionary;
}

export default async function Footer({ lang, dictionary }: FooterProps) {
  const categories = await fetchCategories();
  const [contactInfo] = await fetchContactInfo();

  const [socilaLinks] = await fetchSocialLinks();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-24 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and About */}
          <div>
            <Link href={`/${lang}`} className="inline-block mb-4">
              <Image
                src="/logo.svg"
                alt="Air Time"
                width={350}
                height={200}
                className="h-24 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 mb-4">
              {dictionary.common.footer.description}
            </p>
            <div className="flex space-x-4">
              <Link
                href={socilaLinks?.facebook || "#"}
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href={socilaLinks?.instagram || "#"}
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href={socilaLinks?.telegram || "#"}
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
              >
                <BiLogoTelegram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {lang === "en"
                ? "Quick Links"
                : lang === "ru"
                ? "Быстрые ссылки"
                : "Tezkor havolalar"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${lang}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {dictionary.common.home}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/featured`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {dictionary.common.featuredProducts}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/about`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {dictionary.common.aboutUs}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/contacts`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {dictionary.common.contacts}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {dictionary.common.categories}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${lang}/products`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {dictionary.common.allProducts}{" "}
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/${lang}/products?slug=${category.slug}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {getCategoryTitle(category, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {dictionary.contacts.title}
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-indigo-500">Email:</span>
                <Link
                  href={`mailto:${contactInfo?.email || ""}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {contactInfo?.email || "info@airtime.com"}
                </Link>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-500">
                  {lang === "en"
                    ? "Phone:"
                    : lang === "ru"
                    ? "Телефон:"
                    : "Telefon:"}
                </span>
                <div className="flex flex-col gap-1">
                  {contactInfo?.phone_1 && (
                    <Link
                      href={`tel:${contactInfo.phone_1}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {contactInfo.phone_1}
                    </Link>
                  )}
                  {contactInfo?.phone_2 && (
                    <Link
                      href={`tel:${contactInfo.phone_2}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {contactInfo.phone_2}
                    </Link>
                  )}
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-500">
                  {lang === "en"
                    ? "Address:"
                    : lang === "ru"
                    ? "Адрес:"
                    : "Manzil:"}
                </span>
                <span className="text-gray-400">
                  {contactInfo?.translations[lang]?.address || ""}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Air Time.{" "}
            {lang === "en"
              ? "All rights reserved."
              : lang === "ru"
              ? "Все права защищены."
              : "Barcha huquqlar himoyalangan."}
          </p>
        </div>
      </div>
    </footer>
  );
}
