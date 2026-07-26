import { createClient } from '@supabase/supabase-js'

const url = 'https://tdnvitjncffhjxspvpeb.supabase.co'
const key = 'sb_publishable_8VjQZkKACmqT2P9B1C92mg_5aqGp6uX'

const supabase = createClient(url, key)

async function checkAllTables() {
  console.log('--- Checking `sections` table ---')
  const { data: sec } = await supabase.from('sections').select('*')
  console.log('sections:', JSON.stringify(sec, null, 2))

  console.log('--- Checking `page_sections` table ---')
  const { data: pageSec } = await supabase.from('page_sections').select('*')
  console.log('page_sections:', JSON.stringify(pageSec, null, 2))
}

checkAllTables()
