// src/components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { toast } from "sonner"; // Optional: for success notifications

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  featured?: boolean;
  discount?: number;
  originalPrice?: number;
  shortDesc?: string;
  images?: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
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
    
    // Optional: Show success notification
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
        {/* Image wrapper with badges */}
        <div className="relative w-full h-72 overflow-hidden bg-gray-50">
          {/* Badges - Sale, Featured, etc. */}
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
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover image swap */}
          {product.images && product.images[1] && (
            <Image
              src={product.images[1] || "/product.png"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className="object-contain p-4 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </div>

        {/* Product details */}
        <div className="p-4 flex-grow">
          <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Price section */}
          <div className="flex items-center mb-2">
            <p className="font-bold text-gray-900 text-lg">KSH {product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <p className="text-sm text-gray-500 line-through ml-2">
                KSH {product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          {/* Optional short description */}
          {product.shortDesc && (
            <div
              className="text-xs text-gray-500 line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.shortDesc),
              }}
            />
          )}
        </div>
      </Link>

      {/* Add to Cart button - Amazon style */}
      <div className="px-4 pb-4">
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-2 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm ${
            isAdding 
              ? 'bg-green-500 text-white cursor-not-allowed' 
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          {isAdding ? 'Added to Cart!' : 'Add to Cart'}
        </button>
        
        {/* Additional options */}
        <div className="flex justify-between mt-2">
          <button className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
            Add to Wishlist
          </button>
          <button className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;