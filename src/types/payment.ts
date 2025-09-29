export interface Payment {
  id: string;
  user_id: string;
  order_number: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  payment_method: 'mpesa' | 'card' | 'cash';
  mpesa_receipt_number?: string;
  mpesa_phone_number?: string;
  mpesa_checkout_request_id?: string;
  mpesa_merchant_request_id?: string;
  payment_gateway_response?: any;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  payment_id: string;
  items: any[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  customer_phone?: string;
  customer_email?: string;
  customer_name?: string;
  shipping_address?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
  payments?: Payment;
}