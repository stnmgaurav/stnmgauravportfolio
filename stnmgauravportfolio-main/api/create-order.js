const Razorpay = require('razorpay');
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const amount = Number(req.body && req.body.amount);
  if (!Number.isInteger(amount) || amount < 1 || amount > 50000) return res.status(400).json({ error: 'Amount must be a whole number between ₹1 and ₹50,000.' });
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return res.status(500).json({ error: 'Payments are not configured yet.' });
  try { const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET }); const order = await razorpay.orders.create({ amount: amount * 100, currency: 'INR', receipt: `support_${Date.now()}` }); return res.status(200).json({ keyId: RAZORPAY_KEY_ID, order }); } catch (error) { console.error(error.message); return res.status(502).json({ error: 'Unable to create the payment order.' }); }
};
