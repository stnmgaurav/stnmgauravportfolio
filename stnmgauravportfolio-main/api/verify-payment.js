const crypto = require('crypto');
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (![razorpay_order_id, razorpay_payment_id, razorpay_signature].every((value) => typeof value === 'string' && value)) return res.status(400).json({ error: 'Payment verification details are incomplete.' });
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return res.status(500).json({ error: 'Payments are not configured yet.' });
  const expected = crypto.createHmac('sha256', secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  const valid = razorpay_signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(razorpay_signature), Buffer.from(expected));
  return valid ? res.status(200).json({ verified: true }) : res.status(400).json({ verified: false, error: 'Payment verification failed.' });
};
