"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageIcon, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const Categories = ({ categories }: { categories: any[] }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Handle image loading errors
  const handleImageError = (id: string) => {
    console.error(`Image failed to load for category ${id}`);
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Handle image loading success
  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Hide scrollbar using useEffect
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      @media (max-width: 640px) {
        .hide-scrollbar {
          padding-bottom: 8px;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of products organized by category. Find
            exactly what you're looking for!
          </p>
        </div>

        {/* Horizontal Categories Scroll */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-6 gap-6 hide-scrollbar px-2">
            {categories.map((item) => {
              const hasImageError = imageErrors[item.id];
              const hasImageLoaded = loadedImages[item.id];
              const shouldShowImage = item.image && !hasImageError;

              return (
                <div key={item.id} className="flex-shrink-0 w-56 group">
                  {/* Category Card */}
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                    {/* Image Container */}
                    <Link
                      href={`/list?cat=${item.slug}`}
                      className="block relative"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-gray-100 border border-gray-200 rounded-lg">
                        {shouldShowImage ? (
                          <>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 224px"
                              onError={() => handleImageError(item.id)}
                              onLoad={() => handleImageLoad(item.id)}
                              priority={categories.indexOf(item) < 3}
                            />
                            {!hasImageLoaded && !hasImageError && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                                <div className="text-gray-400 text-sm">
                                  Loading...
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-50">
                            <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500">
                              {item.name}
                            </span>
                            {item.image && (
                              <span className="text-xs text-red-500 mt-1">
                                Image failed to load
                              </span>
                            )}
                          </div>
                        )}

                        {/* Hover Overlay (brightens instead of darkens) */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 flex items-center justify-center">
                          <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="bg-white rounded-full p-3 shadow-lg">
                              <ArrowRight className="h-6 w-6 text-amber-600" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Category Name */}
                    <Link href={`/list?cat=${item.slug}`}>
                      <div className="p-4 text-center">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-amber-700 transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                        <span className="text-sm text-amber-600 font-medium inline-flex items-center gap-1">
                          Shop Now
                          <svg
                            className="w-3 h-3 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gradient fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent"></div>
        </div>

        {/* View All Categories Button */}
        {categories.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-full hover:bg-amber-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
            >
              View All Categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
