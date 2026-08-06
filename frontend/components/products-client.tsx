"use client";

import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import ProductCard from "./product-card";
import { LayoutGrid, List, Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary, Product, Locale, Category } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useInfiniteProducts } from "@/hooks/use-queries";
import { useQueryState, parseAsString, parseAsBoolean } from "nuqs";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface ProductsClientProps {
  initialProducts: Product[];
  initialTotalCount: number;
  categories: Category[];
  lang: Locale;
  dictionary: Dictionary;
  initialCategorySlug?: string;
}

export default function ProductsClient({
  initialProducts,
  initialTotalCount,
  categories,
  lang,
  dictionary,
}: ProductsClientProps) {
  // State for filters (synced with URL via nuqs)
  const [activeCategorySlug, setActiveCategorySlug] = useQueryState(
    "slug",
    parseAsString.withDefault("")
  );
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [isAvailable, setIsAvailable] = useQueryState(
    "is_available",
    parseAsBoolean.withDefault(true)
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Debounce the search query
  const debouncedSearchQuery = useDebounce<string>(searchQuery, 300);

  // Use TanStack Query infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteProducts({
    categorySlug: activeCategorySlug || undefined,
    search: debouncedSearchQuery || undefined,
    isAvailable,
    limit: 12,
  });

  // Flatten all products from all pages
  const products =
    data?.pages.flatMap((page) => page.products) ?? initialProducts;
  const totalCount = data?.pages[0]?.totalCount ?? initialTotalCount;

  // Debug logging
  console.log("ProductsClient Debug:", {
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    productsCount: products.length,
    totalCount,
    pagesCount: data?.pages.length,
    currentParams: { activeCategorySlug, debouncedSearchQuery, isAvailable },
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Handle category change
  const handleCategoryChange = (categorySlug: string) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    // alert(categorySlug);
    setActiveCategorySlug(categorySlug || null);
    // Reset horizontal scroll position to 0 when category changes
  };

  // Infinite scroll: load next page when sentinel becomes visible
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      console.log("Loading more products...", {
        hasNextPage,
        isFetchingNextPage,
        isFetching,
      });
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isFetching, fetchNextPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isFetching
        ) {
          console.log("Sentinel intersecting, triggering load more");
          loadMore();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isFetching, loadMore]);

  // Handle availability filter change
  const handleAvailabilityChange = (available: boolean) => {
    setIsAvailable(available);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveCategorySlug(null);
    setSearchQuery(null);
    setIsAvailable(true);
  };

  // Pagination UI removed (infinite scroll)

  // Find active category name
  const getActiveCategoryName = (): string => {
    if (!activeCategorySlug) return "";
    const category = categories.find((cat) => cat.slug === activeCategorySlug);
    return category
      ? category.translations[lang]?.title || category.translations.uz.title
      : "";
  };

  return (
    <div className="container mx-auto products-section">
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2 bg-white py-3 px-4 rounded-lg shadow-sm border border-gray-200 text-gray-700 font-medium"
        >
          <Filter className="h-4 w-4" />
          {showFilters
            ? dictionary.common.hideFilters
            : dictionary.common.showFilters}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div
          className={cn(
            "md:w-64 flex-shrink-0",
            showFilters ? "block" : "hidden md:block"
          )}
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
            {/* Filters header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {dictionary.common.filters}
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {dictionary.common.clearAll}
              </button>
            </div>

            {/* Search filter */}
            <div className="p-4 border-b">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                {dictionary.common.search}
              </h4>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder={dictionary.common.searchProducts}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Category filter */}
            <div className="p-4 border-b">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                {dictionary.common.categories}
              </h4>
              <div className="space-y-2">
                <button
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                    activeCategorySlug === ""
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => handleCategoryChange("")}
                >
                  {dictionary.common.allProducts}
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id.toString()}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                      activeCategorySlug === category.slug
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => handleCategoryChange(category.slug)}
                  >
                    {category.translations[lang]?.title ||
                      category.translations.uz.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability filter */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                {dictionary.common.availability}
              </h4>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="availability"
                  checked={isAvailable}
                  onChange={(e) => handleAvailabilityChange(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="availability"
                  className="ml-2 text-sm text-gray-700"
                >
                  {dictionary.common.famousProducts}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Products section */}
        <div className="flex-1">
          {/* View controls */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {totalCount > 0
                ? activeCategorySlug
                  ? dictionary.common.productsFoundInCategory
                      .replace("{count}", totalCount.toString())
                      .replace("{category}", getActiveCategoryName())
                  : dictionary.common.productsFound.replace(
                      "{count}",
                      totalCount.toString()
                    )
                : dictionary.common.noProductsFound}
            </div>

            <div className="flex space-x-2">
              <button
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "grid"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                )}
                onClick={() => setViewMode("grid")}
                aria-label={dictionary.common.gridView}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "list"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                )}
                onClick={() => setViewMode("list")}
                aria-label={dictionary.common.listView}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Initial loading indicator */}
          {isLoading && (
            <div className="flex justify-center items-center py-12 bg-white rounded-xl shadow-sm">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600 font-medium">
                {lang === "en"
                  ? "Loading products..."
                  : lang === "ru"
                  ? "Загрузка товаров..."
                  : "Mahsulotlar yuklanmoqda..."}
              </span>
            </div>
          )}

          {/* No products message */}
          {!isLoading && !isFetching && products.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                  <X className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {dictionary.common.noProductsFound}
                </h3>
                <p className="text-gray-500 mb-6">
                  {dictionary.common.noProductsFoundMessage}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {dictionary.common.clearFilters}
                </button>
              </div>
            </div>
          )}

          {/* Filter loading indicator */}
          {isFetching && !isLoading && (
            <div className="flex justify-center items-center py-6 bg-white rounded-xl shadow-sm mb-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-sm text-gray-600">
                {lang === "en"
                  ? "Applying filters..."
                  : lang === "ru"
                  ? "Применение фильтров..."
                  : "Filtrlar qo'llanilmoqda..."}
              </span>
            </div>
          )}

          {/* Product grid/list */}
          {!isLoading && products.length > 0 && (
            <>
              {viewMode === "grid" ? (
                // Grid view
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id.toString()}
                      product={product}
                      lang={lang}
                      learnMoreText={dictionary.common.learnMore}
                      className="h-full"
                      showDescription={true}
                      simplified={true}
                    />
                  ))}
                </div>
              ) : (
                // List view
                <div className="space-y-6">
                  {products.map((product) => {
                    const productImage =
                      product.product_images &&
                      product.product_images.length > 0
                        ? product.product_images[0].image
                        : "/default.png";
                    const title =
                      product.translations[lang]?.title || product.title;
                    const description =
                      product.translations[lang]?.description ||
                      product.description;
                    const categoryName =
                      product.category?.translations[lang]?.title || "";
                    const hasDiscount =
                      product.discounted_price !== null &&
                      product.discounted_price !== "";

                    return (
                      <div
                        key={product.id.toString()}
                        className="flex flex-col sm:flex-row border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="sm:w-1/3 md:w-1/4 bg-gray-50 p-4 flex items-center justify-center">
                          <div className="relative h-40 w-full">
                            <Image
                              src={productImage}
                              alt={title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="sm:w-2/3 md:w-3/4 p-6 flex flex-col">
                          <div className="mb-2">
                            {categoryName && (
                              <span className="text-xs text-indigo-600 font-medium mb-1 block">
                                {categoryName}
                              </span>
                            )}
                            <h3 className="text-xl font-medium text-gray-900 mb-3">
                              {title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {description}
                            </p>
                          </div>

                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center">
                              {hasDiscount ? (
                                <>
                                  <span className="font-bold text-lg text-indigo-700">
                                    ${product.discounted_price}
                                  </span>
                                  <span className="text-sm text-gray-400 line-through ml-2">
                                    ${product.price}
                                  </span>
                                </>
                              ) : (
                                <span className="font-bold text-lg text-indigo-700">
                                  ${product.price}
                                </span>
                              )}
                            </div>

                            <Link
                              href={`/${lang}/products/${product.slug}`}
                              className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors flex items-center"
                            >
                              {dictionary.common.learnMore}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Infinite scroll sentinel and loader */}
              <div ref={sentinelRef} className="h-8 w-full" />

              {/* Loading more products */}
              {isFetchingNextPage && (
                <div className="mt-6 flex justify-center">
                  <div className="bg-white rounded-xl shadow-sm px-4 py-3 inline-flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                    <span className="ml-3 text-sm text-gray-600">
                      {dictionary.common.loading}
                    </span>
                  </div>
                </div>
              )}

              {/* No more products message */}
              {!hasNextPage && !isFetchingNextPage && products.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <div className="bg-gray-50 rounded-xl px-4 py-3 inline-flex items-center">
                    <span className="text-sm text-gray-500">
                      {lang === "en"
                        ? "No more products available"
                        : lang === "ru"
                        ? "Больше товаров нет"
                        : "Boshqa mahsulotlar yo'q"}
                    </span>
                  </div>
                </div>
              )}

              {/* Load more button (fallback for manual loading) */}
              {hasNextPage && !isFetchingNextPage && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={loadMore}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {lang === "en"
                      ? "Load more products"
                      : lang === "ru"
                      ? "Загрузить еще товары"
                      : "Ko'proq mahsulotlar yuklash"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
