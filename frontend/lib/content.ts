import rawSiteContent from "@/content/site.json";
import type {
  AboutCompany,
  AboutImage,
  BannerItem,
  Brands,
  Category,
  ContactInfo,
  FAQ,
  Product,
  SocialLinks,
} from "@/types";

type RawProduct = (typeof rawSiteContent.products)[number];

const categories = rawSiteContent.categories as Category[];
const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

function productWithCategory(product: RawProduct): Product {
  const category = categoryBySlug.get(product.category);
  if (!category) throw new Error(`Unknown category "${product.category}" for product "${product.slug}"`);

  return {
    ...product,
    category,
    title: product.translations.uz.title,
    description: product.translations.uz.description,
    created_at: "",
    updated_at: "",
  } as Product;
}

const products = rawSiteContent.products.map(productWithCategory);
const productBySlug = new Map(products.map((product) => [product.slug, product]));

const banners = rawSiteContent.banners.map((banner) => ({
  ...banner,
  product: banner.product ? productBySlug.get(banner.product) ?? null : null,
  category: banner.category ? categoryBySlug.get(banner.category) ?? null : null,
})) as BannerItem[];

export const siteContent = {
  categories,
  products,
  banners,
  aboutCompany: rawSiteContent.aboutCompany as AboutCompany[],
  aboutImages: rawSiteContent.aboutImages as AboutImage[],
  brands: rawSiteContent.brands as Brands[],
  faqs: rawSiteContent.faqs as FAQ[],
  contact: rawSiteContent.contact as ContactInfo,
  social: rawSiteContent.social as SocialLinks,
  formEndpoint: rawSiteContent.formEndpoint,
};
