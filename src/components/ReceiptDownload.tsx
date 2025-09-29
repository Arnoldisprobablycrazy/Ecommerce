"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ReceiptData {
  orderNumber: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  customerPhone?: string;
  mpesaReceipt?: string;
  date: string;
}

interface ReceiptDownloadProps {
  order: ReceiptData;
  className?: string;
}

export function ReceiptDownload({ order, className }: ReceiptDownloadProps) {
  const generateReceipt = () => {
    const receiptContent = `
      Zukih traders RECEIPT
      ========================
      
      Order Number: ${order.orderNumber}
      Date: ${new Date(order.date).toLocaleDateString()}
      Time: ${new Date(order.date).toLocaleTimeString()}
      
      ITEMS:
      ${order.items.map(item => 
        `${item.name} x${item.quantity} - KSH ${(item.price * item.quantity).toLocaleString()}`
      ).join('\n')}
      
      ------------------------
      TOTAL: KSH ${order.totalAmount.toLocaleString()}
      
      Payment Method: M-Pesa
      ${order.mpesaReceipt ? `MPesa Receipt: ${order.mpesaReceipt}` : ''}
      ${order.customerPhone ? `Phone: ${order.customerPhone}` : ''}
      
      Thank you for your order!
      ========================
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${order.orderNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={generateReceipt}
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 ${className}`}
    >
      <Download className="h-4 w-4" />
      Download Receipt
    </Button>
  );
}