// src/components/ProductList.tsx (final version)
import Pagination from "./Pagination";
import supabase from "@/lib/supabase";
import ProductCard from "./ProductCard";

const PRODUCT_PER_PAGE = 8;

interface SearchParams {
  [key: string]: string | string[] | undefined;
  featured?: string;
  type?: string;
  name?: string;
  min?: string;
  max?: string;
  sort?: string;
  page?: string;
}

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId?: string;
  limit?: number;
  searchParams: SearchParams;
}) => {
  const { featured, type, name, min, max, sort, page: pageParam } = searchParams;

  let query = supabase.from("Products").select("*", { count: "exact" });

  if (categoryId) query = query.eq("category_id", categoryId);
  if (featured) query = query.eq("featured", true);
  if (type) query = query.eq("type", type);
  if (name) query = query.ilike("name", `%${name}%`);
  if (min) query = query.gte("price", Number(min));
  if (max) query = query.lte("price", Number(max));

  if (sort) {
    const [sortType, sortBy] = sort.split(" ");
    if (sortType === "asc") query = query.order(sortBy, { ascending: true });
    if (sortType === "desc") query = query.order(sortBy, { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const page = pageParam ? parseInt(pageParam as string) : 0;
  const pageSize = limit || PRODUCT_PER_PAGE;
  query = query.range(page * pageSize, page * pageSize + pageSize - 1);

  const { data: productsRaw, count: countRaw } = await query;
  const products = productsRaw || [];
  const count = countRaw || 0;

  return (
    <div className="mt-8">
      {/* Results count and sort info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <p className="text-sm text-gray-600">
          {count > 0 ? `Showing ${page * pageSize + 1}-${Math.min((page + 1) * pageSize, count)} of ${count} results` : 'No products found'}
        </p>
        
        {/* Sort options */}
        {count > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Sort by:</span>
            <select className="border rounded-md px-2 py-1 text-sm bg-white">
              <option value="created_at desc">Newest Arrivals</option>
              <option value="price asc">Price: Low to High</option>
              <option value="price desc">Price: High to Low</option>
              <option value="name asc">Name: A to Z</option>
              <option value="name desc">Name: Z to A</option>
            </select>
          </div>
        )}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {count > pageSize ? (
        <div className="mt-12">
          <Pagination
            currentPage={page}
            hasPrev={page > 0}
            hasNext={products.length === pageSize}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ProductList;