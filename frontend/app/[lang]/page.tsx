import CategoriesSection from "@/components/categories-section";
import FeaturedProduct from "@/components/featured-product";
import Header from "@/components/header";
import HeroCarousel from "@/components/hero-carousel";
import PopularProducts from "@/components/popular-products";
import { getDictionary } from "@/dictionaries";
import Footer from "@/components/footer";
import type { Locale } from "@/types";
import {
  fetchAdBanner,
  fetchBanners,
  fetchCategories,
  fetchFeaturedProducts,
  fetchPopularProducts,
} from "@/lib/api";
import GetInTouch from "@/components/get-in-touch";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const heroSlides = await fetchBanners();
  const categories = await fetchCategories();
  const popularProducts = await fetchPopularProducts();
  const discountedProducts = await fetchFeaturedProducts();
  const adBanner = (await fetchAdBanner())[0]; // Assuming the first item is the desired HeroSlide

  return (
    <>
      <Header
        hasHero={true}
        categories={categories}
        lang={lang as Locale}
        dictionary={dict}
      />
      <main>
        <HeroCarousel
          slides={heroSlides}
          lang={lang as Locale}
          dictionary={dict}
        />
        <CategoriesSection
          categories={categories}
          lang={lang as Locale}
          title={dict.home.shopByCategories}
        />
        <FeaturedProduct adBanner={adBanner} lang={lang as Locale} />
        <div className="px-4 md:px-4 lg:px-16 py-6">
          <PopularProducts
            title={dict.home.popularProducts}
            products={popularProducts}
            lang={lang}
            learnMoreText={dict.common.learnMore}
          />
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
