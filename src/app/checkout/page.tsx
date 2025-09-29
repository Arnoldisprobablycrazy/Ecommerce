"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Phone, ShoppingCart } from "lucide-react";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items, router]);

  const handleMpesaPayment = async () => {
    if (!phone) {
      setError("Phone number is required");
      return;
    }

    // Basic phone validation for Kenya
    const phoneRegex = /^(07\d{8}|2547\d{8}|01\d{8})$/;
    const cleanPhone = phone.replace(/\s/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      setError("Please enter a valid Kenyan phone number (e.g., 07XXXXXXXX)");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const orderId = `ORD-${Date.now()}`;
      const amount = getTotalPrice();

      // Save order data to localStorage for order success page
      const orderData = {
        orderNumber: orderId,
        items: items,
        totalAmount: amount,
        phone: cleanPhone,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('currentOrder', JSON.stringify(orderData));

      const response = await fetch("/api/mpesa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: cleanPhone,
          amount: Math.round(amount),
          orderId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store payment ID if available
        if (data.paymentId) {
          localStorage.setItem('currentPayment', JSON.stringify({
            paymentId: data.paymentId,
            orderNumber: orderId,
            items: items,
            totalAmount: amount,
            phone: cleanPhone
          }));
        }

        alert("Please check your phone to complete payment");
        clearCart();
        router.push("/order-success");
      } else {
        setError(data.error || "Payment failed. Please try again.");
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
        <Button 
          onClick={() => router.push("/")}
          className="bg-amber-600 hover:bg-amber-700"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      KSH {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      KSH {item.price.toLocaleString()} each
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-amber-600">
                    KSH {getTotalPrice().toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {items.length} item{items.length !== 1 ? 's' : ''} in your order
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* M-Pesa Payment Option */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">M-Pesa</h3>
                    <p className="text-sm text-gray-600">Pay via STK Push</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      M-Pesa Registered Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="07XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the phone number registered with M-Pesa
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <Button
                    onClick={handleMpesaPayment}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-md font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Initiating Payment...
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-2" />
                        Pay with M-Pesa
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• You will receive an STK push on your phone</p>
                    <p>• Enter your M-Pesa PIN to complete payment</p>
                    <p>• Your order will be confirmed immediately after payment</p>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h4 className="font-semibold text-blue-800 text-sm mb-2">
                  Secure Payment
                </h4>
                <p className="text-blue-700 text-xs">
                  Your payment is processed securely through M-Pesa. We do not store your payment details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}