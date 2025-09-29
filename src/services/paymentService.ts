import { createClient } from '@utils/supabase/client';

export interface PaymentData {
  user_id: string;
  order_number: string;
  amount: number;
  mpesa_phone_number: string;
  mpesa_checkout_request_id?: string;
  mpesa_merchant_request_id?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
}

export interface OrderData {
  user_id: string;
  order_number: string;
  payment_id?: string; // Make this optional
  items: any[];
  total_amount: number;
  customer_phone: string;
  customer_email: string;
  status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}

export class PaymentService {
  private supabase = createClient();

  // Create a new payment record
  async createPayment(paymentData: PaymentData) {
    try {
      const { data, error } = await this.supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating payment:', error);
      return { success: false, error };
    }
  }

  // Update payment status
  async updatePaymentStatus(paymentId: string, status: PaymentData['status'], mpesaData?: any) {
    try {
      const updateData: any = { status };
      
      if (mpesaData) {
        if (mpesaData.mpesa_receipt_number) {
          updateData.mpesa_receipt_number = mpesaData.mpesa_receipt_number;
        }
        if (mpesaData.mpesa_checkout_request_id) {
          updateData.mpesa_checkout_request_id = mpesaData.mpesa_checkout_request_id;
        }
        if (mpesaData.mpesa_merchant_request_id) {
          updateData.mpesa_merchant_request_id = mpesaData.mpesa_merchant_request_id;
        }
        updateData.payment_gateway_response = mpesaData;
      }

      const { data, error } = await this.supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating payment:', error);
      return { success: false, error };
    }
  }

  // Create an order (with optional payment_id)
  async createOrder(orderData: OrderData) {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, error };
    }
  }

  // Update order with payment_id after payment is completed
  async updateOrderPayment(orderNumber: string, paymentId: string) {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .update({ payment_id: paymentId })
        .eq('order_number', orderNumber)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating order payment:', error);
      return { success: false, error };
    }
  }

  // Get payment by order number
  async getPaymentByOrderNumber(orderNumber: string) {
    try {
      const { data, error } = await this.supabase
        .from('payments')
        .select('*')
        .eq('order_number', orderNumber)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching payment:', error);
      return { success: false, error };
    }
  }

  // Get user's payments with orders
  async getUserPayments(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('payments')
        .select(`
          *,
          orders (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching user payments:', error);
      return { success: false, error };
    }
  }

  // Get user's orders with payments
  async getUserOrders(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          payments (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return { success: false, error };
    }
  }
}

export const paymentService = new PaymentService();