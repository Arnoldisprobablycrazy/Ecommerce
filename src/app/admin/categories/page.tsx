"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { MoreVertical, ImageIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import AdminBarChart from '@/components/AdminBarChart'
import AddCategory from '@/components/AddCategory'
import supabase from '@/lib/supabase'
import { toast } from 'sonner'
import Image from 'next/image'

interface Categories{
  id?:string,
  name:string,
  description:string,
  productCount:string,
  status:string,
  slug?:string,
  image?: string | null;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Categories[]>([])
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories from Supabase - memoized
  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('Categories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to fetch categories')
      } else {
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to fetch categories')
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Fixed: Simplified and optimized edit function
  const handleCategoryEdit = useCallback((category: Categories) => {
    if (!category.id) {
      toast.error('Category ID not found')
      return
    }

    // Immediately set the edit ID without any delays
    setEditId(category.id);
  }, [])

  // Fixed: Optimized delete function
  const handleCategoryDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      setIsLoading(true)
      const { error } = await supabase
        .from('Categories')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      toast.success('Category deleted successfully')
      // Optimistically update the UI
      setCategories(prev => prev.filter(cat => cat.id !== id))
    } catch (error: any) {
      console.error('Error deleting category:', error)
      toast.error(`Failed to delete category: ${error.message}`)
      // Refresh on error to ensure consistency
      fetchCategories()
    } finally {
      setIsLoading(false)
    }
  }, [fetchCategories])

  // Function to clear edit mode
  const clearEditMode = useCallback(() => {
    setEditId(null);
  }, [])

  // Handle category added/updated
  const handleCategoryUpdated = useCallback(() => {
    fetchCategories()
    clearEditMode()
  }, [fetchCategories, clearEditMode])

  // Get the category being edited for the form
  const getCategoryToEdit = useCallback(() => {
    if (!editId) return null
    return categories.find(cat => cat.id === editId) || null
  }, [editId, categories])

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4'>       
      <div className="bg-primary-foreground p-4 rounded-lg col-span-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Categories</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories Table */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Image</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Products</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <CategoryRow 
                        key={category.id} 
                        category={category} 
                        onEdit={handleCategoryEdit}
                        onDelete={handleCategoryDelete}
                        isLoading={isLoading}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add Category Form */}
          <div className="lg:col-span-1">
            <AddCategory 
              editCategory={getCategoryToEdit()}
              editId={editId}
              onCategoryAdded={handleCategoryUpdated}
              onCancel={clearEditMode}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-primary-foreground p-4 rounded-lg"><AdminBarChart/></div>
      <div className="bg-primary-foreground p-4 rounded-lg">Recent Activity</div>
      <div className="bg-primary-foreground p-4 rounded-lg">Quick Actions</div>
    </div>
  )
}

// Memoized Category Row Component to prevent unnecessary re-renders
const CategoryRow = React.memo(({ 
  category, 
  onEdit, 
  onDelete, 
  isLoading 
}: { 
  category: Categories
  onEdit: (category: Categories) => void
  onDelete: (id: string) => void
  isLoading: boolean
}) => {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="py-4 px-4">
        <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <ImageIcon className="h-6 w-6 text-gray-400" />
          )}
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="font-medium text-gray-900 dark:text-gray-100">{category.name}</div>
      </td>
      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
        {category.description}
      </td>
      <td className="py-4 px-4">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
          {category.productCount}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          category.status === 'Active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
          {category.status}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0"
                disabled={isLoading}
              >
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                disabled={isLoading}
              >
                <button 
                  onClick={() => onEdit(category)}
                  disabled={isLoading}
                >
                  Edit
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                disabled={isLoading}
              >
                <button 
                  onClick={() => category.id && onDelete(category.id)}
                  disabled={isLoading}
                >
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <a href={`/admin/categories/${category.slug}/products`}> 
            <Button size="sm" variant="outline" disabled={isLoading}>
              View Products
            </Button>
          </a>
        </div>
      </td>
    </tr>
  )
})

CategoryRow.displayName = 'CategoryRow'

export default CategoriesPage