import AdminBarChart from '@/components/AdminBarChart'
import AdminCards from '@/components/AdminCards'
import CardList from '@/components/CardList'
import SalesTrend from '@/components/SalesTrend'
import React from 'react'

const Admin = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4'>       
        <div className="bg-primary-foreground p-4 rounded-lg col-span-full"><AdminCards title="Dashboard Overview" /></div>
        <div className="bg-primary-foreground p-4 rounded-lg"><AdminBarChart/></div>
        <div className="bg-primary-foreground p-4 rounded-lg"></div>
        <div className="bg-primary-foreground p-4 rounded-lg "><CardList title="RecentlyaddedProducts"/></div>
        <div className="bg-primary-foreground p-4 rounded-lg"><SalesTrend/></div>
        <div className="bg-primary-foreground p-4 rounded-lg"></div>

        <div className="bg-primary-foreground p-4 rounded-lg"><CardList title="Popular Content"/></div>
    </div>
  )
}

export default Admin
