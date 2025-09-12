"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import Image from "next/image";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase.from("Products").select("*").eq("id", id).single();
      if (!error && data) setProduct(data);
      setLoading(false);
    }
    if (id) fetchProduct();
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("Products").update(product).eq("id", id);
    setSaving(false);
    if (error) {
      toast.error("Failed to update product: " + error.message);
    } else {
      toast.success("Product updated successfully");
      router.refresh();
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!product) return <div className="flex justify-center items-center min-h-screen">Product not found.</div>;

  return (
    <div className="w-full max-w-2xl mx-auto p-2 sm:p-4">
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Edit Product: {product.name}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {product.image && (
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  className="object-cover rounded" 
                />
              </div>
            </div>
          )}
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSave}>
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                type="text"
                value={product.name || ""}
                onChange={e => setProduct((p: any) => ({ ...p, name: e.target.value }))}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={product.image || ""}
                onChange={e => setProduct((p: any) => ({ ...p, image: e.target.value }))}
                className="w-full"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                value={product.description || ""}
                onChange={e => setProduct((p: any) => ({ ...p, description: e.target.value }))}
                className="w-full"
                placeholder="Enter product description"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={product.price || ""}
                  onChange={e => setProduct((p: any) => ({ ...p, price: e.target.value }))}
                  className="w-full"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stocknumber">Stock Number</Label>
                <Input
                  id="stocknumber"
                  type="text"
                  value={product.stocknumber || ""}
                  onChange={e => setProduct((p: any) => ({ ...p, stocknumber: e.target.value }))}
                  className="w-full"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={product.status || ""}
                onValueChange={value => setProduct((p: any) => ({ ...p, status: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 