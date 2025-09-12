// src/components/RandomProducts.tsx
import supabase from "@/lib/supabase";
import RandomProductCard from "./RandomProductCard";

const RandomProducts = async ({ limit = 8 }: { limit?: number }) => {
  // Try the RPC function first, fallback to regular query if it doesn't exist
  let products: any[] = [];
  let error = null;

  try {
    // First try the RPC function
    const result = await supabase
      .rpc("get_random_products", { limit_count: limit });
    
    products = result.data || [];
    error = result.error;
  } catch (rpcError) {
    console.log("RPC function not available, using fallback query");
    
    // Fallback: regular query with random ordering
    const fallbackResult = await supabase
      .from("Products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    
    products = fallbackResult.data || [];
    error = fallbackResult.error;
  }

  if (error) {
    console.error("Supabase error:", error);
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {products.map((product: any) => (
        <RandomProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default RandomProducts;