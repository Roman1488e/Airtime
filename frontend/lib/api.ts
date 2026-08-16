import type {
  AboutCompany,
  AboutImage,
  Brands,
  Category,
  ContactInfo,
  FAQ,
  HeroSlide,
  Product,
  SocialLinks,
} from "@/types";
import { siteContent } from "./content";

export async function fetchBanners(): Promise<HeroSlide[]> {
  return siteContent.banners
    .filter((banner) => !banner.is_advertisement)
    .map((banner) => ({
      id: banner.id,
      translations: banner.translations as HeroSlide["translations"],
      backgroundImage: banner.web_image,
      ctaLink: banner.product ? `/products/${banner.product.slug}` : banner.category ? `/products?slug=${banner.category.slug}` : false,
    }));
}

export async function fetchAdBanner(): Promise<HeroSlide[]> {
  return siteContent.banners
    .filter((banner) => banner.is_advertisement)
    .map((banner) => ({
      id: banner.id,
      translations: banner.translations as HeroSlide["translations"],
      backgroundImage: banner.web_image,
      ctaLink: banner.product ? `/products/${banner.product.slug}` : banner.category ? `/products?slug=${banner.category.slug}` : false,
    }));
}

export async function fetchCategories(): Promise<Category[]> {
  return siteContent.categories;
}

export async function fetchPopularProducts(): Promise<Product[]> {
  return siteContent.products.filter((product) => product.is_available);
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  return siteContent.products.filter((product) => product.discounted_price || (product as Product & { featured?: boolean }).featured);
}

export async function fetchProducts({ categorySlug, page = 1, limit = 12, search = "", isAvailable = true }: {
  categorySlug?: string;
  page?: number;
  limit?: number;
  search?: string;
  isAvailable?: boolean;
}): Promise<{ products: Product[]; totalCount: number; totalPages: number; currentPage: number }> {
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filtered = siteContent.products.filter((product) => {
    const searchableText = Object.values(product.translations)
      .flatMap((translation) => [translation.title, translation.description])
      .join(" ")
      .toLocaleLowerCase();
    return (!categorySlug || product.category.slug === categorySlug) &&
      (!isAvailable || product.is_available) &&
      (!normalizedSearch || searchableText.includes(normalizedSearch));
  });
  const totalCount = filtered.length;
  return {
    products: filtered.slice((page - 1) * limit, page * limit),
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  return siteContent.products.find((product) => product.slug === slug) ?? null;
}
export async function fetchProductById(id: string): Promise<Product | null> { return fetchProductBySlug(id); }
export async function fetchAboutCompany(): Promise<AboutCompany[]> { return siteContent.aboutCompany; }
export async function fetchAboutImages(): Promise<AboutImage[]> { return siteContent.aboutImages; }
export async function fetchFAQs(): Promise<FAQ[]> { return siteContent.faqs; }
export async function fetchContactInfo(): Promise<ContactInfo[]> { return [siteContent.contact]; }
export async function fetchSocialLinks(): Promise<SocialLinks[]> { return [siteContent.social]; }
export async function fetchBrands(): Promise<Brands[]> { return siteContent.brands; }
export async function searchProducts(query: string): Promise<Product[]> { return (await fetchProducts({ search: query, limit: Number.MAX_SAFE_INTEGER })).products; }

export async function submitContactForm(
  formData: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    message: string;
    website: string;
  },
  language: Locale
) {
  if (!siteContent.formEndpoint) {
    const subject = encodeURIComponent(
      `Website message from ${formData.first_name} ${formData.last_name}`
    );
    const body = encodeURIComponent(
      `Phone: ${formData.phone}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.location.href = `mailto:${siteContent.contact.email}?subject=${subject}&body=${body}`;
    return { delivered: false };
  }
  const response = await fetch(siteContent.formEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...formData, language }),
  });
  if (!response.ok) throw new Error("Contact form submission failed");
  return response.json().catch(() => ({ delivered: true }));
}
