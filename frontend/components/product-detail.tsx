"use client";

import type React from "react";
import type { Dictionary, Locale, Product } from "@/types";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X, Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import Script from "next/script";

interface ProductDetailProps {
  product: Product;
  lang: Locale;
  dict: Dictionary;
}

export default function ProductDetail({ product, lang }: ProductDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // Check if product has images
  const hasMultipleImages =
    product.product_images && product.product_images.length > 1;

  // Client-side only code
  useEffect(() => {
    setIsMounted(true);
    // Save product to viewing history when component mounts
    if (product) {
      saveToViewingHistory(product);
    }
  }, [product]);

  const saveToViewingHistory = (product: Product) => {
    try {
      // Get existing history from localStorage
      const historyJson = localStorage.getItem("viewingHistory");
      let history: Array<{ id: string | number; timestamp: number }> =
        historyJson ? JSON.parse(historyJson) : [];

      // Check if product already exists in history
      const existingIndex = history.findIndex((item) => item.id === product.id);

      // If exists, remove it to add it to the top
      if (existingIndex !== -1) {
        history.splice(existingIndex, 1);
      }

      // Add product to history with timestamp
      history.unshift({
        id: product.id,
        timestamp: Date.now(),
      });

      // Limit history to 20 items
      if (history.length > 20) {
        history = history.slice(0, 20);
      }

      // Save back to localStorage
      localStorage.setItem("viewingHistory", JSON.stringify(history));

      // Also save product details to avoid additional API calls
      const productsCache = localStorage.getItem("productsCache");
      const cache = productsCache ? JSON.parse(productsCache) : {};

      // Add or update product in cache
      cache[product.id] = {
        product: {
          id: product.id,
          title: product.title,
          translations: product.translations,
          product_images: product.product_images,
          price: product.price,
          discounted_price: product.discounted_price,
          category: product.category,
          slug: product.slug,
        },
        timestamp: Date.now(),
      };

      // Limit cache size (remove items older than 7 days)
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      Object.keys(cache).forEach((key) => {
        if (cache[key].timestamp < oneWeekAgo) {
          delete cache[key];
        }
      });

      localStorage.setItem("productsCache", JSON.stringify(cache));
    } catch (error) {
      console.error("Error saving to viewing history:", error);
    }
  };

  const nextImage = () => {
    if (!product.product_images || product.product_images.length <= 1) return;
    setActiveImageIndex((prev) =>
      prev === product.product_images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!product.product_images || product.product_images.length <= 1) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? product.product_images.length - 1 : prev - 1
    );
  };

  const selectImage = (index: number) => {
    setActiveImageIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  function copyToClipboard(text: string) {
    if (!isMounted) return;

    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy: ", err);
      }
    );
  }

  // Safely get product data with fallbacks
  const productTitle =
    product.translations && product.translations[lang]
      ? product.translations[lang].title
      : product.title || "Product";

  const productDescription =
    product.translations && product.translations[lang]
      ? product.translations[lang].description
      : product.description || "No description available";

  const productImage =
    product.product_images && product.product_images.length > 0
      ? product.product_images[activeImageIndex]?.image
      : "/default.png";

  const categoryName =
    product.category &&
    product.category.translations &&
    product.category.translations[lang]
      ? product.category.translations[lang].title
      : product.category.translations.uz?.title || "";

  const currentPrice = Number(product.discounted_price || product.price);
  const hasPrice = Number.isFinite(currentPrice) && currentPrice > 0;

  // Structured data for product
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: productTitle,
    description: productDescription,
    image: productImage,
    sku: product.id.toString(),
    mpn: product.id.toString(),
    brand: {
      "@type": "Brand",
      name: "Air Time",
    },
    ...(hasPrice && {
      offers: {
        "@type": "Offer",
        url: typeof window !== "undefined" ? window.location.href : "",
        priceCurrency: "UZS",
        price: product.discounted_price || product.price,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        availability: product.is_available
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    }),
  };

  return (
    <>
      {/* Structured Data */}
      <Script id="product-structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>

      {/* Existing JSX */}
      <div className="bg-surface border border-surface-border mt-12 rounded-xl shadow-md overflow-hidden mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-4 md:p-8">
            <div className="relative">
              <div
                className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 cursor-zoom-in"
                onClick={toggleZoom}
                onMouseMove={handleMouseMove}
              >
                <Image
                  src={productImage || "/default.png"}
                  alt={productTitle}
                  fill
                  className={`object-cover transition-transform duration-200 ${
                    isZoomed ? "scale-180" : ""
                  }`}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }
                      : {}
                  }
                  priority
                />

                {isMounted && !isZoomed && hasMultipleImages && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {isMounted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleZoom();
                    }}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                    aria-label={isZoomed ? "Exit zoom" : "Zoom image"}
                  >
                    {isZoomed ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <ZoomIn className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>

              {isMounted && hasMultipleImages && !isZoomed && (
                <div className="flex mt-4 space-x-2 overflow-x-auto pb-2 scrollbar-thin">
                  {product.product_images.map((img, index) => (
                    <button
                      key={img.id.toString()}
                      onClick={() => selectImage(index)}
                      className={`relative h-16 w-16 rounded-md overflow-hidden border-2 ${
                        activeImageIndex === index
                          ? "border-primary"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={img.image || "/default.png"}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-4 md:p-8 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {productTitle}
            </h1>

            {categoryName && (
              <div className="mb-4 text-sm text-primary font-medium">
                {categoryName}
              </div>
            )}

            <p className="text-gray-700 mb-6 flex-grow">{productDescription}</p>

            <div className="space-y-6 mt-auto">
              {hasPrice && <div className="flex items-baseline">
                {product.discounted_price ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "UZS",
                        minimumFractionDigits: 0,
                      }).format(Number(product.discounted_price))}
                    </span>
                    <span className="ml-2 text-lg text-gray-500 line-through">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "UZS",
                        minimumFractionDigits: 0,
                      }).format(Number(product.price))}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "UZS",
                      minimumFractionDigits: 0,
                    }).format(Number(product.price))}
                  </span>
                )}
              </div>}

              {isMounted && product.barcodes && product.barcodes.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th scope="col" className="px-4 py-2">
                          {lang === "en"
                            ? "Key"
                            : lang === "ru"
                            ? "Ключ"
                            : "Kalit"}
                        </th>
                        <th scope="col" className="px-4 py-2">
                          {lang === "en"
                            ? "Value"
                            : lang === "ru"
                            ? "Значение"
                            : "Qiymat"}
                        </th>
                        <th scope="col" className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.barcodes.map((barcode, index) => (
                        <tr key={index} className="bg-surface border-b">
                          <td className="px-4 py-2">{barcode.key}</td>
                          <td className="px-4 py-2">{barcode.value}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => {
                                copyToClipboard(barcode.value);
                                console.log(barcode);
                              }}
                              className="text-primary flex justify-center items-center gap-2 hover:underline"
                            >
                              <Copy size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="pt-4">
                <a
                  href={`/${lang}/contacts`}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {lang === "en"
                    ? "Contact for Purchase"
                    : lang === "ru"
                    ? "Связаться для покупки"
                    : "Xarid uchun bog'laning"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
