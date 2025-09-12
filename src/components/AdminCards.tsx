import { Card, CardContent, CardDescription,  CardTitle } from "./ui/card"

const card = [
    {
        id:1,
        title:"Products",
        count:200,
        bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
        textColor: "text-white"
    },
    {
        id:2,
        title:"Categories",
        count:5,
        bgColor: "bg-gradient-to-br from-green-500 to-green-600",
        textColor: "text-white"
    },
    {
        id:3,
        title:"Orders",
        count:8,
        bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
        textColor: "text-white"
    },
    {
        id:4,
        title:"out of sock",
        count:0,
        bgColor: "bg-gradient-to-br from-red-500 to-red-600",
        textColor: "text-white"
    },
]
const AdminCards = ({title}: {title:string}) => {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">{title}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {card.map((item) => (
           <Card key={item.id} className={`hover:shadow-lg transition-all duration-300 border-0 shadow-md ${item.bgColor}`}>
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <CardTitle className={`text-sm font-medium uppercase tracking-wide ${item.textColor}`}>
                    {item.title}
                  </CardTitle>
                  <CardDescription className={`text-3xl font-bold ${item.textColor}`}>
                    {item.count}
                  </CardDescription>
                </div>
            </CardContent>
           </Card>
        ))}
      </div>
    </div>
  )
}

export default AdminCards
