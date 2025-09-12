import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";

const RecentlyaddedProducts = [
    {
      id: 1,      
      image:
        "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
      count: 4300,
      title: "Headlights",
      serialunit:3567890,
      category:"Lights",
      state: 'pending',
    },
    {
        id: 2,      
        image:
          "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
        count: 43,
        title: "Headlights",
        serialunit:3567890,
        category:"Lights",
        state: 'Published',
      },
      {
        id: 3,      
        image:
          "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
        count: 4300,
        title: "Headlights",
        serialunit:3567890,
        category:"Lights",
        state: 'pending',
      },
      {
        id: 4,      
        image:
          "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
        count: 4300,
        title: "Headlights",
        serialunit:3567890,
        category:"Lights",
        state: 'pending',
      },
      {
        id: 5,      
        image:
          "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
        count: 4300,
        title: "Headlights",
        serialunit:3567890,
        category:"Lights",
        state: 'Published',
      },
      {
        id: 6,      
        image:
          "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
        count: 4300,
        title: "Headlights",
        serialunit:3567890,
        category:"Lights",
        state: 'pending',
      },
    
  ];
  
  const latestTransactions = [
    {
        id: 1,      
        image:
          "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
        count: 4300,
        title: "Headlights",
        serialunit:3567890,
        category:"Lights",
        state: 'pending',
      },
      {
          id: 2,      
          image:
            "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
          count: 43,
          title: "Headlights",
          serialunit:3567890,
          category:"Lights",
          state: 'Published',
        },
        {
          id: 3,      
          image:
            "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
          count: 4300,
          title: "Headlights",
          serialunit:3567890,
          category:"Lights",
          state: 'pending',
        },
        {
          id: 4,      
          image:
            "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
          count: 4300,
          title: "Headlights",
          serialunit:3567890,
          category:"Lights",
          state: 'pending',
        },
        {
          id: 5,      
          image:
            "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
          count: 4300,
          title: "Headlights",
          serialunit:3567890,
          category:"Lights",
          state: 'Published',
        },
        {
          id: 6,      
          image:
            "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
          count: 4300,
          title: "Headlights",
          serialunit:3567890,
          category:"Lights",
          state: 'pending',
        },
  ];

const CardList = ({title}: {title:string}) => {
    const list = title === "RecentlyaddedProducts" ?RecentlyaddedProducts : latestTransactions
  return (
    <div>
      <h1 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h1>
      <div className="flex flex-col gap-1 overflow-y-auto" style={{maxHeight:"230px"}}>
        {list.map(item=>(
            <Card key={item.id} className="flex-row items-center gap-3 p-1 bg-card hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-md relative overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover"/>
                </div>
                <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
                    <div className="flex flex-col min-w-0">
                        <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.count}</span>
                    </div>                    
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">SKU: {item.serialunit}</span>                    
                        <span className="text-gray-600 dark:text-gray-400">{item.category}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.state === 'Published' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                            {item.state}
                        </span>
                    </div>
                </div>
            </Card>
        ))}
      </div>
    </div>
  )
}

export default CardList
