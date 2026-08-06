"use client";

import { useState, useEffect, useCallback } from "react";
import { cn, getDescription } from "@/lib/utils";
import type { Dictionary, HeroSlide, Locale } from "@/types";
import { fetchBanners } from "@/lib/api";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./button";

interface HeroCarouselProps {
  slides?: HeroSlide[];
  autoplaySpeed?: number;
  lang: Locale;
  dictionary: Dictionary;
}

export default function HeroCarousel({
  slides: initialSlides,
  autoplaySpeed = 5000,
  lang,
  dictionary,
}: HeroCarouselProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides || []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialSlides);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  // Fetch slides if not provided as props
  useEffect(() => {
    if (!initialSlides) {
      const getSlides = async () => {
        setIsLoading(true);
        const data = await fetchBanners();
        setSlides(data);
        setIsLoading(false);
      };
      getSlides();
    }
  }, [initialSlides]);

  const goToNextSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 500);
  }, [slides.length]);

  // Autoplay functionality
  useEffect(() => {
    if (slides.length <= 1 || autoplayPaused) return;

    const interval = setInterval(() => {
      goToNextSlide();
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [
    slides.length,
    autoplaySpeed,
    currentSlide,
    autoplayPaused,
    goToNextSlide,
  ]);

  const goToPrevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setIsTransitioning(false);
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 500);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-[50vh] md:min-h-screen flex items-center justify-center bg-red-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#383084]"></div>
      </div>
    );
  }

  // Handle empty slides
  if (!slides || slides.length === 0) {
    return null;
  }

  const slide = slides[currentSlide];

  return (
    <section
      className="relative w-full min-h-[50vh] md:min-h-screen pt-16 bg-cover bg-center bg-no-repeat transition-all duration-500 overflow-hidden"
      onMouseEnter={() => setAutoplayPaused(true)}
      onMouseLeave={() => setAutoplayPaused(false)}
    >
      {/* Background image with proper loading */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slide?.backgroundImage || "/default.png"}
          alt={
            slide.translations[lang as keyof typeof slide.translations]
              ?.title || "Slide background"
          }
          fill
          priority
          className={cn(
            "object-cover transition-opacity duration-500",
            isTransitioning ? "opacity-30" : "opacity-100"
          )}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-white/50"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-24 py-8 md:py-16 lg:py-24 h-full flex flex-col justify-center">
        <div className="w-full max-w-2xl  p-6 md:p-8 ">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            {slide.translations[lang]?.title ||
              slide.translations.uz.title ||
              slide.translations.ru.title ||
              slide.translations.en.title ||
              ""}
          </h1>

          <div
            className="text-gray-700 text-base md:text-lg mb-6 md:mb-8 richtext-content"
            dangerouslySetInnerHTML={getDescription(slide, lang)}
          />

          {slide.ctaLink && (
            <Button
              href={`${lang}${slide.ctaLink}`}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#383084] hover:bg-[#2d2670] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#383084] transition-colors duration-200"
            >
              {dictionary.common.learnMore}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/70 hover:bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#383084] transition-all duration-200"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/70 hover:bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#383084] transition-all duration-200"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </>
      )}

      {/* Dots navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#383084]",
                index === currentSlide
                  ? "bg-[#383084] w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
