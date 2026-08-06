"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Locale, Product } from "@/types";

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
  language: Locale;
}

export function RelatedProducts({
  categoryId,
  currentProductId,
  language,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, you would fetch related products
    // For now, we'll use mock data
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockProducts = Array(4)
        .fill(null)
        .map((_, index) => ({
          id: currentProductId + index + 1,
          translations: {
            uz: {
              title: `Mahsulot ${index + 1}`,
              description: `Tavsif ${index + 1}`,
            },
            ru: {
              title: `Продукт ${index + 1}`,
              description: `Описание ${index + 1}`,
            },
            en: {
              title: `Product ${index + 1}`,
              description: `Description ${index + 1}`,
            },
          },
          title: `Product ${index + 1}`,
          price: `${(Math.random() * 50000 + 10000).toFixed(2)}`,
          discounted_price:
            index % 2 === 0
              ? `${(Math.random() * 40000 + 10000).toFixed(2)}`
              : null,
          product_images: [
            { id: 1, image: "/default.png?height=300&width=300" },
          ],
          category: {
            id: categoryId,
            translations: {
              uz: { title: "Kategoriya" },
              ru: { title: "Категория" },
              en: { title: "Category" },
            },
            image: "",
            is_featured: true,
          },
          is_available: true,
          slug: `product-${index + 1}`,
          short_descriptions: [],
          created_at: "",
          updated_at: "",
          barcodes: [],
          description: "",
        }));

      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, [categoryId, currentProductId]);

  const formatPrice = (price: string | null) => {
    if (!price) return "";
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 2,
    }).format(Number.parseFloat(price));
  };

  const getTranslation = (product: Product, field: "title" | "description") => {
    return product.translations[language]?.[field] || product[field];
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <Card key={index} className="border rounded-lg overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <Card className="border rounded-lg overflow-hidden h-full hover:shadow-md transition-shadow">
              <div className="relative aspect-square">
                <Image
                  src={
                    product.product_images[0]?.image ||
                    "/default.png?height=300&width=300"
                  }
                  alt={getTranslation(product, "title")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {product.discounted_price && (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    Sale
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-2">
                  {getTranslation(product, "title")}
                </h3>
                <div className="mt-2">
                  {product.discounted_price ? (
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-purple-600">
                        {formatPrice(product.discounted_price)}
                      </p>
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  ) : (
                    <p className="font-bold text-purple-600">
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
