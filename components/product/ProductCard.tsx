"use client";
import { formatPrice, truncateText } from "@/lib/utils";
import { Product } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductCardProps {
  products: Product | null;
}

const ProductCard = ({ products }: ProductCardProps) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => router.push(`/product/${products?.id}`)}
      className="
        col-span-1
        cursor-pointer
        p-2
        text-center
        text-sm
      "
    >
      <div className="flex flex-col items-center w-full gap-1">
        <div
          className="aspect-square overflow-hidden relative w-full h-[220px] transition-transform duration-500 ease-in-out transform"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Image
            fill
            sizes="30"
            className="w-full h-full object-cover rounded-md transition-opacity duration-300 ease-in-out"
            src={
              hovered
                ? products?.images[1]?.url || ""
                : products?.images[0]?.url || ""
            }
            alt={products?.title || "product image"}
          />
        </div>
        <div className="mt-4">{truncateText(products?.title || "")}</div>5 sytar
        rating here
        <div>43 reviews</div>
        <div className="font-semibold">{formatPrice(products?.price || 0)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
