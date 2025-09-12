"use client"
import React, { useState, useEffect } from 'react'
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
  const [form, setForm] = useState<Categories>({ 
    name: '', 
    description: '', 
    productCount: '', 
    status: 'Active',
    image: null 
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('Categories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching categories:', error)
      } else {
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  //Updating Categories
  async function handleCategoryEdit(category: Categories) {
    try {
      setIsEditing(true)
      
      // Ensure we have all the data before setting form
      if (!category.id) {
        toast.error('Category ID not found')
        return
      }

      // Set form data with a small delay to ensure proper state update
      await new Promise(resolve => setTimeout(resolve, 5))
      
      setForm({
        name: category.name || '',
        description: category.description || '',
        productCount: category.productCount || '',
        status: category.status || 'Active',
        image: category.image || null,
        id: category.id,
      });
      
      setEditId(category.id);
      
      toast.success('Category loaded for editing')
    } catch (error) {
      console.error('Error loading category for edit:', error)
      toast.error('Failed to load category for editing')
    } finally {
      setIsEditing(false)
    }
  }

  // Function to clear edit mode
  const clearEditMode = () => {
    setForm({ 
      name: '', 
      description: '', 
      productCount: '', 
      status: 'Active',
      image: null 
    });
    setEditId(null);
    setIsEditing(false);
  }

  //Deleting from Categories
  async function handleCategoryDelete(id: string) {
    try {
      const { error } = await supabase
        .from('Categories')
        .delete()
        .eq('id', id)

      if (error) {
        toast.error(`Failed to delete category: ${error.message}`)
      } else {
        toast.success('Category deleted successfully')
        // Refresh the categories list
        fetchCategories()
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

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
                      <tr key={category.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
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
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                  <button onClick={() => handleCategoryEdit(category)}>Edit</button>
                                </DropdownMenuItem>
                                <DropdownMenuItem className=" hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" variant='destructive'>
                                  <button onClick={() =>category.id && handleCategoryDelete(category.id)}>Delete</button>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <a href={`/admin/categories/${category.slug}/products`}> 
                              <Button size="sm" variant="outline">View Products</Button>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add Category Form */}
          <div className="lg:col-span-1">
            <AddCategory 
              form={form}
              setForm={setForm}
              editId={editId}
              setEditId={setEditId}
              onCategoryAdded={fetchCategories}
              onCancel={clearEditMode}
              isEditing={isEditing}
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

export default CategoriesPage