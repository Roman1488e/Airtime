import { fetchCategories, fetchProducts } from "@/lib/api";
import { getDictionary } from "@/dictionaries";
import ProductsClient from "@/components/products-client";
import type { Locale } from "@/types";
import Header from "@/components/header";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import { notFound } from "next/navigation";
import GetInTouch from "@/components/get-in-touch";
import { Suspense } from "react";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const title = dictionary.common.products || "Products - Air Time";
  const description = dictionary.seo?.productsDescription || "Air Time product catalogue.";
  return {
    title,
    description,
    alternates: {
      canonical: `https://airtime.uz/${lang}/products`,
      languages: { en: "https://airtime.uz/en/products", ru: "https://airtime.uz/ru/products", uz: "https://airtime.uz/uz/products" },
    },
  };
}

export default async function ProductsPage({ params }: Props) {
  const { lang } = await params;
  if (!["uz", "ru", "en"].includes(lang)) notFound();
  const dictionary = await getDictionary(lang);
  const [categories, productsData] = await Promise.all([fetchCategories(), fetchProducts({ limit: 12 })]);

  return (
    <>
      <Header hasHero={false} categories={categories} lang={lang} dictionary={dictionary} />
      <main className="py-16 pt-28 px-4 md:px-8 lg:px-24 bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">
            {lang === "en" ? "Products" : lang === "ru" ? "Продукты" : "Mahsulotlar"}
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {lang === "en" ? "Discover our quality products" : lang === "ru" ? "Откройте для себя наши качественные продукты" : "Sifatli mahsulotlarimizni kashf eting"}
          </p>
          <Suspense fallback={<div className="min-h-64" />}>
            <ProductsClient initialProducts={productsData.products} initialTotalCount={productsData.totalCount} categories={categories} lang={lang} dictionary={dictionary} initialCategorySlug="" />
          </Suspense>
        </div>
      </main>
      <GetInTouch dictionary={dictionary} lang={lang} />
      <Footer dictionary={dictionary} lang={lang} />
    </>
  );
}
