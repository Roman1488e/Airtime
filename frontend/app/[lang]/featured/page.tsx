import Header from "@/components/header";
import { getDictionary } from "@/dictionaries";
import { Locale } from "@/types";
import { fetchAdBanner, fetchBanners, fetchCategories } from "@/lib/api";
import FeaturedProduct from "@/components/featured-product";
import HeroCarousel from "@/components/hero-carousel";
import Footer from "@/components/footer";
import GetInTouch from "@/components/get-in-touch";
export default async function FeaturedPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const adBanners = await fetchAdBanner();
  const banners = await fetchBanners();
  const categories = await fetchCategories();

  return (
    <>
      <Header
        categories={categories}
        hasHero={true}
        lang={lang as Locale}
        dictionary={dict}
      />
      <HeroCarousel dictionary={dict} slides={banners} lang={lang} />
      <main>
        <div className="container mx-auto px-4 pt-24 pb-16">
          <h1 className="text-3xl font-bold mb-10 text-center">
            {dict.featured.title}
          </h1>
          <div className="">
            {adBanners.map((adBanner, i) => (
              <FeaturedProduct
                ctaText="Learn More"
                adBanner={adBanner}
                lang={lang as Locale}
                key={adBanner.id}
                imagePosition={i % 2 === 0 ? "left" : "right"} // Alternate image position
              />
            ))}
          </div>
        </div>
      </main>
      <GetInTouch dictionary={dict} lang={lang} />
      <Footer dictionary={dict} lang={lang} />
    </>
  );
}
