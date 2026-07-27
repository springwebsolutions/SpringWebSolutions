export interface LocationItem {
  name: string
  state: string
  category: 'Tamil Nadu' | 'Major Metro' | 'State Capital' | 'Remote / WFH' | 'International'
  badge?: string
}

export const POPULAR_INDIA_LOCATIONS: LocationItem[] = [
  // ── Remote & Work From Home ──
  { name: '100% Work From Home (WFH)', state: 'Pan-India', category: 'Remote / WFH', badge: '100% WFH' },
  { name: 'Pan-India Remote', state: 'India', category: 'Remote / WFH', badge: 'Remote' },
  { name: 'International Remote (US / EU / UAE)', state: 'Global', category: 'International', badge: 'Worldwide' },

  // ── Tamil Nadu Major Cities & Regions ──
  { name: 'Tamil Nadu (Statewide)', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN State' },
  { name: 'Chennai Metro', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN Metro' },
  { name: 'Coimbatore', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN Hub' },
  { name: 'Tiruchirappalli (Trichy)', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN Hub' },
  { name: 'Madurai', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN Hub' },
  { name: 'Salem', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN City' },
  { name: 'Tiruppur', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN Garment Hub' },
  { name: 'Udumalpet & Local Area', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'Local TN' },
  { name: 'Erode', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN City' },
  { name: 'Vellore', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN City' },
  { name: 'Tirunelveli', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN City' },
  { name: 'Thanjavur', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN City' },
  { name: 'Tuticorin (Thoothukudi)', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN Port City' },
  { name: 'Hosur', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN Auto Hub' },
  { name: 'Kanchipuram', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN City' },
  { name: 'Dindigul', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN City' },
  { name: 'Karur', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN City' },
  { name: 'Nagercoil', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN City' },
  { name: 'Cuddalore', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN City' },
  { name: 'Krishnagiri', state: 'Tamil Nadu', category: 'Tamil Nadu', badge: 'TN City' },

  // ── Karnataka ──
  { name: 'Bengaluru (Bangalore)', state: 'Karnataka', category: 'Major Metro', badge: 'Tech Hub' },
  { name: 'Mysuru (Mysore)', state: 'Karnataka', category: 'State Capital', badge: 'KA City' },
  { name: 'Mangaluru (Mangalore)', state: 'Karnataka', category: 'State Capital', badge: 'KA Port' },

  // ── Telangana & Andhra Pradesh ──
  { name: 'Hyderabad', state: 'Telangana', category: 'Major Metro', badge: 'Tech Hub' },
  { name: 'Visakhapatnam (Vizag)', state: 'Andhra Pradesh', category: 'State Capital', badge: 'AP Hub' },
  { name: 'Vijayawada', state: 'Andhra Pradesh', category: 'State Capital', badge: 'AP City' },
  { name: 'Tirupati', state: 'Andhra Pradesh', category: 'State Capital', badge: 'AP City' },

  // ── Maharashtra ──
  { name: 'Mumbai', state: 'Maharashtra', category: 'Major Metro', badge: 'Financial Capital' },
  { name: 'Pune', state: 'Maharashtra', category: 'Major Metro', badge: 'Tech Hub' },
  { name: 'Nagpur', state: 'Maharashtra', category: 'State Capital', badge: 'MH City' },
  { name: 'Navi Mumbai', state: 'Maharashtra', category: 'Major Metro', badge: 'MH Metro' },

  // ── Delhi NCR ──
  { name: 'New Delhi', state: 'Delhi NCR', category: 'Major Metro', badge: 'National Capital' },
  { name: 'Gurugram (Gurgaon)', state: 'Haryana / Delhi NCR', category: 'Major Metro', badge: 'Corporate Hub' },
  { name: 'Noida', state: 'Uttar Pradesh / Delhi NCR', category: 'Major Metro', badge: 'Tech Hub' },

  // ── Kerala ──
  { name: 'Kochi (Cochin)', state: 'Kerala', category: 'Major Metro', badge: 'KL Tech Hub' },
  { name: 'Thiruvananthapuram (Trivandrum)', state: 'Kerala', category: 'State Capital', badge: 'KL Capital' },
  { name: 'Kozhikode (Calicut)', state: 'Kerala', category: 'State Capital', badge: 'KL City' },

  // ── Gujarat ──
  { name: 'Ahmedabad', state: 'Gujarat', category: 'Major Metro', badge: 'GJ Hub' },
  { name: 'Surat', state: 'Gujarat', category: 'Major Metro', badge: 'GJ City' },
  { name: 'Vadodara', state: 'Gujarat', category: 'State Capital', badge: 'GJ City' },

  // ── West Bengal ──
  { name: 'Kolkata', state: 'West Bengal', category: 'Major Metro', badge: 'WB Capital' },

  // ── Uttar Pradesh ──
  { name: 'Lucknow', state: 'Uttar Pradesh', category: 'State Capital', badge: 'UP Capital' },
  { name: 'Kanpur', state: 'Uttar Pradesh', category: 'State Capital', badge: 'UP City' },

  // ── Rajasthan ──
  { name: 'Jaipur', state: 'Rajasthan', category: 'State Capital', badge: 'RJ Capital' },
  { name: 'Udaipur', state: 'Rajasthan', category: 'State Capital', badge: 'RJ City' },

  // ── Punjab & Chandigarh ──
  { name: 'Chandigarh', state: 'Punjab / Haryana', category: 'State Capital', badge: 'UT Capital' },
  { name: 'Ludhiana', state: 'Punjab', category: 'State Capital', badge: 'PB City' },

  // ── Madhya Pradesh ──
  { name: 'Indore', state: 'Madhya Pradesh', category: 'State Capital', badge: 'MP Hub' },
  { name: 'Bhopal', state: 'Madhya Pradesh', category: 'State Capital', badge: 'MP Capital' },

  // ── Odisha ──
  { name: 'Bhubaneswar', state: 'Odisha', category: 'State Capital', badge: 'OD Capital' }
]
