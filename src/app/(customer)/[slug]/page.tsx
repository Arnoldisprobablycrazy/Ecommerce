import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import { notFound } from "next/navigation";
import supabase from "@/lib/supabase";

// Use a union type that accepts both Promise and object
type PageParams = { slug: string } | Promise<{ slug: string }>;

const SinglePage = async ({ params }: { params: PageParams }) => {
  // Handle both Promise and object cases
  const resolvedParams = params instanceof Promise ? await params : params;
  const { slug } = resolvedParams;
  
  // Fetch product by slug from Supabase
  const { data: product, error } = await supabase
    .from("Products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !product) return notFound();

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* IMAGE */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages items={product.images || [product.image]} />
      </div>
      {/* TEXTS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.name}</h1>
        <p className="text-gray-500">{product.description}</p>
        <div className="h-[2px] bg-gray-100" />
        <h2 className="font-medium text-2xl">KSH{product.price}</h2>
        <div className="h-[2px] bg-gray-100" />
        
        {/* Add to Cart Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">-</button>
            <span className="font-medium">1</span>
            <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">+</button>
          </div>
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Add to Cart
          </button>
        </div>
        
        <div className="h-[2px] bg-gray-100" />
        
        {/* Product Details */}
        <div className="text-sm text-gray-500">
          <p>Category: {product.category}</p>
          <p>SKU: {product.sku || "N/A"}</p>
          <p>In Stock: {product.in_stock ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
};

// Generate static paths for all products (optional, for better performance)
export async function generateStaticParams() {
  const { data: products } = await supabase
    .from("Products")
    .select("slug");
  
  return products?.map((product) => ({
    slug: product.slug,
  })) || [];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { slug } = resolvedParams;
  
  const { data: product } = await supabase
    .from("Products")
    .select("name, description, image")
    .eq("slug", slug)
    .single();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default SinglePage;