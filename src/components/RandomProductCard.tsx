// src/components/RandomProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  featured?: boolean;
  discount?: number;
  originalPrice?: number;
}

interface RandomProductCardProps {
  product: Product;
}

const RandomProductCard = ({ product }: RandomProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    
    setIsAdding(true);
    
    // Add item to cart
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "/product.png",
      slug: product.slug,
    });
    
    // Show success notification
    toast.success("Added to cart!", {
      position: "top-right",
      duration: 2000,
    });
    
    // Reset button state after a short delay
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <Link href={"/" + product.slug} className="flex flex-col flex-grow">
        {/* Image wrapper smaller */}
        <div className="relative w-full h-56 overflow-hidden bg-gray-50">
          {product.featured && (
            <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
          {product.discount && (
            <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discount}% OFF
            </div>
          )}

          <Image
            src={product.image || "/product.png"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Product details tighter */}
        <div className="p-3 flex-grow">
          <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center mb-1">
            <p className="font-bold text-gray-900 text-base">KSH {product.price?.toLocaleString()}</p>
            {product.originalPrice && (
              <p className="text-xs text-gray-500 line-through ml-2">
                KSH {product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart button smaller */}
      <div className="px-3 pb-3">
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-1.5 text-xs font-medium rounded-md transition-colors duration-200 shadow-sm ${
            isAdding 
              ? 'bg-green-500 text-white cursor-not-allowed' 
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          {isAdding ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default RandomProductCard;