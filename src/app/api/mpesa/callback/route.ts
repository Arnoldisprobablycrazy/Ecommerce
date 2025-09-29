import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const callbackData = await request.json();
    
    console.log('=== CALLBACK RECEIVED ===');
    console.log('Callback data received at:', new Date().toISOString());

    const resultCode = callbackData.Body?.stkCallback?.ResultCode;
    const resultDesc = callbackData.Body?.stkCallback?.ResultDesc;
    const checkoutRequestId = callbackData.Body?.stkCallback?.CheckoutRequestID;
    const merchantRequestId = callbackData.Body?.stkCallback?.MerchantRequestID;

    console.log('Callback details:', {
      resultCode,
      resultDesc,
      checkoutRequestId,
      merchantRequestId
    });

    const supabase = await createClient();

    if (resultCode === 0) {
      console.log('Payment successful in callback');
      
      const callbackMetadata = callbackData.Body.stkCallback.CallbackMetadata;
      if (callbackMetadata && callbackMetadata.Item) {
        const items = callbackMetadata.Item;
        const amount = items.find((item: any) => item.Name === 'Amount')?.Value;
        const receiptNo = items.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
        const phone = items.find((item: any) => item.Name === 'PhoneNumber')?.Value;
        
        console.log('Payment successful details:', {
          amount,
          receiptNo,
          phone
        });

        // Find payment by checkout request ID
        console.log('Looking for payment with checkout ID:', checkoutRequestId);
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .select('*')
          .eq('mpesa_checkout_request_id', checkoutRequestId)
          .single();

        if (paymentError) {
          console.error('Error finding payment:', paymentError);
          // Try to find by order number as fallback
          const accountReference = callbackData.Body?.stkCallback?.CheckoutRequestID;
          if (accountReference) {
            const orderNumber = accountReference.replace('Order', '').substring(0, 12);
            console.log('Trying to find payment by order number:', orderNumber);
            const { data: paymentByOrder } = await supabase
              .from('payments')
              .select('*')
              .eq('order_number', orderNumber)
              .single();
            
            if (paymentByOrder) {
              await processSuccessfulPayment(supabase, paymentByOrder, receiptNo, phone, callbackData);
            }
          }
        } else if (payment) {
          await processSuccessfulPayment(supabase, payment, receiptNo, phone, callbackData);
        } else {
          console.log('No payment found for checkout request:', checkoutRequestId);
        }
      }
    } else {
      console.log('Payment failed in callback:', { resultCode, resultDesc });

      // Find and update payment status to failed
      const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('mpesa_checkout_request_id', checkoutRequestId)
        .single();

      if (payment) {
        await supabase
          .from('payments')
          .update({
            status: 'failed',
            payment_gateway_response: callbackData
          })
          .eq('id', payment.id);
        console.log('Payment marked as failed:', payment.id);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Callback processed successfully'
    });

  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to process callback'
    }, { status: 500 });
  }
}

async function processSuccessfulPayment(supabase: any, payment: any, receiptNo: string, phone: string, callbackData: any) {
  console.log('Processing successful payment for:', payment.id);
  
  // Update payment status to completed
  const { error: updateError } = await supabase
    .from('payments')
    .update({
      status: 'completed',
      mpesa_receipt_number: receiptNo,
      payment_gateway_response: callbackData
    })
    .eq('id', payment.id);

  if (updateError) {
    console.error('Error updating payment:', updateError);
    return;
  }

  console.log('Payment updated successfully:', payment.id);

  // Check if order already exists
  const { data: existingOrder, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', payment.order_number)
    .single();

  if (orderError || !existingOrder) {
    console.log('Creating new order for payment:', payment.id);
    
    // Get user email for the order
    const { data: user } = await supabase.auth.admin.getUserById(payment.user_id);
    
    // Create order with the payment ID
    const { data: newOrder, error: createOrderError } = await supabase
      .from('orders')
      .insert({
        user_id: payment.user_id,
        order_number: payment.order_number,
        payment_id: payment.id,
        items: [{
          id: 'default',
          name: 'Products',
          price: payment.amount,
          quantity: 1,
          image: '/product.png',
          slug: 'products'
        }],
        total_amount: payment.amount,
        customer_phone: phone,
        customer_email: user?.user?.email || '',
        status: 'confirmed'
      })
      .select()
      .single();

    if (createOrderError) {
      console.error('Failed to create order:', createOrderError);
    } else {
      console.log('Order created successfully:', newOrder?.id);
    }
  } else {
    console.log('Order already exists, updating with payment ID:', existingOrder.id);
    // Order exists, update it with payment ID
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({ 
        payment_id: payment.id,
        status: 'confirmed'
      })
      .eq('order_number', payment.order_number);

    if (updateOrderError) {
      console.error('Error updating order:', updateOrderError);
    }
  }
}