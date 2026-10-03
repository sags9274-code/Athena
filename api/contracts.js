import sql from './db.js';

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const contracts = await sql`
        SELECT c.*, u.username, u.email 
        FROM contracts c 
        LEFT JOIN users u ON c.user_id = u.id 
        ORDER BY c.created_at DESC;
      `;
      return res.status(200).json({ contracts });
    }

    if (method === 'POST') {
      const { user_id, name, contract_type, terms, file_urls } = req.body;

      if (!name || !contract_type || !terms) {
        return res.status(400).json({ error: 'Name, covenant type, and terms are required' });
      }

      const newContract = await sql`
        INSERT INTO contracts (user_id, name, contract_type, terms, file_urls)
        VALUES (${user_id || null}, ${name}, ${contract_type}, ${terms}, ${file_urls || []})
        RETURNING *;
      `;

      return res.status(200).json({ success: true, contract: newContract[0] });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Contracts API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
