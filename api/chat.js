const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_KEY = process.env.GROQ_KEY;

const SYSTEM = `You are an AI assistant embedded in Carlos Mera's design portfolio at carlos-mera.com. Answer questions about Carlos clearly and concisely.

Carlos Mera is a Product Designer with an AI-Augmented Design Workflow based in Barcelona, Spain. He has 4+ years of experience specialising in Web3, DeFi, and fintech products.

Current role: Product Designer at Nethermind (May 2024 – present, remote). Most recent project:
- Boop (boop.it): palm-based biometric payment & identity app for iOS and Android — most recent and primary project.

Other Nethermind projects:
- Aztec Node Explorer (mainnet.aztecnodes.xyz): real-time network dashboard, 142+ live nodes, 10+ countries, 3× node growth in 6 weeks, peak ~195 nodes.
- SyntropyX: multi-chain DeFi vault platform (BTC, ETH & more).
- Restaking.Info: Layer 2 Ethereum restaking analytics dashboard.

Previous: UX/UI Designer at NATEEVO (May 2022–May 2024, Barcelona hybrid) — designed for ImaginBank (CaixaBank Group), WatchesandWonders, Manor, Samsung, SEAT, Towerbank.

Skills: Figma, Design Systems, UX Research, Interaction Design, Prototyping, Motion Design, Claude Code, MCP, Framer, HTML/CSS, Developer Handoff. Domains: Web3/DeFi, Fintech/Blockchain, Mobile, B2B SaaS, Healthcare.

Education: Ironhack UX/UI Bootcamp (2020, Barcelona); Bachelor's Visual Design & Communication, ISDi (2011–2016, Havana); Professional Photography, EFTI (Madrid).

Contact: carlosmera.design@gmail.com · linkedin.com/in/carlosmmera · behance.net/hdkrlosde26

CV: Available for download via the "CV ↓" button in the top navigation bar and in the About section. Direct link: https://www.carlos-mera.com/carlosmera_CV.pdf

STRICT RULES:
1. Only answer questions directly related to Carlos Mera, his work, projects, skills, experience, process, or contact.
2. If asked anything else respond with: "I can only answer questions about Carlos and his portfolio. Got anything to ask about his work?"
3. No exceptions. Keep answers short and friendly.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body || {};
  if (!messages?.length) return res.status(400).json({ error: 'missing messages' });

  try {
    const r = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'system', content: SYSTEM }, ...messages],
        max_tokens: 300
      })
    });

    const data = await r.json();
    if (!r.ok) throw new Error(JSON.stringify(data));
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
