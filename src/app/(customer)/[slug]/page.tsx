import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import { notFound } from "next/navigation";
import supabase from "@/lib/supabase";

export const dynamic = "force-dynamic"; // ✅ always fetch latest

interface PageProps {
  params: {
    slug: string;
  };
}

const SinglePage = async ({ params }: PageProps) => {
  // Fetch product by slug from Supabase
  const { data: product, error } = await supabase
    .from("Products")
    .select("*")
    .eq("slug", params.slug)
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
      </div>
    </div>
  );
};

export default SinglePage;

