import { Resend } from 'resend';

export default async function handler(req, res) {
  // Enable CORS headers for API calls
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from, to, subject, html, reply_to, apiKey } = req.body || {};

  const keyToUse = (apiKey || process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY || '').trim();

  if (!keyToUse) {
    return res.status(400).json({ 
      error: 'Resend API Key is missing. Please add RESEND_API_KEY or VITE_RESEND_API_KEY to your Vercel Environment Variables.' 
    });
  }

  try {
    const resend = new Resend(keyToUse);
    const sender = from || 'Spring Web Solutions <hello@springwebsolutions.in>';
    const recipients = Array.isArray(to) ? to : [to];

    const { data, error } = await resend.emails.send({
      from: sender,
      to: recipients,
      subject: subject || 'Notification from Spring Web Solutions',
      html: html || '<p>Hello from Spring Web Solutions</p>',
      ...(reply_to ? { replyTo: reply_to } : {})
    });

    if (error) {
      console.error('[Vercel Resend API Error]:', error);
      return res.status(400).json({ error: error.message || 'Failed to send email via Resend' });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('[Vercel Resend Serverless Error]:', err);
    return res.status(500).json({ error: err.message || 'Internal server error dispatching email.' });
  }
}
