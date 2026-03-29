const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

async function checkReview() {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/reviews?slug=eq.hoka-hopara-2&select=name,pros,pros_en`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    const data = await response.json();
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

checkReview();
