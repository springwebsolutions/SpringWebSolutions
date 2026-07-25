import { createClient } from '@supabase/supabase-js'

const url = 'https://tdnvitjncffhjxspvpeb.supabase.co'
const key = 'sb_publishable_8VjQZkKACmqT2P9B1C92mg_5aqGp6uX'

const supabase = createClient(url, key)

async function cleanNavigation() {
  const { data } = await supabase.from('site_settings').select('*').eq('key', 'navigation').single()
  if (data && data.value) {
    const value = data.value
    if (Array.isArray(value.header_menu)) {
      value.header_menu = value.header_menu.filter(item => {
        const href = (item.href || '').toLowerCase()
        const label = (item.label || '').toLowerCase()
        return href !== '/downloads' && href !== '/pricing' && label !== 'downloads' && label !== 'pricing'
      })
    }
    const { error } = await supabase.from('site_settings').update({ value }).eq('key', 'navigation')
    if (error) console.error('Error updating site_settings:', error)
    else console.log('Successfully cleaned navigation in Supabase site_settings table!')
  } else {
    console.log('No navigation record found in site_settings.')
  }
}

cleanNavigation()
