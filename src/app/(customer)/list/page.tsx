
import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import Image from "next/image";
import { Suspense } from "react";
import supabase from "@/lib/supabase";

const ListPage = async({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  // Await the searchParams promise first
  const params = await searchParams;
  
  // Fetch categories and products from Supabase
  const { data } = await supabase
    .from("Categories")
    .select("*")
    .order("name");
  const categories = data ?? [];

  // Use property access for searchParams
  const cat = params.cat;
  const selectedCategory = categories.find(c => c.slug === cat);
  const categoryId = selectedCategory?.id || categories[0]?.id || null;

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:32 2xl:p-64 relative">
      <div className="hidden bg-[#96c1c7] px-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="font-semibold text-5xl leading-[50px] text-[#e9f6f6]">Search, Add <br /> and Checkout</h1>
          <button className="rounded-3xl bg-amber-300 text-white w-max py-3 px-5 text-sm">SHOP NOW</button>
        </div>
        <div className="relative w-1/3">
          <Image 
            src='/subaru-removebg-preview.png' 
            alt="car-image" 
            fill 
            className="object-contain"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </div>
      {/*FILTER*/}
      <Filter categories={categories} selectedCategoryId={categoryId} />
      {/*PRODUCT*/}
      <h1 className="text-3xl text-gray-500 mt-6 mb-4">
        {categories.find(c => c.id === categoryId)?.name || "All Products"}
      </h1>
      <Suspense fallback={<div className="text-center py-8">Loading products...</div>}>
        {/* Now passing resolved params, not a Promise */}
        <ProductList categoryId={categoryId} searchParams={params}/>
      </Suspense>
    </div>
  )
}

export default ListPage