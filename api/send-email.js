import { Resend } from 'resend';

// Simple in-memory sliding-window rate limiter per IP (5 requests per 10 minutes)
const ipRateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = ipRateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    record.count += 1;
  }

  ipRateLimitMap.set(ip, record);
  return record.count <= MAX_REQUESTS_PER_WINDOW;
}

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type, Date'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. ORIGIN / REFERER SECURITY CHECK (Block ResendChecker & direct external bots)
  const origin = req.headers['origin'] || req.headers['referer'] || '';
  const allowedOrigins = [
    'springwebsolutions.in',
    'suite.springwebsolutions.in',
    'careers.springwebsolutions.in',
    'localhost',
    '127.0.0.1'
  ];

  const isAllowedOrigin = allowedOrigins.some(domain => origin.toLowerCase().includes(domain));
  if (!isAllowedOrigin && process.env.NODE_ENV === 'production') {
    console.warn(`[Security Alert] Blocked email request from unauthorized origin/bot: ${origin}`);
    return res.status(403).json({ error: 'Forbidden: Request origin unauthorized.' });
  }

  // 2. IP RATE LIMITING (Max 5 emails per 10 minutes per IP)
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp)) {
    console.warn(`[Rate Limit Exceeded] IP ${clientIp} exceeded rate limit.`);
    return res.status(429).json({ error: 'Too Many Requests: Rate limit exceeded. Please try again later.' });
  }

  const { from, to, subject, html, reply_to, hp_field, bot_check, attachments } = req.body || {};

  // 3. HONEYPOT BOT TRAP CHECK
  if (hp_field || bot_check) {
    console.warn(`[Bot Trap Activated] Silent drop of spam request from IP: ${clientIp}`);
    return res.status(200).json({ success: true, message: 'Message received.' });
  }

  // 4. SERVER-SIDE ONLY RESEND API KEY
  const keyToUse = (process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || '').trim();

  if (!keyToUse) {
    return res.status(400).json({ 
      error: 'Resend API Key is missing. Please add RESEND_API_KEY to your Vercel Environment Variables.' 
    });
  }

  try {
    const resend = new Resend(keyToUse);

    // Sanitize and validate sender
    const safeSender = (from && from.includes('@springwebsolutions.in')) 
      ? from 
      : 'Spring Web Solutions <hello@springwebsolutions.in>';

    const recipients = Array.isArray(to) ? to : [to];
    
    // Sanitize subject (prevent CRLF injection)
    const cleanSubject = String(subject || 'Notification from Spring Web Solutions').replace(/[\r\n]/g, ' ').substring(0, 150);

    let formattedAttachments = undefined;
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      formattedAttachments = attachments.map(att => {
        if (att.content && typeof att.content === 'string' && att.content.includes('base64,')) {
          const base64Clean = att.content.split('base64,')[1];
          return {
            filename: String(att.filename || 'document.pdf').replace(/[^a-zA-Z0-9_.-]/g, '_'),
            content: Buffer.from(base64Clean, 'base64')
          };
        }
        return att;
      });
    }

    const { data, error } = await resend.emails.send({
      from: safeSender,
      to: recipients,
      subject: cleanSubject,
      html: html || '<p>Notification from Spring Web Solutions</p>',
      ...(reply_to ? { replyTo: reply_to } : {}),
      ...(formattedAttachments ? { attachments: formattedAttachments } : {})
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
