"use client";

import { useEffect, useState, useRef } from "react";
import type { Locale, Product } from "@/types";
import ProductCard from "./product-card";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface ViewingHistoryProps {
  title: string;
  lang: string;
  learnMoreText: string;
}

export default function ViewingHistory({
  title,
  lang,
  learnMoreText,
}: ViewingHistoryProps) {
  const [historyProducts, setHistoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      loadViewingHistory();
    }
  }, []);

  const loadViewingHistory = () => {
    try {
      setLoading(true);

      // Get viewing history IDs
      const historyJson = localStorage.getItem("viewingHistory");
      if (!historyJson) {
        setLoading(false);
        return;
      }

      const history = JSON.parse(historyJson);
      if (!history || !history.length) {
        setLoading(false);
        return;
      }

      // Get products cache
      const productsCache = localStorage.getItem("productsCache");
      const cache = productsCache ? JSON.parse(productsCache) : {};

      // Build products array from cache
      const products: Product[] = [];

      history.forEach((item: { id: string | number }) => {
        if (cache[item.id]?.product) {
          products.push(cache[item.id].product);
        }
      });

      setHistoryProducts(products);
      setLoading(false);

      // Check scroll buttons after products are loaded
      setTimeout(checkScrollButtons, 100);
    } catch (error) {
      console.error("Error loading viewing history:", error);
      setLoading(false);
    }
  };

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
  }, [historyProducts]);

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

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  if (historyProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 relative overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          </div>

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
          {historyProducts.map((product) => (
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
