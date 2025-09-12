"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    title: "Find the Right Spare Parts",
    description: "Genuine parts for all car makes and models.",
    image:
      "https://images.pexels.com/photos/4517077/pexels-photo-4517077.jpeg",
    url: "/products",
  },
  {
    id: 2,
    title: "Search, Add, Checkout",
    description: "Built to last. Made to fit.",
    image:
      "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg",
    url: "/products",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative h-[360px] overflow-hidden rounded-lg shadow-md">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-20 px-4">
        <h1 className="text-xl md:text-3xl font-bold drop-shadow-lg mb-2">
          {slides[current].title}
        </h1>
        <p className="text-sm md:text-base mb-4 max-w-md">
          {slides[current].description}
        </p>
        <Link href={slides[current].url}>
          <button className="bg-amber-600 px-4 py-2 text-sm md:text-base text-white font-semibold rounded-full shadow-md hover:bg-amber-700 transition-transform transform hover:scale-105">
            Shop Now
          </button>
        </Link>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full border-2 border-white transition-all ${
              current === index ? "bg-white scale-110" : "bg-transparent"
            }`}
            onClick={() => setCurrent(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
