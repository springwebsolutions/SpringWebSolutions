import Razorpay from 'razorpay';

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

  const keyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

  if (!keyId || !keySecret) {
    return res.status(401).json({ error: 'Razorpay API credentials missing in server environment.' });
  }

  const { amount, currency = 'INR', receipt, notes } = req.body || {};

  // Amount validation (minimum 100 paise = 1 INR)
  const parsedAmount = parseInt(amount, 10);
  if (isNaN(parsedAmount) || parsedAmount < 100) {
    return res.status(400).json({ error: 'Invalid amount. Minimum amount is 100 paise (1 INR).' });
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const options = {
      amount: parsedAmount,
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || { source: 'Spring Web Solutions Checkout' }
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId
    });
  } catch (err) {
    console.error('[Razorpay Create Order Error]:', err);
    return res.status(500).json({
      error: err.message || 'Failed to create Razorpay order.'
    });
  }
}
