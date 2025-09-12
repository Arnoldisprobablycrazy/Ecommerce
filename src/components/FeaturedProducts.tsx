import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Lights",
    products: [
      {
        id: 1,
        name: "LED Headlight",
        price: "KSH 4500",
        image1: "/headlights.jpg",
        image2: "/oil2.jpg",
        description: "Bright and efficient LED headlights for night driving."
      },
      {
        id: 2,
        name: "Fog Light",
        price: "KSH 3000",
        image1: "/foglights.jpg",
        image2: "/oil2.jpg",
        description: "Enhance visibility in foggy weather."
      },
      {
        id: 3,
        name: "Tail Light",
        price: "KSH 2500",
        image1: "/taillights.jpg",
        image2: "/oil2.jpg",
        description: "Durable tail lights for all vehicles."
      },
      {
        id: 4,
        name: "Indicator Light",
        price: "KSH 1500",
        image1: "/indicator.jpg",
        image2: "/oil2.jpg",
        description: "Reliable indicator lights for safe turning."
      },
      {
        id: 5,
        name: "Parking Lights",
        price: "KSH 1500",
        image1: "/parking.jpg",
        image2: "/oil2.jpg",
        description: "Effective parking lights for visibility."
      }
    ]
  },
  {
    name: "Engine Oil",
    products: [
      {
        id: 26,
        name: "Toyota Premium Synthetic Motor Oil",
        price: "KSH 1200",
        image1: "/oil.jpg",
        image2: "/oil2.jpg",
        description: "High-performance synthetic oil for Toyota engines."
      },
      {
        id: 27,
        name: "Total Quartz 3000 20W50 – 3L",
        price: "KSH 1100",
        image1: "/oil2.jpg",
        image2: "/oil3.jpg",
        description: "Premium multigrade oil for all engine types."
      },
      {
        id: 28,
        name: "Shell Helix HX3 SAE 40 - 10L",
        price: "KSH 700",
        image1: "/oil3.jpg",
        image2: "/oil4.jpg",
        description: "Engineered for excellent wear protection."
      },
      {
        id: 29,
        name: "Caltex Delo Gold Ultra SAE 15W-40 Diesel",
        price: "KSH 400",
        image1: "/oil4.jpg",
        image2: "/oil5.jpg",
        description: "Perfect for diesel engines under load."
      },
      {
        id: 30,
        name: "Total quartz oil 10 w 40 es can 5l",
        price: "KSH 400",
        image1: "/oil5.jpg",
        image2: "/oil.jpg",
        description: "Synthetic oil delivering superior performance."
      }
    ]
  }
];

const FeaturedProducts = () => {
  return (
    <div className="p-6 space-y-20">
      {categories.map((category) => (
        <div key={category.name}>
          <h2 className="text-2xl font-bold mb-8">{category.name}</h2>
          <div className="flex flex-wrap justify-between gap-x-8 gap-y-16">
            {category.products.map((product) => (
              <Link
                key={product.id}
                href="/test"
                className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[15%]"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={product.image1}
                    alt={product.name}
                    fill
                    sizes="25vw"
                    className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
                  />
                  <Image
                    src={product.image2}
                    alt={product.name}
                    fill
                    sizes="25vw"
                    className="absolute object-cover rounded-md"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{product.name}</span>
                  <span className="font-semibold">{product.price}</span>
                </div>
                <div className="text-sm text-gray-600">{product.description}</div>
                <button className="rounded-2xl bg-gray-800 ring-amber-300 text-amber-100 w-max py-2 px-4 text-xs hover:bg-amber-300 hover:text-white">
                  Add to Cart
                </button>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
