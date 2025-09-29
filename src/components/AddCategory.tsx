"use client"
import { FormEvent, useState, useRef, ChangeEvent, useEffect, useCallback } from 'react'
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
  editCategory?: Categories | null,
  editId: string | null,
  onCancel?: () => void,
  isLoading?: boolean,
}

export default function AddCategory({ onCategoryAdded, editCategory, editId, onCancel, isLoading }: AddCategoryProps) {
  const [form, setForm] = useState<Categories>({ 
    name: '', 
    description: '', 
    productCount: '', 
    status: 'Active',
    image: null 
  });
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [activeTab, setActiveTab] = useState('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Generate unique IDs for form elements
  const nameId = 'category-name'
  const descriptionId = 'category-description'
  const productCountId = 'category-product-count'
  const statusId = 'category-status'
  const imageUploadId = 'category-image-upload'
  const imageUrlId = 'category-image-url'

  // Load edit data when editCategory changes - optimized
  useEffect(() => {
    if (editCategory && editId) {
      // Directly set form data without any delays
      setForm({
        id: editCategory.id,
        name: editCategory.name || '',
        description: editCategory.description || '',
        productCount: editCategory.productCount || '',
        status: editCategory.status || 'Active',
        image: editCategory.image || null,
        slug: editCategory.slug || '',
      });
    } else {
      // Reset form when not editing
      setForm({ 
        name: '', 
        description: '', 
        productCount: '', 
        status: 'Active',
        image: null 
      });
    }
  }, [editCategory, editId])

  // Reset image URL when form changes
  useEffect(() => {
    if (editId && form.image) {
      setImageUrl('')
    }
  }, [editId, form.image])

  const generateSlug = useCallback((name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }, [])

  const handleImageUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
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
  }, [])

  const handleUrlUpload = useCallback(() => {
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
  }, [imageUrl])

  const removeImage = useCallback(async () => {
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
  }, [form.image])

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!form.name.trim()) {
      toast.error('Category name is required')
      return
    }

    setIsSubmitting(true)
    
    try {
      let error
      let slug = form.slug || generateSlug(form.name)
      
      const categoryData = {
        name: form.name.trim(),
        description: form.description.trim(),
        productCount: form.productCount,
        status: form.status,
        slug,
        image: form.image,
      }

      if (editId) {
        // Update category
        const { error: updateError } = await supabase
          .from("Categories")
          .update(categoryData)
          .eq('id', editId)
        error = updateError
      } else {
        // Insert new category
        const { data, error: insertError } = await supabase
          .from("Categories")
          .insert([categoryData])
          .select()
        error = insertError
        
        if (!error && data && data[0]?.slug) {
          // Redirect to the new category's products page
          router.push(`/admin/categories/${data[0].slug}/products`)
        }
      }
      
      if (error) {
        throw error
      }
      
      toast.success(`Category ${editId ? 'updated' : 'created'} successfully`)
      
      // Reset form
      setForm({ name: '', description: '', productCount: '', status: 'Active', image: null })
      setImageUrl('')
      
      if (onCategoryAdded) {
        onCategoryAdded()
      }
    } catch (error: any) {
      console.error('Error saving category:', error)
      toast.error(`Failed to ${editId ? 'update' : 'create'} category: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [form, editId, generateSlug, onCategoryAdded, router])

  const handleInputChange = useCallback((field: keyof Categories, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

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
            <Label htmlFor={imageUploadId}>Category Image</Label>
            
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
                  disabled={isSubmitting || isUploading}
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
                    <Label htmlFor={imageUploadId} className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploading || isSubmitting}
                        className="flex items-center gap-2 mx-auto"
                      >
                        <Upload className="h-4 w-4" />
                        {isUploading ? 'Uploading...' : 'Choose Image'}
                      </Button>
                      <Input
                        id={imageUploadId}
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading || isSubmitting}
                      />
                    </Label>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="url" className="space-y-2">
                  <div className="space-y-2">
                    <Label htmlFor={imageUrlId}>Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id={imageUrlId}
                        placeholder="Paste image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1"
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        onClick={handleUrlUpload}
                        disabled={!imageUrl.trim() || isSubmitting}
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
            <Label htmlFor={nameId}>Category Name *</Label>
            <Input
              id={nameId}
              type="text"
              placeholder="Enter category name"
              value={form.name}
              onChange={(event) => handleInputChange('name', event.target.value)}
              required
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={descriptionId}>Description</Label>
            <Textarea
              id={descriptionId}
              placeholder="Enter category description (optional)"
              value={form.description}
              onChange={(event) => handleInputChange('description', event.target.value)}
              rows={3}
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={productCountId}>Product Count</Label>
            <Input
              id={productCountId}
              type="number"
              placeholder="Enter number of products"
              value={form.productCount}
              onChange={(event) => handleInputChange('productCount', event.target.value)}
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={statusId}>Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => handleInputChange('status', value)}
              disabled={isSubmitting || isLoading}
            >
              <SelectTrigger id={statusId}>
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
              disabled={isSubmitting || !form.name.trim() || isUploading || isLoading}
            >
              {isSubmitting ? (
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
                disabled={isSubmitting || isUploading || isLoading}
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