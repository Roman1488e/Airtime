import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Product, Locale } from "@/types";
import { ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  lang: Locale;
  className?: string;
  learnMoreText?: string;
  showDescription?: boolean;
  simplified?: boolean;
}

export default function ProductCard({
  product,
  lang,
  className = "",
  learnMoreText = "Learn more",
  showDescription = false,
  simplified = false,
}: ProductCardProps) {
  // Get the main product image or use placeholder
  const productImage =
    product.product_images && product.product_images.length > 0
      ? product.product_images[0].image
      : "/default.png";

  // Get translated title and description
  const title = product.translations[lang]?.title || product.title;
  const description =
    product.translations[lang]?.description || product.description;

  // Get category name in the current language
  const categoryName = product.category?.translations[lang]?.title || "";

  // Simplified card for grid view
  if (simplified) {
    return (
      <div
        className={cn(
          "bg-surface border border-surface-border rounded-xl shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-md flex flex-col h-full",
          className
        )}
      >
        {/* Image container */}
        <div className="relative p-4 flex items-center justify-center bg-gray-50/50">
          <Link
            href={`/${lang}/products/${product.slug}`}
            className="block w-full"
          >
            <div className="h-40 flex items-center justify-center overflow-hidden">
              <Image
                src={productImage || "/default.png"}
                alt={title}
                width={160}
                height={160}
                className="object-contain h-full w-auto transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </Link>
        </div>

        {/* Content container */}
        <div className="p-4 flex-grow flex flex-col">
          {/* Title */}
          <Link
            href={`/${lang}/products/${product.slug}`}
            className="block group-hover:text-indigo-700 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-1 sm:line-clamp-1 lg:line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Description (shown if requested, limited to 2 lines) */}
          {showDescription && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-1 sm:line-clamp-1 lg:line-clamp-2">
              {description}
            </p>
          )}

          {/* Learn more link */}
          <div className="mt-auto">
            <Link
              href={`/${lang}/products/${product.slug}`}
              className="inline-flex items-center gap-1 text-[0.68rem] font-extrabold uppercase tracking-[0.13em] text-[#383084] transition-colors hover:text-[#211d4f]"
            >
              {learnMoreText}
              <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Full featured card - removed to simplify
  return (
    <div
      className={cn(
        "bg-surface border border-surface-border rounded-xl shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-md flex flex-col h-full",
        className
      )}
    >
      {/* Image container */}
      <div className="relative p-4 flex items-center  overflow-hidden justify-center bg-gray-50/50">
        <Link
          href={`/${lang}/products/${product.slug}`}
          className="block w-full"
        >
          <div className="h-48   flex items-center justify-center overflow-hidden">
            <Image
              src={productImage || "/default.png"}
              alt={title}
              fill
              className="object-contain object-top  h-full w-auto transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </Link>
      </div>

      {/* Content container */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Category */}
        {categoryName && (
          <span className="text-xs text-indigo-600 font-medium mb-2 block">
            {categoryName}
          </span>
        )}

        {/* Title */}
        <Link
          href={`/${lang}/products/${product.slug}`}
          className="block group-hover:text-indigo-700 transition-colors"
        >
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Description (optional) */}
        {showDescription && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Learn more link */}
        <div className="mt-auto">
          <Link
            href={`/${lang}/products/${product.slug}`}
            className="inline-flex items-center gap-1 text-[0.68rem] font-extrabold uppercase tracking-[0.13em] text-[#383084] transition-colors hover:text-[#211d4f]"
          >
            {learnMoreText}
            <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
