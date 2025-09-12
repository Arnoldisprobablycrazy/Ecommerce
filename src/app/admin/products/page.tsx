"use client"
import AddProducts from "@/components/AddProducts"
import AdminBarChart from "@/components/AdminBarChart"
import { useState } from "react"
import { useRouter } from "next/navigation"

const Productpage = () => {
    const [showForm, setShowForm] = useState(true)
    const router = useRouter();
    return (
        <>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 p-2 sm:p-0">
            <button
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${showForm ? 'bg-primary text-white' : 'bg-gray-200'}`}
                onClick={() => setShowForm(true)}
            >
                Add Products
            </button>
            <button
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${!showForm ? 'bg-primary text-white' : 'bg-gray-200'}`}
                onClick={() => setShowForm(false)}
            >
                View Products
            </button>
            <button
                className="px-3 py-2 sm:px-4 sm:py-2 rounded bg-blue-500 text-white text-sm sm:text-base"
                onClick={() => router.push('/admin/products/list')}
            >
                Go to Product List
            </button>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-2 sm:gap-4'> 
            <div className="bg-primary-foreground p-2 sm:p-4 rounded-lg col-span-full lg:col-span-1">
                <div hidden={!showForm}>
                    <AddProducts />
                </div>
                <div hidden={showForm}>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Product List</h3>
                        <p className="text-gray-500 text-sm">(Product list goes here...)</p>
                    </div>
                </div>
            </div>
            <div className="bg-primary-foreground p-2 sm:p-4 rounded-lg">
                <div className="overflow-x-auto">
                    <AdminBarChart/>
                </div>
            </div>
            <div className="bg-primary-foreground p-2 sm:p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
                <p className="text-gray-500 text-sm">No recent activity</p>
            </div>
            <div className="bg-primary-foreground p-2 sm:p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                <div className="space-y-2">
                    <button className="w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-200 text-sm">
                        View All Products
                    </button>
                    <button className="w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-200 text-sm">
                        Add New Category
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}

export default Productpage
