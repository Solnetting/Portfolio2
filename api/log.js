const SUPABASE_URL = 'https://vrmjsrdwrwjppjrriost.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sNImiEJnP7MaJGbV4ga7QQ_5U0XRDuN';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { question, url } = req.body || {};
  if (!question) return res.status(400).json({ error: 'missing question' });

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/chat_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ question, url })
    });

    if (!r.ok) throw new Error(await r.text());
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
