"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Download, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get order number from URL params or localStorage
    const urlOrderNumber = searchParams.get('order');
    const savedOrder = localStorage.getItem('currentOrder');
    
    if (urlOrderNumber) {
      setOrderNumber(urlOrderNumber);
    } else if (savedOrder) {
      const orderData = JSON.parse(savedOrder);
      setOrderNumber(orderData.orderNumber);
      localStorage.removeItem('currentOrder');
    }
  }, [searchParams]);

  const generateReceipt = () => {
    const receiptContent = `
EASTERLY KITCHENS - ORDER CONFIRMATION
====================================

Thank you for your order!
    
Order Number: ${orderNumber}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Your order has been received and is being processed.
You can view detailed order information and download
a complete receipt from your Orders page.

Thank you for choosing Easterly Kitchens!
====================================
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `order-confirmation-${orderNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your order. Your payment has been processed successfully.
        {orderNumber && (
          <span className="block mt-2 font-semibold">
            Order Number: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderNumber}</span>
          </span>
        )}
      </p>

      <div className="space-y-4 mb-8">
        {orderNumber && (
          <Button
            onClick={generateReceipt}
            variant="outline"
            className="flex items-center gap-2 mx-auto"
          >
            <Download className="h-4 w-4" />
            Download Confirmation
          </Button>
        )}
        
        <Link href="/orders" className="block">
          <Button className="flex items-center gap-2 mx-auto bg-amber-600 hover:bg-amber-700 w-full sm:w-auto">
            <FileText className="h-4 w-4" />
            View All Orders
          </Button>
        </Link>
      </div>

      <div className="space-x-4">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}