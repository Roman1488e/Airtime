"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import Image from "next/image";
import type { Dictionary, Locale, Product } from "@/types";
import { searchProducts as fetchSearchProducts } from "@/lib/api";

interface SearchBoxProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Locale;
  dictionary: Dictionary;
}

export default function SearchBox({
  onClose,
  isOpen,
  lang,
  dictionary,
}: SearchBoxProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Client-side only rendering
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const searchProducts = async () => {
      if (debouncedSearchTerm.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchProducts = await fetchSearchProducts(debouncedSearchTerm);
        setResults(searchProducts);
      } catch (error) {
        console.error("Error searching products:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [debouncedSearchTerm, isMounted]);

  const handleProductClick = (productId: string) => {
    router.push(`/${lang}/products/${productId}`);
    onClose();
  };

  // Server-side rendering bo'lsa, hech narsa ko'rsatmaymiz
  if (!isMounted) {
    return null;
  }

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0  bg-opacity-50 z-40 "
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="mt-4 animate-in z-50 fade-in-50 slide-in-from-top-5"
        ref={inputRef}
      >
        <div className="mt-4 bg-white z-50 rounded-lg shadow-lg p-4 relative">
          <div className="flex items-center border-b border-gray-300  pb-2">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              ref={inputRef}
              type="text"
              placeholder={dictionary.common.searchProducts}
              className="flex-1 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && (
            <div className="py-4 text-center text-gray-500">
              {dictionary.common.loading}
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="mt-2 max-h-60 overflow-y-auto">
              {results.map((product) => (
                <li
                  key={product.id.toString()}
                  className="py-2 px-2 hover:bg-gray-100 cursor-pointer flex items-center rounded-md"
                  onClick={() => handleProductClick(product.slug)}
                >
                  <div className="w-10 h-10 relative mr-3 flex-shrink-0">
                    {product.product_images &&
                    product.product_images.length > 0 ? (
                      <Image
                        src={product.product_images[0].image || "/default.png"}
                        alt={product.translations[lang]?.title || ""}
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-md"></div>
                    )}
                  </div>
                  <span>{product.translations[lang]?.title || ""}</span>
                </li>
              ))}
            </ul>
          )}

          {!loading && searchTerm.length >= 2 && results.length === 0 && (
            <div className="py-4 text-center text-gray-500">
              {dictionary.common.noProductsFound}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { Search, X } from "lucide-react";
// import { useDebounce } from "@/hooks/use-debounce";
// import Image from "next/image";
// import { Dictionary, Locale, Product } from "@/types";
// import { searchProducts as fetchSearchProducts } from "@/lib/api";

// interface SearchBoxProps {
//   onClose: () => void;
//   lang: Locale;
//   dictionary: Dictionary;
// }

// export default function SearchBox({
//   onClose,
//   lang,
//   dictionary,
// }: SearchBoxProps) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [results, setResults] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();
//   const debouncedSearchTerm = useDebounce(searchTerm, 300);

// useEffect(() => {
//   if (inputRef.current) {
//     inputRef.current.focus();
//   }
// }, []);

//   useEffect(() => {
//     const searchProducts = async () => {
//       if (debouncedSearchTerm.length < 3) {
//         setResults([]);
//         return;
//       }

//       setLoading(true);
//       try {
//         const searchProducts = await fetchSearchProducts(debouncedSearchTerm);

//         setResults(searchProducts);
//       } catch (error) {
//         console.error("Error searching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     searchProducts();
//   }, [debouncedSearchTerm]);

//   const handleProductClick = (productId: string) => {
//     router.push(`/${lang}/products/${productId}`);
//     onClose();
//   };

//   return (
//     <div className="mt-4 bg-white rounded-lg shadow-lg p-4 relative">
//       <div className="flex items-center border-b border-gray-300 pb-2">
//         <Search className="h-5 w-5 text-gray-400 mr-2" />
//         <input
//           ref={inputRef}
//           type="text"
//           placeholder={dictionary.common.searchProducts}
//           className="flex-1 outline-none"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//           <X className="h-5 w-5" />
//         </button>
//       </div>

//       {loading && (
//         <div className="py-4 text-center text-gray-500">
//           {dictionary.common.loading}
//         </div>
//       )}

//       {!loading && results.length > 0 && (
//         <ul className="mt-2 max-h-60 overflow-y-auto">
//           {results.map((product) => (
//             <li
//               key={product.id}
//               className="py-2 px-2 hover:bg-gray-100 cursor-pointer flex items-center rounded-md"
//               onClick={() => handleProductClick(product.slug)}
//             >
//               <div className="w-10 h-10 relative mr-3 flex-shrink-0">
//                 <Image
//                   src={product.product_images[0].image || "/default.png"}
//                   alt={product.translations[lang].title}
//                   className="w-full h-full object-contain"
//                 />
//               </div>
//               <span>{product.translations[lang].title}</span>
//             </li>
//           ))}
//         </ul>
//       )}

//       {!loading && searchTerm.length >= 2 && results.length === 0 && (
//         <div className="py-4 text-center text-gray-500">
//           {dictionary.common.noProductsFound}
//         </div>
//       )}
//     </div>
//   );
// }
