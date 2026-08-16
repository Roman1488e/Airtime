import { Category, Locale } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: Category;
  lang: Locale;
}

export default function CategoryCard({ category, lang }: CategoryCardProps) {
  const { image, translations } = category;
  // const title = translations[lang as keyof typeof translations].title;
  // const title = translations[lang as keyof typeof translations].title;
  const title = translations[lang as keyof typeof translations]?.title || "";

  return (
    <div className="group relative w-full max-w-[180px] mx-auto transition-transform duration-300 ease-out hover:scale-105">
      <Link href={`/products?slug=${category.slug}`} className="block">
        <div className="relative aspect-square rounded-xl bg-surface shadow-md group-hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface-border">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover  transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPpDDZ0wAAAABJRU5ErkJggg=="
          />
        </div>
        <p className="mt-3 text-center text-sm md:text-base font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300 truncate">
          {title}
        </p>
      </Link>
    </div>
  );
}
