"use client";

import { useState, useEffect } from "react";
import { createClient } from "@utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, CreditCard, Phone, Package, User, Mail } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

interface Payment {
  id: string;
  status: string;
  payment_method: string;
  mpesa_receipt_number?: string;
  mpesa_phone_number?: string;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  customer_phone?: string;
  customer_email?: string;
  customer_name?: string;
  created_at: string;
  payments?: Payment;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchUserAndOrders();
  }, []);

  const fetchUserAndOrders = async () => {
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      // Fetch orders with payment information
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          payments (*)
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = (order: Order) => {
    const receiptContent = `
ZUKIH TRADERS
================

ORDER RECEIPT
------------

Order Details:
--------------
Order Number: ${order.order_number}
Order Date: ${new Date(order.created_at).toLocaleDateString()}
Order Time: ${new Date(order.created_at).toLocaleTimeString()}

Customer Information:
--------------------
${order.customer_name ? `Name: ${order.customer_name}` : ''}
${order.customer_phone ? `Phone: ${order.customer_phone}` : ''}
${order.customer_email ? `Email: ${order.customer_email}` : ''}

Order Items:
------------
${order.items.map((item, index) => 
  `${index + 1}. ${item.name}
   Quantity: ${item.quantity}
   Price: KSH ${item.price.toLocaleString()} each
   Subtotal: KSH ${(item.price * item.quantity).toLocaleString()}`
).join('\n\n')}

Payment Summary:
----------------
Subtotal: KSH ${order.total_amount.toLocaleString()}
Total: KSH ${order.total_amount.toLocaleString()}

Payment Information:
-------------------
Payment Method: M-Pesa
${order.payments?.mpesa_receipt_number ? `M-Pesa Receipt: ${order.payments.mpesa_receipt_number}` : 'M-Pesa Receipt: Pending'}
Payment Status: ${order.payments?.status || 'Pending'}
Order Status: ${order.status}

Thank you for your order!
=========================

Contact Information:
-------------------
Email: zukihtraders@gmail.com
Phone: +254 722 8253 42

    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${order.order_number}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Please Sign In</h3>
            <p className="text-gray-500 mb-4">You need to be signed in to view your orders.</p>
            <Button onClick={() => window.location.href = '/accounts/login'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">View your order history and download receipts</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="space-y-2">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg">
                      <span className="flex items-center gap-2">
                        Order #: 
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                          {order.order_number}
                        </span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          <Package className="h-3 w-3 mr-1" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        {order.payments && (
                          <Badge variant="outline" className={getPaymentStatusColor(order.payments.status)}>
                            <CreditCard className="h-3 w-3 mr-1" />
                            {order.payments.status.charAt(0).toUpperCase() + order.payments.status.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                    <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <span className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.created_at)}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <CreditCard className="h-4 w-4" />
                        Total: KSH {order.total_amount.toLocaleString()}
                      </span>
                      {order.customer_phone && (
                        <span className="flex items-center gap-1 text-sm">
                          <Phone className="h-4 w-4" />
                          {order.customer_phone}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => generateReceipt(order)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 shrink-0"
                  >
                    <Download className="h-4 w-4" />
                    Download Receipt
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="border rounded-lg">
                    <div className="p-4 border-b bg-gray-50">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Order Items
                      </h4>
                    </div>
                    <div className="p-4 space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
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
                    </div>
                  </div>

                  {/* Payment Information */}
                  {order.payments && (
                    <div className="border rounded-lg">
                      <div className="p-4 border-b bg-gray-50">
                        <h4 className="font-semibold flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Payment Information
                        </h4>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium">M-Pesa</span>
                        </div>
                        {order.payments.mpesa_receipt_number && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">M-Pesa Receipt:</span>
                            <span className="font-mono font-medium">
                              {order.payments.mpesa_receipt_number}
                            </span>
                          </div>
                        )}
                        {order.payments.mpesa_phone_number && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Phone:</span>
                            <span className="font-medium">{order.payments.mpesa_phone_number}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Status:</span>
                          <Badge variant="outline" className={getPaymentStatusColor(order.payments.status)}>
                            {order.payments.status.charAt(0).toUpperCase() + order.payments.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Order Total</p>
                      <p className="text-2xl font-bold text-amber-600">
                        KSH {order.total_amount.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => generateReceipt(order)}
                      className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
                    >
                      <Download className="h-4 w-4" />
                      Download Receipt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Orders Count */}
      {orders.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}