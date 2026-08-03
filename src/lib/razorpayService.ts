export interface RazorpayOptions {
  amountInRupees: number
  productName: string
  productDescription?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  notes?: Record<string, string>
  onSuccess?: (data: { orderId: string; paymentId: string; signature: string }) => void
  onFailure?: (error: { code?: string; description?: string; reason?: string }) => void
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if ((window as any).Razorpay) return resolve(true)

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export const displayRazorpayCheckout = async (options: RazorpayOptions): Promise<void> => {
  const isLoaded = await loadRazorpayScript()
  if (!isLoaded) {
    alert('Failed to load Razorpay payment SDK. Please check your internet connection and try again.')
    if (options.onFailure) {
      options.onFailure({ description: 'SDK Script Failed to Load' })
    }
    return
  }

  const amountInPaise = Math.round(options.amountInRupees * 100)
  if (amountInPaise < 100) {
    alert('Minimum payment amount is ₹1 (100 paise).')
    return
  }

  const keyId = (import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TL9ayzhsxaOlAj').trim()

  try {
    // 1. Call Backend Order Creation Endpoint /api/create-order
    let orderData: any = null
    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: options.notes || { productName: options.productName }
        })
      })

      if (orderRes.ok) {
        orderData = await orderRes.json()
      } else {
        const errJson = await orderRes.json().catch(() => ({}))
        console.warn('[Razorpay API Warning]:', errJson.error || 'Serverless create-order returned non-200.')
      }
    } catch (apiErr) {
      console.warn('[Razorpay Network Notice]: Serverless API route not reachable. Falling back to direct checkout.', apiErr)
    }

    const orderId = orderData?.order_id || undefined

    // 2. Configure Razorpay Standard Modal Options
    const rzpOptions = {
      key: orderData?.key_id || keyId,
      amount: amountInPaise,
      currency: 'INR',
      name: 'Spring Web Solutions',
      description: options.productName || 'Software Service & Digital Purchase',
      image: 'https://www.springwebsolutions.in/logo-emblem.png',
      order_id: orderId,
      prefill: {
        name: options.customerName || '',
        email: options.customerEmail || '',
        contact: options.customerPhone || ''
      },
      theme: {
        color: '#10b981' // SpringWeb Emerald Theme Color
      },
      handler: async function (response: any) {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response || {}

        // 3. Verify Payment Signature Backend Call /api/verify-payment
        if (razorpay_signature && razorpay_order_id && razorpay_payment_id) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
              })
            })

            const verifyData = await verifyRes.json()
            if (verifyRes.ok && verifyData.success) {
              if (options.onSuccess) {
                options.onSuccess({
                  orderId: razorpay_order_id,
                  paymentId: razorpay_payment_id,
                  signature: razorpay_signature
                })
              } else {
                alert(`✅ Payment Verified Successfully!\nPayment ID: ${razorpay_payment_id}`)
              }
              return
            } else {
              alert(`❌ Payment Verification Failed: ${verifyData.error || 'Signature mismatch'}`)
              if (options.onFailure) {
                options.onFailure({ description: verifyData.error || 'Verification Failed' })
              }
              return
            }
          } catch (verifyErr: any) {
            console.error('[Razorpay Verify Error]:', verifyErr)
          }
        }

        // Direct fallback success callback
        if (options.onSuccess) {
          options.onSuccess({
            orderId: razorpay_order_id || 'order_direct',
            paymentId: razorpay_payment_id || 'pay_direct',
            signature: razorpay_signature || ''
          })
        } else {
          alert(`✅ Payment Successful!\nPayment ID: ${razorpay_payment_id}`)
        }
      },
      modal: {
        ondismiss: function () {
          console.log('[Razorpay Modal Dismissed]: User closed the payment window.')
          if (options.onFailure) {
            options.onFailure({ code: 'USER_CANCELLED', description: 'User cancelled the payment.' })
          }
        }
      }
    }

    const rzp = new (window as any).Razorpay(rzpOptions)

    rzp.on('payment.failed', function (response: any) {
      console.error('[Razorpay Payment Failed]:', response.error)
      alert(`❌ Payment Failed: ${response.error.description || 'Transaction declined'}`)
      if (options.onFailure) {
        options.onFailure(response.error)
      }
    })

    rzp.open()
  } catch (err: any) {
    console.error('[Razorpay Checkout Error]:', err)
    alert(`Checkout error: ${err.message || 'Unable to initialize Razorpay checkout'}`)
    if (options.onFailure) {
      options.onFailure({ description: err.message })
    }
  }
}
