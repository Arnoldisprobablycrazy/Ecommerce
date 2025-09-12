"use client"
import Image from "next/image"
import { useState } from "react"
// const images = [
   // { id: 1, url: "https://images.pexels.com/photos/9735311/pexels-photo-9735311.jpeg" },
    //{ id: 2, url: "https://images.pexels.com/photos/9735311/pexels-photo-9735311.jpeg" },
    //{ id: 3, url: "https://images.pexels.com/photos/9735311/pexels-photo-9735311.jpeg" },
    //{ id: 4, url: "https://images.pexels.com/photos/9735311/pexels-photo-9735311.jpeg" },
//]

const ProductImages = ({items}: {items: any}) => {
    const [index, setIndex] = useState(0)
    return (
        <div>
            <div className="h-[400px] relative">
                <Image src={items[index].image?.url} sizes="40vw" alt="" fill className="object-cover rounded-md" />
            </div>
            <div className="flex justify-between gap-4 mt-8 cursor-pointer">
                {items.map((item:any,i:number) =>(
                    <div className="w-1/4 h-24 relative gap-4 mt-8" key={item._id} onClick={()=>setIndex(i)}>
                        <Image src={item.image?.url} sizes="25vw" alt="" fill className="object-cover rounded-md" />
                    </div>
                ))}

            </div>
        </div>
    )
}

export default ProductImages

