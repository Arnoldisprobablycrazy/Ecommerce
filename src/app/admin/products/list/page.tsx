"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import supabase from "@/lib/supabase";
import Image from "next/image";

export default function ProductListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Fetch categories
      const { data: catData, error: catError } = await supabase
        .from("Categories")
        .select("*")
        .order("name");
      
      if (!catError && catData) {
        setCategories(catData);
      }
      
      // Fetch products
      const { data: prodData, error: prodError } = await supabase
        .from("Products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!prodError && prodData) {
        setProducts(prodData);
      }
      
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category_id === selectedCategory);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="w-full h-screen flex flex-col p-2 sm:p-4">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="px-4 sm:px-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">All Products</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Filter by Category:</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                size="sm" 
                onClick={() => router.push('/admin/products')}
              >
                Add New Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 flex-1 overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              {selectedCategory === "all" ? "No products found." : "No products found in this category."}
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900">
                          Image
                        </th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900">
                          Name
                        </th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 hidden sm:table-cell">
                          Price
                        </th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 hidden md:table-cell">
                          Category
                        </th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 hidden lg:table-cell">
                          Status
                        </th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                            {product.image ? (
                              <Image 
                                src={product.image} 
                                alt={product.name} 
                                width={40} 
                                height={40} 
                                className="object-cover rounded w-8 h-8 sm:w-10 sm:h-10" 
                              />
                            ) : (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-400">No</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500 sm:hidden">
                              KSH {product.price} • {getCategoryName(product.category_id)}
                            </div>
                          </td>
                          <td className="py-3 px-3 sm:px-4 whitespace-nowrap hidden sm:table-cell text-xs sm:text-sm text-gray-900">
                            KSH {product.price}
                          </td>
                          <td className="py-3 px-3 sm:px-4 whitespace-nowrap hidden md:table-cell">
                            <span className="text-xs sm:text-sm text-gray-600">
                              {getCategoryName(product.category_id)}
                            </span>
                          </td>
                          <td className="py-3 px-3 sm:px-4 whitespace-nowrap hidden lg:table-cell">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.status === 'Available' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => router.push(`/admin/products/${product.id}`)}
                              className="text-xs px-2 py-1 sm:px-3 sm:py-2"
                            >
                              View / Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 