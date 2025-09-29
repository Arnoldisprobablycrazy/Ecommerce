// app/api/mpesa/test/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Show actual configuration (mask secrets)
    const config = {
      consumerKey: process.env.MPESA_CONSUMER_KEY ? '***' + process.env.MPESA_CONSUMER_KEY.slice(-4) : 'MISSING',
      consumerSecret: process.env.MPESA_CONSUMER_SECRET ? '***' + process.env.MPESA_CONSUMER_SECRET.slice(-4) : 'MISSING',
      shortcode: process.env.MPESA_SHORTCODE || 'MISSING',
      passkey: process.env.MPESA_PASSKEY ? '***' + process.env.MPESA_PASSKEY.slice(-4) : 'MISSING',
      nextauthUrl: process.env.NEXTAUTH_URL || 'MISSING',
    };

    console.log('M-Pesa Config Test:', config);

    // Test if we can create auth token
    if (process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET) {
      const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
      console.log('Auth token generated:', !!auth);
    }

    return NextResponse.json({ 
      success: true, 
      config,
      message: 'Test completed successfully' 
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Test failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}