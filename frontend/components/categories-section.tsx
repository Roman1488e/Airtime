import { Category, Locale } from "@/types";
import CategoryCard from "./category-card";

interface CategoriesSectionProps {
  title: string;
  categories: Category[];
  lang: Locale;
}

export default function CategoriesSection({
  title,
  categories,
  lang,
}: CategoriesSectionProps) {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[radial-gradient(circle_at_15%_15%,#dff4fa_0,transparent_30%),linear-gradient(135deg,#f5fbff_0%,#f7f5ff_52%,#eaf4fb_100%)] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-24 relative z-10">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-center text-gray-800 mb-8 md:mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
