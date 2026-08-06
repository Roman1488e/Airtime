import { fetchCategories, fetchProducts } from "@/lib/api";
const locales = ["uz", "ru", "en"];

export const dynamic = "force-static";

// Sitemap uchun URL ob'ektining turi
interface SitemapUrl {
  url: string;
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

// Sitemap funksiyasining turi
type SitemapFunction = () => Promise<SitemapUrl[]>;

// Sitemap funksiyasi
const sitemap: SitemapFunction = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://airtime.uz";

  // Base routes for each language
  const routes: SitemapUrl[] = locales.flatMap((locale: string) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/${locale}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/contacts`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/featured`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]);

  // Get all products
  let productRoutes: SitemapUrl[] = [];
  try {
    const products = await fetchProducts({ limit: 1000 });

    productRoutes = products.products.flatMap((product: { slug: string }) =>
      locales.map((locale: string) => ({
        url: `${baseUrl}/${locale}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }))
    );
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Get all categories
  let categoryRoutes: SitemapUrl[] = [];
  try {
    const categories = await fetchCategories();

    categoryRoutes = categories.flatMap((category: { slug: string }) =>
      locales.map((locale: string) => ({
        url: `${baseUrl}/${locale}/products?slug=${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      }))
    );
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
  }

  return [...routes, ...productRoutes, ...categoryRoutes];
};

export default sitemap;
