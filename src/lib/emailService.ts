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
 * Send an email via official Resend API
 */
export async function sendResendEmail(
  payload: ResendEmailPayload,
  apiKey?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  const key = (apiKey || '').trim()

  // 1. Call Vercel Serverless API endpoint (/api/send-email) which securely reads RESEND_API_KEY server-side
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
        ...(key ? { apiKey: key } : {})
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
    // If serverless endpoint unreachable, attempt direct fallback below
  }

  // 2. Direct client fallback (if key provided explicitly)
  if (!key) {
    console.warn('[Resend] Email API Key not configured on server.')
    return { success: false, error: 'Resend API Key is missing. Add RESEND_API_KEY in Vercel Environment Variables.' }
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
 * Send automated email notification to SpringWeb team when a new Lead is submitted
 */
export async function sendLeadNotificationEmail(
  lead: { name: string; email: string; phone?: string; company?: string; type?: string; message?: string },
  config?: ResendConfig
): Promise<boolean> {
  const targetEmail = config?.notificationEmail || 'hello@springwebsolutions.in'
  const activeKey = config?.apiKey

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #070a13; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <div style="margin-bottom: 24px; border-b: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px;">
        <h2 style="color: #10b981; margin: 0; font-size: 20px;">🚀 New Lead Captured on SpringWeb Solutions</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Lead Engine Automated Alert</p>
      </div>

      <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 120px;">Full Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${escapeHtml(lead.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0; color: #10b981; font-family: monospace;">${escapeHtml(lead.email)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Phone:</td>
            <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(lead.phone || 'Not Provided')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Company:</td>
            <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(lead.company || 'Direct Inquiry')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Category:</td>
            <td style="padding: 8px 0; color: #6366f1; font-weight: bold;">${escapeHtml(lead.type || 'Contact')}</td>
          </tr>
        </table>
      </div>

      ${lead.message ? `
      <div style="background-color: rgba(16,185,129,0.05); border-left: 3px solid #10b981; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; color: #10b981; font-size: 12px; font-weight: bold; text-transform: uppercase;">Inquiry Message / Scope:</p>
        <p style="margin: 0; color: #e2e8f0; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(lead.message)}</p>
      </div>
      ` : ''}

      <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-t: 1px solid rgba(255,255,255,0.1);">
        <a href="https://suite.springwebsolutions.in/crm" style="display: inline-block; background-color: #10b981; color: #070a13; font-weight: bold; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-size: 13px;">View in Lead Engine CRM ↗</a>
      </div>
    </div>
  `

  const result = await sendResendEmail({
    from: config?.fromEmail || 'SpringWeb Lead Engine <hello@springwebsolutions.in>',
    to: targetEmail,
    subject: `⚡ New Lead: ${lead.name} (${lead.company || lead.email})`,
    html,
    reply_to: lead.email
  }, activeKey)

  return result.success
}

/**
 * Build test email HTML wrapper for Site Settings test button
 */
export function buildTestEmailHTML(title: string, message?: string): string {
  const bodyText = message || 'This is a test notification confirming that your Resend email integration is working properly.'
  return `
    <div style="font-family: Arial, sans-serif; background-color: #070a13; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <div style="margin-bottom: 24px; text-align: center;">
        <h2 style="color: #10b981; margin: 0; font-size: 22px;">Resend Email Integration Verified</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Dispatched from: ${escapeHtml(title)}</p>
      </div>
      <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">${escapeHtml(bodyText)}</div>
    </div>
  `
}
