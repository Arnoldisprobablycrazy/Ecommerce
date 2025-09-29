// app/api/mpesa/verify/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const passkey = process.env.MPESA_PASSKEY;
    const shortcode = process.env.MPESA_SHORTCODE;

    // Check if environment variables are loaded
    const envCheck = {
      consumerKey: consumerKey ? `***${consumerKey.slice(-4)}` : 'MISSING',
      consumerSecret: consumerSecret ? `***${consumerSecret.slice(-4)}` : 'MISSING',
      passkey: passkey ? `***${passkey.slice(-4)}` : 'MISSING',
      shortcode: shortcode || 'MISSING',
      allSet: !!(consumerKey && consumerSecret && passkey && shortcode)
    };

    console.log('Environment Check:', envCheck);

    // Test authentication
    if (consumerKey && consumerSecret) {
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      
      const testResponse = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });

      const responseData = await testResponse.json();
      
      return NextResponse.json({
        environment: envCheck,
        authTest: {
          status: testResponse.status,
          statusText: testResponse.statusText,
          data: responseData
        }
      });
    } else {
      return NextResponse.json({
        environment: envCheck,
        authTest: 'Cannot test - missing credentials'
      });
    }

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({
      error: 'Verification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}