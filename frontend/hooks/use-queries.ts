"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchAdBanner,
  fetchBanners,
  fetchCategories,
  fetchPopularProducts,
  fetchProducts,
} from "@/lib/api";

export function useBanners() {
  return useQuery({ queryKey: ["banners"], queryFn: fetchBanners });
}

export function useAdBanners() {
  return useQuery({ queryKey: ["ad-banners"], queryFn: fetchAdBanner });
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
}

export function usePopularProducts() {
  return useQuery({
    queryKey: ["popular-products"],
    queryFn: fetchPopularProducts,
  });
}

export function useProducts(params: Parameters<typeof fetchProducts>[0]) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
  });
}

export function useInfiniteProducts(
  params: Omit<Parameters<typeof fetchProducts>[0], "page">
) {
  return useInfiniteQuery({
    queryKey: ["products-infinite", params],
    queryFn: ({ pageParam = 1 }) => {
      console.log(
        "Fetching products with pageParam:",
        pageParam,
        "params:",
        params
      );
      return fetchProducts({ ...params, page: pageParam });
    },
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.currentPage < lastPage.totalPages;
      const nextPage = hasMore ? lastPage.currentPage + 1 : undefined;
      console.log("getNextPageParam:", {
        currentPage: lastPage.currentPage,
        totalPages: lastPage.totalPages,
        hasMore,
        nextPage,
      });
      return nextPage;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
