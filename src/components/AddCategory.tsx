"use client"

import { FormEvent, useState, useRef, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'sonner'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ImageIcon, X, Upload, Link as LinkIcon } from 'lucide-react'
import Image from 'next/image'

interface Categories {
  id?: string,
  name: string,
  description: string,
  productCount: string,
  status: string,
  slug?: string,
  image?: string | null,
}

interface AddCategoryProps {
  onCategoryAdded?: () => void,
  form: Categories,
  setForm: React.Dispatch<React.SetStateAction<Categories>>,
  editId: string | null,
  setEditId: React.Dispatch<React.SetStateAction<string | null>>,
  onCancel?: () => void,
  isEditing?: boolean,
}

export default function AddCategory({ onCategoryAdded, form, setForm, editId, setEditId, onCancel, isEditing }: AddCategoryProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [activeTab, setActiveTab] = useState('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (JPEG, PNG, GIF, etc.)')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      setIsUploading(true)

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const filePath = `category-images/${fileName}`

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('categories')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('categories')
        .getPublicUrl(filePath)

      // Update form with image URL
      setForm(prev => ({ ...prev, image: publicUrl }))
      toast.success('Image uploaded successfully')

    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUrlUpload = () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL')
      return
    }

    // Basic URL validation
    try {
      new URL(imageUrl)
      setForm(prev => ({ ...prev, image: imageUrl }))
      setImageUrl('')
      toast.success('Image URL added successfully')
    } catch (error) {
      toast.error('Please enter a valid URL')
    }
  }

  const removeImage = async () => {
    if (form.image && form.image.includes('supabase.co/storage/v1/object/public/categories/')) {
      // Extract file path from Supabase URL
      const urlParts = form.image.split('/')
      const filePath = urlParts.slice(urlParts.indexOf('category-images')).join('/')
      
      try {
        // Delete from Supabase storage
        const { error } = await supabase.storage
          .from('categories')
          .remove([filePath])
        
        if (error) {
          console.error('Error deleting image:', error)
        }
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }
    
    setForm(prev => ({ ...prev, image: null }))
    toast.success('Image removed')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    
    try {
      let error
      let slug = form.slug || generateSlug(form.name)
      
      const categoryData = {
        name: form.name,
        description: form.description,
        productCount: form.productCount,
        status: form.status,
        slug,
        image: form.image,
      }

      if (editId) {
        // Update category
        ({ error } = await supabase.from("Categories").update(categoryData).eq('id', editId))
      } else {
        // Insert new category
        const { data, error: insertError } = await supabase.from("Categories").insert([categoryData]).select()
        error = insertError
        
        if (!error && data && data[0]?.slug) {
          // Redirect to the new category's products page
          router.push(`/admin/categories/${data[0].slug}/products`)
        }
      }
      
      if (error) {
        toast.error(`Failed to ${editId ? 'update' : 'create'}: ${error.message}`)
      } else {
        toast.success(`${editId ? 'Updated' : 'Created'} successfully`)
        // Reset form and editId
        setForm({ name: '', description: '', productCount: '', status: 'Active', image: null })
        setEditId(null)
        setImageUrl('')
        // Refresh the categories list
        if (onCategoryAdded) {
          onCategoryAdded()
        }
      }
    } catch (error) {
      toast.error(`An unexpected error occurred`)
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof Categories, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{editId ? 'Edit Category' : 'Add New Category'}</CardTitle>
        <CardDescription>
          {editId ? 'Update the category information' : 'Create a new product category for your store'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="image">Category Image</Label>
            
            {/* Image Preview */}
            {form.image ? (
              <div className="relative group">
                <div className="w-full h-48 relative rounded-md overflow-hidden bg-gray-100 border">
                  <Image
                    src={form.image}
                    alt="Category preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    onError={(e) => {
                      // If image fails to load, remove it
                      toast.error('Failed to load image')
                      removeImage()
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="url">URL</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="space-y-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload a category image</p>
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploading}
                        className="flex items-center gap-2 mx-auto"
                      >
                        <Upload className="h-4 w-4" />
                        {isUploading ? 'Uploading...' : 'Choose Image'}
                      </Button>
                      <Input
                        id="image-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </Label>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="url" className="space-y-2">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Paste image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleUrlUpload}
                        disabled={!imageUrl.trim()}
                        className="flex items-center gap-2"
                      >
                        <LinkIcon className="h-4 w-4" />
                        Add URL
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Enter a direct link to an image</p>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter category name"
              value={form.name}
              onChange={(event) => handleInputChange('name', event.target.value)}
              required
              disabled={isLoading || isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter category description (optional)"
              value={form.description}
              onChange={(event) => handleInputChange('description', event.target.value)}
              rows={3}
              disabled={isLoading || isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productCount">Product Count</Label>
            <Input
              id="productCount"
              type="number"
              placeholder="Enter number of products"
              value={form.productCount}
              onChange={(event) => handleInputChange('productCount', event.target.value)}
              disabled={isLoading || isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => handleInputChange('status', value)}
              disabled={isLoading || isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isLoading || !form.name.trim() || isUploading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {editId ? "Updating..." : "Creating..."}
                </span>
              ) : (
                editId ? "Update Category" : "Create Category"
              )}
            </Button>
            
            {editId && onCancel && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
                disabled={isLoading || isUploading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}