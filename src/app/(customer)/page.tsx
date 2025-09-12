// app/page.tsx (Server Component – no "use client")
import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import RandomProducts from "@/components/RandomProducts";  // ✅ import here
import { Suspense } from "react";
import supabase from "@/lib/supabase";

export default async function Home() {
  const { data } = await supabase
    .from("Categories")
    .select("*")
    .order("name");

  const categories = data ?? [];

  return (
    <div className="space-y-9 container mx-auto px-4">
      {/* Hero Section - Full Width */}
      <div className="w-full">
        <Hero />
      </div>

      {/* Categories Section - Below Hero */}
      <div className="container mx-auto px-4">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <div className="animate-pulse bg-gray-200 rounded-lg w-full max-w-4xl h-40"></div>
            </div>
          }
        >
          <div className="flex justify-center">
            <Categories categories={categories} />
          </div>
        </Suspense>
      </div>

      {/* Featured Products Section (now showing random products) */}
      <div className="container mx-auto px-4 mt-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Featured Products
          </h2>
          <p className="text-gray-600 mt-2">
            Various selections just for you
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 rounded-lg h-80"
                ></div>
              ))}
            </div>
          }
        >
          {/* ✅ Instead of ProductList, use RandomProducts */}
          <RandomProducts limit={8} />
        </Suspense>

        {/* View All Button */}
        <div className="text-center mt-8">
          <a
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View All Products
          </a>
        </div>
      </div>
    </div>
  );
}
