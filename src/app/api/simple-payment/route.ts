// Create a new file: src/app/api/simple-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, amount, items } = await request.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const orderId = `ORD-${Date.now()}`;
    const formattedPhone = phone.startsWith('0') ? `254${phone.substring(1)}` : phone;

    console.log('Creating payment and order...');

    // 1. Create payment
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        order_number: orderId,
        amount: Math.round(amount),
        mpesa_phone_number: formattedPhone,
        status: 'completed', // Mark as completed for testing
        mpesa_receipt_number: `TEST${Date.now()}`
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment creation failed:', paymentError);
      return NextResponse.json({ error: paymentError.message }, { status: 500 });
    }

    console.log('Payment created:', payment.id);

    // 2. Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderId,
        payment_id: payment.id,
        items: items || [{ id: 'test', name: 'Test Product', price: amount, quantity: 1 }],
        total_amount: Math.round(amount),
        customer_phone: formattedPhone,
        customer_email: user.email,
        status: 'confirmed'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation failed:', orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    console.log('Order created:', order.id);

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      orderId: order.id,
      orderNumber: orderId,
      message: 'Test order created successfully'
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}