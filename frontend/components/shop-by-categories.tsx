import Image from "next/image";
import React from "react";

const ShopByCategories = () => {
  return (
    <div className="h-screen relative py-24">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Shop by categories
      </h1>
      <div>
        <div className="">
          <div className="relative w-full h-full">
            <Image
              src="/product.png"
              alt="Product"
              width={100}
              height={100}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopByCategories;
