import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, amount, orderId } = await request.json();

    console.log('=== PAYMENT FLOW START ===');
    console.log('Received payment request:', { phone, amount, orderId });

    // Get credentials
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const passkey = process.env.MPESA_PASSKEY;
    const shortcode = process.env.MPESA_SHORTCODE;

    if (!consumerKey || !consumerSecret || !passkey || !shortcode) {
      console.error('Missing M-Pesa credentials');
      return NextResponse.json(
        { error: 'M-Pesa credentials not configured properly' },
        { status: 500 }
      );
    }

    // Get user from session
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Auth error:', userError);
    }
    
    if (!user) {
      console.error('No user found in session');
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    console.log('User authenticated:', user.id);

    const formattedPhone = phone.startsWith('0') 
      ? `254${phone.substring(1)}` 
      : phone;

    // STEP 1: Create payment record in database
    console.log('Creating payment record...');
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        order_number: orderId,
        amount: Math.round(amount),
        mpesa_phone_number: formattedPhone,
        status: 'processing'
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError);
      return NextResponse.json(
        { error: 'Failed to initialize payment' },
        { status: 500 }
      );
    }

    console.log('Payment record created:', payment.id);

    // STEP 2: Get M-Pesa access token
    console.log('Getting M-Pesa access token...');
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    
    const tokenResponse = await fetch(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { 'Authorization': `Basic ${auth}` } }
    );

    if (!tokenResponse.ok) {
      // Update payment status to failed
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id);
      
      const errorText = await tokenResponse.text();
      console.error('Token error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get access token from M-Pesa' },
        { status: 401 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id);
      console.error('No access token received');
      return NextResponse.json(
        { error: 'No access token received' },
        { status: 500 }
      );
    }

    console.log('Access token received');

    // STEP 3: Prepare STK Push
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
    const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

    // Use your ngrok URL for the callback
    const callbackURL = "https://ecommerce-ashen-delta-39.vercel.app/api/mpesa/callback";

    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackURL,
      AccountReference: `Order${orderId}`.substring(0, 12),
      TransactionDesc: `Order ${orderId}`,
    };

    console.log('Sending STK push...');

    // STEP 4: Send STK Push
    const stkResponse = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stkPayload),
      }
    );

    const stkData = await stkResponse.json();
    console.log('STK Response:', stkData);

    // STEP 5: Handle STK Response
    if (stkData.ResponseCode === '0') {
      // Update payment with M-Pesa request IDs
      await supabase
        .from('payments')
        .update({
          mpesa_checkout_request_id: stkData.CheckoutRequestID,
          mpesa_merchant_request_id: stkData.MerchantRequestID,
          payment_gateway_response: stkData
        })
        .eq('id', payment.id);

      console.log('STK Push initiated successfully');

      return NextResponse.json({
        success: true,
        paymentId: payment.id,
        message: 'Payment initiated. Check your phone to complete payment.',
        checkoutRequestID: stkData.CheckoutRequestID,
      });
    } else {
      // Update payment status to failed
      await supabase
        .from('payments')
        .update({
          status: 'failed',
          payment_gateway_response: stkData
        })
        .eq('id', payment.id);

      console.log('STK Push failed:', stkData.ResponseDescription);
      return NextResponse.json({
        success: false,
        error: stkData.ResponseDescription || 'Payment failed',
        responseCode: stkData.ResponseCode,
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Server error occurred during payment processing' },
      { status: 500 }
    );
  }
}