import Header from "@/components/header";
import { getDictionary } from "@/dictionaries";
import ProductDetail from "@/components/product-detail";
import AdditionalDetails from "@/components/addittional-detail";
import PopularProducts from "@/components/popular-products";
import ViewingHistory from "@/components/viewing-history";
import type { Locale, Product } from "@/types";
import {
  fetchCategories,
  fetchFeaturedProducts,
  fetchPopularProducts,
  fetchProductBySlug,
} from "@/lib/api";
import { Suspense } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import GetInTouch from "@/components/get-in-touch";
import Footer from "@/components/footer";
import Script from "next/script";

// Dynamic metadata generation for product page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);

  try {
    const product = await fetchProductBySlug(slug);

    if (!product) {
      return {
        title: dict.common.noProductsFound || "Mahsulot topilmadi",
        description:
          lang === "en"
            ? "The product you are looking for might have been removed or is temporarily unavailable."
            : lang === "ru"
            ? "Товар, который вы ищете, возможно, был удален или временно недоступен."
            : "Siz qidirayotgan mahsulot olib tashlangan yoki vaqtincha mavjud emas.",
      };
    }

    // Get product title and description in the correct language
    const title =
      product.translations && product.translations[lang]
        ? product.translations[lang].title
        : product.title || "Mahsulot";

    const description =
      product.translations && product.translations[lang]
        ? product.translations[lang].description
        : product.description || "Tavsif mavjud emas";

    // Get the first product image for Open Graph
    const productImage =
      product.product_images && product.product_images.length > 0
        ? product.product_images[0].image
        : "/group.png";

    // Get category name
    const categoryName =
      product.category &&
      product.category.translations &&
      product.category.translations[lang]
        ? product.category.translations[lang].title
        : product.category?.translations?.uz?.title || "";

    // Get price information for metadata

    return {
      title: title,
      description: description.substring(0, 160), // Limit description to 160 characters
      keywords: [title, categoryName],
      openGraph: {
        title: title,
        description: description.substring(0, 160),
        url: `https://airtime.uz/${lang}/products/${slug}`,
        images: [
          {
            url: productImage,
            width: 800,
            height: 600,
            alt: title,
          },
        ],
        locale: lang === "en" ? "en_US" : lang === "ru" ? "ru_RU" : "uz_UZ",
        type: "website", // Specify that this is a product page
        siteName: "Air Time",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description.substring(0, 160),
        images: [
          {
            url: productImage,
            width: 800,
            height: 600,
            alt: title,
          },
        ],
      },
      alternates: {
        canonical: `https://airtime.uz/${lang}/products/${slug}`,
        languages: {
          en: `https://airtime.uz/en/products/${slug}`,
          ru: `https://airtime.uz/ru/products/${slug}`,
          uz: `https://airtime.uz/uz/products/${slug}`,
        },
      },
    };
  } catch (error) {
    console.error("Metadata yaratishda xatolik:", error);
    return {
      title: "Mahsulot - Air Time",
      description:
        "Sifatli havo tarqatuvchi vositalar va xushbo'ylantiruvchi mahsulotlar",
    };
  }
}

export async function generateStaticParams() {
  const { siteContent } = await import("@/lib/content");
  return ["uz", "ru", "en"].flatMap((lang) =>
    siteContent.products.map((product) => ({ lang, slug: product.slug }))
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);

  // Fetch data with error handling
  let product;
  let popularProducts: Product[] = [];
  let error = null;
  const discountedProducts = await fetchFeaturedProducts();
  const categories = await fetchCategories();

  try {
    // Fetch product and popular products in parallel
    const [productData, popularProductsData] = await Promise.all([
      fetchProductBySlug(slug).catch((err) => {
        console.error("Error fetching product:", err);
        return null;
      }),
      fetchPopularProducts().catch((err) => {
        console.error("Error fetching popular products:", err);
        return [];
      }),
    ]);

    product = productData;
    popularProducts = popularProductsData;
  } catch (err) {
    console.error("Error fetching product data:", err);
    error = err;
  }

  // If product not found or error occurred
  if (!product || error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header
          categories={categories}
          hasHero={false}
          lang={lang}
          dictionary={dict}
        />
        <div className="container mx-auto px-4 md:px-8 lg:px-24 pt-24 pb-16">
          <div className="bg-surface border border-surface-border rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-4">
              {dict.common.noProductsFound || "Product Not Found"}
            </h1>
            <p className="text-gray-600 mb-8">
              {lang === "en"
                ? "The product you are looking for might have been removed or is temporarily unavailable."
                : lang === "ru"
                ? "Товар, который вы ��щете, возможно, был удален или временно недоступен."
                : "Siz qidirayotgan mahsulot olib tashlangan yoki vaqtincha mavjud emas."}
            </p>
            <Link
              href={`/${lang}/products`}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {lang === "en"
                ? "Back to Products"
                : lang === "ru"
                ? "Вернуться к продуктам"
                : "Mahsulotlarga qaytish"}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Add structured data for the product
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.translations?.[lang]?.title || product.title,
    description:
      product.translations?.[lang]?.description || product.description,
    image:
      product.product_images?.length > 0
        ? [product.product_images[0].image]
        : [],
    offers: {
      "@type": "Offer",
      price: String(product.discounted_price || product.price),
      priceCurrency: "UZS",
      url: `https://airtime.uz/${lang}/products/${slug}`,
    },
    brand: {
      "@type": "Brand",
      name: "Air Time",
    },
    category:
      product.category?.translations?.[lang]?.title ||
      product.category?.translations?.uz?.title ||
      "",
  } as const;

  return (
    <>
      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-gray-50">
        <Header
          categories={categories}
          hasHero={false}
          lang={lang}
          dictionary={dict}
        />
        <div className="container mx-auto px-4 md:px-8 lg:px-24 space-y-12 pt-8 md:pt-16 lg:pt-24 pb-16">
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetail product={product} lang={lang} dict={dict} />
          </Suspense>

          {product.short_descriptions &&
          product.short_descriptions.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{dict.common.learnMore}</h2>
              <div className="space-y-4">
                {product.short_descriptions.map((detail) => (
                  <AdditionalDetails
                    key={detail.id.toString()}
                    title={
                      detail.translations && detail.translations[lang]
                        ? detail.translations[lang].key || detail.key
                        : detail.key || "Additional Information"
                    }
                    content={
                      detail.translations && detail.translations[lang]
                        ? detail.translations[lang].value || detail.value
                        : detail.value || "Information not available"
                    }
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-surface border border-surface-border rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">
                {dict.common.learnMore}
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500">
                  {lang === "en"
                    ? "No additional information available for this product."
                    : lang === "ru"
                    ? "Дополнительная информация о товаре отсутствует."
                    : "Bu mahsulot haqida qo'shimcha ma'lumot mavjud emas."}
                </p>
              </div>
            </div>
          )}

          <ViewingHistory
            title={dict.common.recentlyViewed || "Recently Viewed"}
            lang={lang}
            learnMoreText={dict.common.learnMore}
            // currentProductId={product.id.toString()}
          />

          {popularProducts.length > 0 ? (
            <PopularProducts
              title={dict.home.popularProducts}
              products={popularProducts}
              lang={lang}
              learnMoreText={dict.common.learnMore}
            />
          ) : (
            <div className="bg-surface border border-surface-border rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">
                {dict.home.popularProducts}
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500">
                  {lang === "en"
                    ? "Popular products are currently unavailable."
                    : lang === "ru"
                    ? "Популярные товары в настоящее время недоступны."
                    : "Mashhur mahsulotlar hozirda mavjud emas."}
                </p>
              </div>
            </div>
          )}
          <PopularProducts
            title={dict.home.discountedProducts}
            products={discountedProducts}
            lang={lang}
            learnMoreText={dict.common.learnMore}
          />
        </div>
      </main>
      <GetInTouch dictionary={dict} lang={lang} />
      <Footer dictionary={dict} lang={lang} />
    </>
  );
}

// Skeleton loader for product detail
function ProductDetailSkeleton() {
  return (
    <div className="bg-surface border border-surface-border rounded-xl shadow-sm p-6 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="flex mt-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 w-16 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}

// import Header from "@/components/header";
// import { getDictionary } from "@/dictionaries";
// import ProductDetail from "@/components/product-detail";
// import AdditionalDetails from "@/components/addittional-detail";
// import PopularProducts from "@/components/popular-products";
// import ViewingHistory from "@/components/viewing-history";
// import type { Locale, Product } from "@/types";
// import {
//   fetchFeaturedProducts,
//   fetchPopularProducts,
//   fetchProductBySlug,
// } from "@/lib/api";
// import { Suspense } from "react";
// import { ArrowLeft, AlertTriangle } from "lucide-react";
// import Link from "next/link";
// import type { Metadata } from "next";
// import GetInTouch from "@/components/get-in-touch";
// import Footer from "@/components/footer";

// // Dynamic metadata generation for product page
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ lang: Locale; slug: string }>;
// }): Promise<Metadata> {
//   const { lang, slug } = await params;
//   const dict = await getDictionary(lang);

//   try {
//     const product = await fetchProductBySlug(slug);

//     if (!product) {
//       return {
//         title: dict.common.noProductsFound || "Mahsulot topilmadi",
//         description:
//           lang === "en"
//             ? "The product you are looking for might have been removed or is temporarily unavailable."
//             : lang === "ru"
//             ? "Товар, который вы ищете, возможно, был удален или временно недоступен."
//             : "Siz qidirayotgan mahsulot olib tashlangan yoki vaqtincha mavjud emas.",
//       };
//     }

//     // Get product title and description in the correct language
//     const title =
//       product.translations && product.translations[lang]
//         ? product.translations[lang].title
//         : product.title || "Mahsulot";

//     const description =
//       product.translations && product.translations[lang]
//         ? product.translations[lang].description
//         : product.description || "Tavsif mavjud emas";

//     // Get the first product image for Open Graph
//     const productImage =
//       product.product_images && product.product_images.length > 0
//         ? product.product_images[0].image
//         : null;

//     // Get category name
//     const categoryName =
//       product.category &&
//       product.category.translations &&
//       product.category.translations[lang]
//         ? product.category.translations[lang].title
//         : product.category?.translations?.uz?.title || "";

//     // Get price information for structured data
//     const price = product.price || "";
//     const discountedPrice = product.discounted_price || "";

//     // Create structured data for product
//     // const structuredData = {
//     //   "@context": "https://schema.org",
//     //   "@type": "Product",
//     //   name: title,
//     //   description: description,
//     //   image: productImage ? [productImage] : [],
//     //   offers: {
//     //     "@type": "Offer",
//     //     price: discountedPrice || price,
//     //     priceCurrency: "UZS",
//     //     availability: product.is_available
//     //       ? "https://schema.org/InStock"
//     //       : "https://schema.org/OutOfStock",
//     //     url: `https://airtime.uz/${lang}/products/${slug}`,
//     //   },
//     //   brand: {
//     //     "@type": "Brand",
//     //     name: "Air Time",
//     //   },
//     //   category: categoryName,
//     // };

//     return {
//       title: `${title}`,
//       description: description.substring(0, 160), // Limit description to 160 characters
//       keywords: [title, categoryName].filter(Boolean),
//       openGraph: {
//         title: title,
//         description: description.substring(0, 160),
//         url: `https://airtime.uz/${lang}/products/${slug}`,
//         images: productImage
//           ? [
//               {
//                 url: productImage,
//                 width: 800,
//                 height: 600,
//                 alt: title,
//               },
//             ]
//           : [],
//         locale: lang,
//         type: "website", // Specify that this is a website page
//         siteName: "Air Time",
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: title,
//         description: description.substring(0, 160),
//         images: productImage ? [productImage] : [],
//       },
//       alternates: {
//         canonical: `https://airtime.uz/${lang}/products/${slug}`,
//         languages: {
//           en: `https://airtime.uz/en/products/${slug}`,
//           ru: `https://airtime.uz/ru/products/${slug}`,
//           uz: `https://airtime.uz/uz/products/${slug}`,
//         },
//       },
//       other: {
//         "og:price:amount": discountedPrice || price,
//         "og:price:currency": "UZS",
//         "product:price:amount": discountedPrice || price,
//         "product:price:currency": "UZS",
//         "product:availability": product.is_available
//           ? "in stock"
//           : "out of stock",
//       },
//       robots: {
//         index: true,
//         follow: true,
//         "max-image-preview": "large",
//         "max-snippet": -1,
//       },
//       // Add verification codes
//       verification: {
//         google: "google-site-verification-code",
//         yandex: "yandex-verification-code",
//       },
//       // Add structured data as JSON-LD - fixed property name
//       // jsonLd: structuredData, // Removed as it is not part of the Metadata type
//     };
//   } catch (error) {
//     console.error("Metadata yaratishda xatolik:", error);
//     return {
//       title: "Mahsulot - Air Time",
//       description: "Sifatli konditsionerlar va havo sovutish tizimlari",
//     };
//   }
// }
// export default async function ProductPage({
//   params,
// }: {
//   params: Promise<{ lang: Locale; slug: string }>;
// }) {
//   const { lang, slug } = await params;
//   const dict = await getDictionary(lang);

//   // Fetch data with error handling
//   let product;
//   let popularProducts: Product[] = [];
//   let error = null;
//   const discountedProducts = await fetchFeaturedProducts();

//   try {
//     // Fetch product and popular products in parallel
//     const [productData, popularProductsData] = await Promise.all([
//       fetchProductBySlug(slug).catch((err) => {
//         console.error("Error fetching product:", err);
//         return null;
//       }),
//       fetchPopularProducts().catch((err) => {
//         console.error("Error fetching popular products:", err);
//         return [];
//       }),
//     ]);

//     product = productData;
//     popularProducts = popularProductsData;
//   } catch (err) {
//     console.error("Error fetching product data:", err);
//     error = err;
//   }

//   // If product not found or error occurred
//   if (!product || error) {
//     return (
//       <main className="min-h-screen bg-gray-50">
//         <Header hasHero={false} lang={lang} dictionary={dict} />
//         <div className="container mx-auto px-4 md:px-8 lg:px-24 pt-24 pb-16">
//           <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto">
//             <div className="flex justify-center mb-6">
//               <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
//                 <AlertTriangle className="h-8 w-8 text-amber-600" />
//               </div>
//             </div>
//             <h1 className="text-2xl font-bold mb-4">
//               {dict.common.noProductsFound || "Product Not Found"}
//             </h1>
//             <p className="text-gray-600 mb-8">
//               {lang === "en"
//                 ? "The product you are looking for might have been removed or is temporarily unavailable."
//                 : lang === "ru"
//                 ? "Товар, который вы ищете, возможно, был удален или временно недоступен."
//                 : "Siz qidirayotgan mahsulot olib tashlangan yoki vaqtincha mavjud emas."}
//             </p>
//             <Link
//               href={`/${lang}/products`}
//               className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               {lang === "en"
//                 ? "Back to Products"
//                 : lang === "ru"
//                 ? "Вернуться к продуктам"
//                 : "Mahsulotlarga qaytish"}
//             </Link>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <>
//       <main className="min-h-screen bg-gray-50">
//         <Header hasHero={false} lang={lang} dictionary={dict} />
//         <div className="container mx-auto px-4 md:px-8 lg:px-24 space-y-12 pt-8 md:pt-16 lg:pt-24 pb-16">
//           <Suspense fallback={<ProductDetailSkeleton />}>
//             <ProductDetail product={product} lang={lang} dict={dict} />
//           </Suspense>

//           {product.short_descriptions &&
//           product.short_descriptions.length > 0 ? (
//             <div className="space-y-6">
//               <h2 className="text-2xl font-bold">{dict.common.learnMore}</h2>
//               <div className="space-y-4">
//                 {product.short_descriptions.map((detail) => (
//                   <AdditionalDetails
//                     key={detail.id.toString()}
//                     title={
//                       detail.translations && detail.translations[lang]
//                         ? detail.translations[lang].key || detail.key
//                         : detail.key || "Additional Information"
//                     }
//                     content={
//                       detail.translations && detail.translations[lang]
//                         ? detail.translations[lang].value || detail.value
//                         : detail.value || "Information not available"
//                     }
//                   />
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <h2 className="text-2xl font-bold mb-4">
//                 {dict.common.learnMore}
//               </h2>
//               <div className="p-4 bg-gray-50 rounded-lg text-center">
//                 <p className="text-gray-500">
//                   {lang === "en"
//                     ? "No additional information available for this product."
//                     : lang === "ru"
//                     ? "Дополнительная информация о товаре отсутствует."
//                     : "Bu mahsulot haqida qo'shimcha ma'lumot mavjud emas."}
//                 </p>
//               </div>
//             </div>
//           )}

//           <ViewingHistory
//             title={dict.common.recentlyViewed || "Recently Viewed"}
//             lang={lang}
//             learnMoreText={dict.common.learnMore}
//             // currentProductId={product.id.toString()}
//           />

//           {popularProducts.length > 0 ? (
//             <PopularProducts
//               title={dict.home.popularProducts}
//               products={popularProducts}
//               lang={lang}
//               learnMoreText={dict.common.learnMore}
//             />
//           ) : (
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <h2 className="text-2xl font-bold mb-4">
//                 {dict.home.popularProducts}
//               </h2>
//               <div className="p-4 bg-gray-50 rounded-lg text-center">
//                 <p className="text-gray-500">
//                   {lang === "en"
//                     ? "Popular products are currently unavailable."
//                     : lang === "ru"
//                     ? "Популярные товары в настоящее время недоступны."
//                     : "Mashhur mahsulotlar hozirda mavjud emas."}
//                 </p>
//               </div>
//             </div>
//           )}
//           <PopularProducts
//             title={dict.home.discountedProducts}
//             products={discountedProducts}
//             lang={lang}
//             learnMoreText={dict.common.learnMore}
//           />
//         </div>
//       </main>
//       <GetInTouch dictionary={dict} lang={lang} />
//       <Footer dictionary={dict} lang={lang} />
//     </>
//   );
// }

// // Skeleton loader for product detail
// function ProductDetailSkeleton() {
//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
//       <div className="flex flex-col lg:flex-row gap-8">
//         <div className="w-full lg:w-1/2">
//           <div className="aspect-square bg-gray-200 rounded-lg"></div>
//           <div className="flex mt-4 gap-2">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="h-16 w-16 bg-gray-200 rounded-md"></div>
//             ))}
//           </div>
//         </div>
//         <div className="w-full lg:w-1/2 space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-3/4"></div>
//           <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//           <div className="space-y-2">
//             <div className="h-4 bg-gray-200 rounded w-full"></div>
//             <div className="h-4 bg-gray-200 rounded w-full"></div>
//             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//           </div>
//           <div className="h-10 bg-gray-200 rounded w-1/3"></div>
//         </div>
//       </div>
//     </div>
//   );
// }
