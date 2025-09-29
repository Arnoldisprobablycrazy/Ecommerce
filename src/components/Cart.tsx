"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Cart = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !isMounted) return null;

  return (
    <div className="absolute right-4 top-16 z-50 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col">
      {/* Rest of your cart component remains the same */}
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Cart ({getTotalItems()})</h2>
        <button
          onClick={closeCart}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto max-h-80">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-center p-4">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Button onClick={closeCart} className="bg-amber-600 hover:bg-amber-700">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={item.image || "/product.png"}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                    sizes="64px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/${item.slug}`}
                    className="font-medium text-sm hover:text-blue-600 line-clamp-2 mb-1"
                    onClick={closeCart}
                  >
                    {item.name}
                  </Link>
                  <p className="text-md font-bold text-gray-900">
                    KSH {item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded border hover:bg-gray-100 transition-colors w-6 h-6 flex items-center justify-center"
                    >
                      <Minus className="h-3 w-3" />
                    </button>

                    <span className="w-6 text-center font-medium text-sm">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded border hover:bg-gray-100 transition-colors w-6 h-6 flex items-center justify-center"
                    >
                      <Plus className="h-3 w-3" />
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto p-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t p-4 space-y-3 bg-white">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>KSH {getTotalPrice().toLocaleString()}</span>
          </div>

          <div className="space-y-2">
            <Link href="/checkout" onClick={closeCart}>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-md">
                Checkout Now
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full"
              onClick={closeCart}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;