import { Brands } from "@/types";
import Image from "next/image";

interface BrandCarouselProps {
  brands: Brands[];
}

const BrandCarousel = ({ brands }: BrandCarouselProps) => {
  if (brands.length < 1) return null;

  return (
    <div className="relative w-full overflow-hidden py-6">
      <div
        className={`flex ${
          brands.length > 4
            ? "animate-scroll"
            : "grid grid-cols-2 md:grid-cols-4 gap-6"
        }`}
      >
        {brands.map((item) => (
          <div
            key={item.id}
            title={item.company_name}
            className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 
              shadow-lg hover:shadow-2xl transition-all duration-300 p-6 mx-3
              border border-gray-100 hover:border-blue-100 flex-shrink-0 w-48 md:w-60"
          >
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent 
              opacity-0 hover:opacity-100 transition-opacity duration-300"
            />

            <Image
              src={item.logo_image || "/logo.png"}
              alt={`Brand ${item.company_name}`}
              fill
              className="object-contain p-8 transition-transform duration-300 hover:scale-105"
            />

            <div
              className="absolute bottom-0 left-0 right-0 p-4 
              opacity-0 hover:opacity-100 transition-opacity duration-300
              bg-gradient-to-t from-black/60 to-transparent"
            >
              <p className="text-white text-sm font-medium truncate">
                {item.company_name}
              </p>
            </div>
          </div>
        ))}
        {brands.length > 4 &&
          brands.map((item) => (
            <div
              key={`duplicate-${item.id}`}
              title={item.company_name}
              className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 
                shadow-lg hover:shadow-2xl transition-all duration-300 p-6 mx-3
                border border-gray-100 hover:border-blue-100 flex-shrink-0 w-48 md:w-60"
            >
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent 
                opacity-0 hover:opacity-100 transition-opacity duration-300"
              />

              <Image
                src={item.logo_image || "/logo.png"}
                alt={`Brand ${item.company_name}`}
                fill
                className="object-contain p-8 transition-transform duration-300 hover:scale-105"
              />

              <div
                className="absolute bottom-0 left-0 right-0 p-4 
                opacity-0 hover:opacity-100 transition-opacity duration-300
                bg-gradient-to-t from-black/60 to-transparent"
              >
                <p className="text-white text-sm font-medium truncate">
                  {item.company_name}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BrandCarousel;
