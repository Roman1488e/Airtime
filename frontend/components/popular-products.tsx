"use client";

import type { Locale, Product } from "@/types";
import ProductCard from "./product-card";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PopularProductsProps {
  title: string;
  products: Product[];
  lang: string;
  learnMoreText: string;
}

export default function PopularProducts({
  title,
  products,
  lang,
  learnMoreText,
}: PopularProductsProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const scrollAmount = carouselRef.current.clientWidth * 0.8;
    const newScrollLeft =
      direction === "left"
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

    carouselRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });

    // Update button states after scrolling
    setTimeout(checkScrollButtons, 500);
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>

          <div className="flex space-x-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border ${
                canScrollLeft
                  ? "bg-white hover:bg-gray-100 text-gray-800"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border ${
                canScrollRight
                  ? "bg-white hover:bg-gray-100 text-gray-800"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex overflow-x-auto pb-4 scrollbar-thin gap-4 md:gap-6 scroll-smooth"
          onScroll={checkScrollButtons}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-none w-[280px] md:w-[320px]">
              <ProductCard
                product={product}
                lang={lang as Locale}
                learnMoreText={learnMoreText}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
