import { Resend } from 'resend'

export interface ResendEmailPayload {
  from: string
  to: string | string[]
  subject: string
  html: string
  reply_to?: string
  attachments?: Array<{ filename: string; path?: string; content?: string }>
}

export interface ResendConfig {
  apiKey?: string
  fromEmail?: string
  notificationEmail?: string
  enableLeadNotify?: boolean
  enableTicketNotify?: boolean
}

/**
 * Send an email via official Resend SDK
 */
export async function sendResendEmail(
  payload: ResendEmailPayload,
  apiKey?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  let key = (apiKey || '').trim()
  if (!key) {
    key = (import.meta.env.VITE_RESEND_API_KEY || '').trim()
  }

  // 1. First try calling Vercel Serverless API endpoint (/api/send-email) to prevent browser CORS blocks
  try {
    const apiRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: payload.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        reply_to: payload.reply_to,
        attachments: payload.attachments,
        apiKey: key
      })
    })

    if (apiRes.ok) {
      const data = await apiRes.json()
      return { success: true, data: data.data || data }
    } else if (apiRes.status !== 404) {
      const errData = await apiRes.json().catch(() => ({}))
      return { success: false, error: errData.error || 'Serverless email endpoint returned error.' }
    }
  } catch (apiErr) {
    // If API route failed or 404, fallback to direct SDK execution below
  }

  // 2. Fallback to direct SDK execution
  if (!key || key === 'your_resend_api_key') {
    console.warn('[Resend] Email API Key not configured. Skipping email dispatch.')
    return { success: false, error: 'Resend API Key is missing. Add VITE_RESEND_API_KEY in Vercel environment variables or Admin Settings.' }
  }

  try {
    const resend = new Resend(key)
    const { data, error } = await resend.emails.send({
      from: payload.from,
      to: Array.isArray(payload.to) ? payload.to : [payload.to],
      subject: payload.subject,
      html: payload.html,
      ...(payload.reply_to ? { replyTo: payload.reply_to } : {})
    })

    if (error) {
      throw new Error(error.message || 'Failed to dispatch email via Resend SDK')
    }

    return { success: true, data }
  } catch (err: any) {
    console.error('[Resend Email Dispatch Error]:', err)
    return { success: false, error: err.message || 'Unknown network error sending email.' }
  }
}

function escapeHtml(str?: string): string {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Generate clean HTML template for New Lead Inquiry Notification
 */
export function buildLeadNotificationHTML(lead: {
  full_name: string
  email: string
  phone?: string
  service_interest?: string
  budget_range?: string
  message?: string
}): string {
  const safeName = escapeHtml(lead.full_name)
  const safeEmail = escapeHtml(lead.email)
  const safePhone = escapeHtml(lead.phone || 'N/A')
  const safeInterest = escapeHtml(lead.service_interest || 'General')
  const safeBudget = escapeHtml(lead.budget_range || 'N/A')
  const safeMsg = escapeHtml(lead.message || 'No additional message provided.')

  return `
    <div style="font-family: Arial, sans-serif; background-color: #070a13; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <div style="margin-bottom: 24px; text-align: center;">
        <h2 style="color: #10b981; margin: 0; font-size: 24px;">Spring Web Solutions</h2>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">New Client Lead Inquiry Alert</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
        <p style="margin: 8px 0;"><strong>Client Name:</strong> ${safeName}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #10b981;">${safeEmail}</a></p>
        <p style="margin: 8px 0;"><strong>Phone:</strong> ${safePhone}</p>
        <p style="margin: 8px 0;"><strong>Service Interest:</strong> ${safeInterest}</p>
        <p style="margin: 8px 0;"><strong>Budget Range:</strong> ${safeBudget}</p>
      </div>

      <div style="margin-top: 20px; padding: 16px; background: rgba(16,185,129,0.05); border-left: 4px solid #10b981; border-radius: 4px;">
        <p style="margin: 0; font-weight: bold; color: #10b981;">Inquiry Message:</p>
        <p style="margin-top: 8px; color: #cbd5e1; white-space: pre-wrap;">${safeMsg}</p>
      </div>

      <div style="margin-top: 28px; text-align: center; font-size: 12px; color: #64748b;">
        <p>Spring Web Solutions • Udumalpet, Tamil Nadu</p>
      </div>
    </div>
  `
}

/**
 * Generate clean HTML template for Test Email
 */
export function buildTestEmailHTML(senderEmail: string): string {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #070a13; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #10b981;">
      <div style="text-align: center;">
        <h2 style="color: #10b981; margin: 0;">Resend Email Integration Verified! ✅</h2>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">Your Resend API Key & Sender configuration are functioning correctly.</p>
      </div>
      <div style="margin-top: 24px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; text-align: center; font-size: 13px; color: #cbd5e1;">
        <p style="margin: 0;">Dispatched from: <strong>${senderEmail}</strong></p>
        <p style="margin-top: 4px; color: #64748b;">Timestamp: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `
}
