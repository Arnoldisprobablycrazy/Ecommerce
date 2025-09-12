"use client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useState } from "react"
import { toast } from "sonner"
import supabase from "@/lib/supabase"

interface AddProductsProps {
  onProductAdded?: () => void;
  categoryId?: string;
}

const AddProducts = ({ onProductAdded, categoryId }: AddProductsProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [imageUrl, setImageUrl] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        stocknumber: "",
        status: "",
    })

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string)
                setImageUrl("") // Clear URL when file is selected
                setForm(f => ({ ...f, image: e.target?.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value
        setImageUrl(url)
        setSelectedImage(null) // Clear file when URL is entered
        setForm(f => ({ ...f, image: url }))
    }

    const getImageSource = () => {
        return selectedImage || imageUrl || ""
    }

    const handleInputChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const productData = {
            name: form.name,
            description: form.description,
            price: form.price,
            image: form.image,
            stocknumber: form.stocknumber,
            status: form.status,
            ...(categoryId && { category_id: categoryId })
        };
        
        const { error } = await supabase.from("Products").insert([productData]);
        setLoading(false);
        if (error) {
            toast.error("Failed to add product: " + error.message);
        } else {
            toast.success("Product added successfully!");
            setForm({ name: "", description: "", price: "", image: "", stocknumber: "", status: "" });
            setSelectedImage(null);
            setImageUrl("");
            if (onProductAdded) onProductAdded();
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
            <Card>
                <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="text-lg sm:text-xl">Add New Product</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                    <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                        {/* Row 1: Product Name and Image */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input 
                                    id="name"
                                    type="text" 
                                    placeholder="Enter product name"
                                    className="w-full"
                                    value={form.name}
                                    onChange={e => handleInputChange('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Product Image</Label>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                    <Input 
                                        id="image"
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full"
                                    />
                                    {getImageSource() && (
                                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                                            <Image 
                                                src={getImageSource()} 
                                                alt="Product preview" 
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Image URL */}
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Or Enter Image URL</Label>
                            <Input 
                                id="imageUrl"
                                type="url" 
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={handleUrlChange}
                                className="w-full"
                            />
                        </div>

                        {/* Row 3: Description and Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="description">Product Description</Label>
                                <Input 
                                    id="description"
                                    type="text" 
                                    placeholder="Enter product description"
                                    className="w-full"
                                    value={form.description}
                                    onChange={e => handleInputChange('description', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input 
                                    id="price"
                                    type="number" 
                                    placeholder="Enter price"
                                    className="w-full"
                                    value={form.price}
                                    onChange={e => handleInputChange('price', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Row 4: Stock Number and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="stocknumber">Stock Number</Label>
                                <Input 
                                    id="stocknumber"
                                    type="text" 
                                    placeholder="Enter stock number"
                                    className="w-full"
                                    value={form.stocknumber}
                                    onChange={e => handleInputChange('stocknumber', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={form.status}
                                    onValueChange={value => handleInputChange('status', value)}
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
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-2 pt-4">
                            <Button
                                type="submit"
                                className="flex-1 w-full sm:w-auto"
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Add Product"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddProducts
