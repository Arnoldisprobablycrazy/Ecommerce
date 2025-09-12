"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import supabase from "@/lib/supabase";
import Image from "next/image";
import AddProducts from "@/components/AddProducts";

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddNew, setShowAddNew] = useState(false);
  const [showAddExisting, setShowAddExisting] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Handle image loading errors
  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // Move fetchCategoryAndProducts outside useEffect
  const fetchCategoryAndProducts = async () => {
    setLoading(true);
    const { data: cat, error: catError } = await supabase
      .from("Categories")
      .select("*")
      .eq("slug", slug)
      .single();
    if (catError || !cat) {
      console.error("Category not found:", catError);
      router.push("/admin/categories");
      return;
    }
    setCategory(cat);
    
    const { data: prods, error: prodError } = await supabase
      .from("Products")
      .select("*")
      .eq("category_id", cat.id)
      .order("created_at", { ascending: false });
    if (prodError) {
      console.error("Failed to fetch products:", prodError);
    }
    setProducts(prods || []);
    setLoading(false);
  };

  useEffect(() => {
    if (slug) fetchCategoryAndProducts();
  }, [slug, router]);

  const handleProductAdded = () => {
    fetchCategoryAndProducts();
    setShowAddNew(false);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="w-full h-screen flex flex-col p-2 sm:p-4">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="px-4 sm:px-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Products in {category?.name}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{products.length} products</p>
            </div>
            <div className="flex gap-2">
              <Dialog open={showAddExisting} onOpenChange={setShowAddExisting}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Add Existing Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Existing Product to {category?.name}</DialogTitle>
                  </DialogHeader>
                  <AddExistingProduct 
                    categoryId={category?.id} 
                    onProductAdded={() => {
                      setShowAddExisting(false);
                      fetchCategoryAndProducts();
                    }}
                  />
                </DialogContent>
              </Dialog>
              
              <Dialog open={showAddNew} onOpenChange={setShowAddNew}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    Add New Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product to {category?.name}</DialogTitle>
                  </DialogHeader>
                  <AddProducts 
                    categoryId={category?.id}
                    onProductAdded={handleProductAdded}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 flex-1 overflow-hidden">
          {products.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No products found for this category.
              <div className="mt-4">
                <Button onClick={() => setShowAddNew(true)}>Add Your First Product</Button>
              </div>
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
                          Status
                        </th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => {
                        const hasImageError = imageErrors[product.id];
                        const shouldShowImage = product.image && !hasImageError;
                        
                        return (
                          <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                              {shouldShowImage ? (
                                <Image 
                                  src={product.image} 
                                  alt={product.name} 
                                  width={40} 
                                  height={40} 
                                  className="object-cover rounded w-8 h-8 sm:w-10 sm:h-10" 
                                  onError={() => handleImageError(product.id)}
                                />
                              ) : (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded flex items-center justify-center">
                                  <span className="text-xs text-gray-400">No Image</span>
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-xs text-gray-500 sm:hidden">
                                KSH {product.price} • {product.status}
                              </div>
                            </td>
                            <td className="py-3 px-3 sm:px-4 whitespace-nowrap hidden sm:table-cell text-xs sm:text-sm text-gray-900">
                              KSH {product.price}
                            </td>
                            <td className="py-3 px-3 sm:px-4 whitespace-nowrap hidden md:table-cell">
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
                        );
                      })}
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

// Component for adding existing products
function AddExistingProduct({ categoryId, onProductAdded }: { categoryId: string, onProductAdded: () => void }) {
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Handle image loading errors
  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    async function fetchAvailableProducts() {
      setLoading(true);
      // Get products that are not in this category (category_id is null or different)
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .or(`category_id.is.null,category_id.neq.${categoryId}`)
        .order("name");
      
      if (!error && data) {
        setAvailableProducts(data);
      }
      setLoading(false);
    }
    if (categoryId) fetchAvailableProducts();
  }, [categoryId]);

  const handleAddToCategory = async () => {
    if (selectedProducts.length === 0) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("Products")
      .update({ category_id: categoryId })
      .in("id", selectedProducts);
    
    setSaving(false);
    if (error) {
      console.error("Failed to add products to category:", error);
    } else {
      setSelectedProducts([]);
      onProductAdded();
    }
  };

  if (loading) return <div>Loading available products...</div>;

  return (
    <div className="space-y-4">
      {availableProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No available products to add to this category.
        </div>
      ) : (
        <>
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {availableProducts.map((product) => {
                const hasImageError = imageErrors[product.id];
                const shouldShowImage = product.image && !hasImageError;
                
                return (
                  <label key={product.id} className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product.id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                        }
                      }}
                      className="rounded"
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      {shouldShowImage ? (
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          width={32} 
                          height={32} 
                          className="object-cover rounded" 
                          onError={() => handleImageError(product.id)}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">No Image</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">KSH {product.price}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              onClick={handleAddToCategory}
              disabled={selectedProducts.length === 0 || saving}
            >
              {saving ? "Adding..." : `Add ${selectedProducts.length} Product${selectedProducts.length !== 1 ? 's' : ''} to Category`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}