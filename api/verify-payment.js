import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

  if (!keySecret) {
    return res.status(500).json({ error: 'Razorpay Secret Key missing in server environment.' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  // Validate missing fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      error: 'Missing required payment verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature).'
    });
  }

  try {
    // Generate HMAC-SHA256 signature using order_id|payment_id and KEY_SECRET
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.warn('[Razorpay Verification Failed]: Signature mismatch.', {
        expected: expectedSignature,
        received: razorpay_signature
      });
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature. Payment verification failed.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully.',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id
    });
  } catch (err) {
    console.error('[Razorpay Signature Verification Error]:', err);
    return res.status(500).json({
      error: err.message || 'Internal server error verifying payment signature.'
    });
  }
}
