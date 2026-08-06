import Image from "next/image";
import Button from "./button";
import { HeroSlide, Locale } from "@/types";
import { cn, getDescription } from "@/lib/utils";

interface FeaturedProductProps {
  adBanner: HeroSlide;
  lang: Locale;
  ctaText?: string;
  imagePosition?: "left" | "right"; // New prop to control image position
}

export default function FeaturedProduct({
  adBanner,
  lang,
  imagePosition = "left", // Default to left if not specified
  ctaText = "Learn More",
}: FeaturedProductProps) {
  if (!adBanner) return null;
  const { translations, backgroundImage, ctaLink } = adBanner;

  const title = translations[lang]?.title || translations.en.title || "";

  return (
    <section className="py-16 px-4 md:px-8 lg:px-24 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="overflow-hidden rounded-[2rem] bg-[#f6f5fb]">
          <div
            className={`flex flex-col ${
              imagePosition === "right" ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            <div className="w-full md:w-1/2 overflow-hidden">
              <div className="h-full w-full relative aspect-[4/3] md:aspect-auto">
                <Image
                  src={backgroundImage || "/default.png"}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center">
              <h2
                className={cn(
                  `text-4xl md:text-5xl lg:text-6xl font-semibold leading-[.95] mb-5`,
                  imagePosition === "right" ? "text-right" : "text-left"
                )}
              >
                {/* {title[lang as keyof typeof title]} */}
                {title}
              </h2>

              <div
                className={cn(
                  "text-gray-700 text-base md:text-lg mb-6 md:mb-8 richtext-content",
                  imagePosition === "right" ? "text-right" : "text-left"
                )}
                dangerouslySetInnerHTML={getDescription(adBanner, lang)}
              />
              <div
                className={cn(
                  "text-right",
                  imagePosition === "right" ? "text-right" : "text-left"
                )}
              >
                {ctaLink && <Button href={ctaLink!}>{ctaText}</Button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
