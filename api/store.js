import sql from './db.js';

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const badges = await sql`SELECT * FROM badges ORDER BY cost ASC;`;
      return res.status(200).json({ badges });
    }

    if (method === 'POST') {
      const { user_id, badge_id, cost } = req.body;

      if (!user_id || !badge_id) {
        return res.status(400).json({ error: 'User ID and Badge ID are required' });
      }

      // Check if already redeemed
      const existing = await sql`
        SELECT id FROM user_badges WHERE user_id = ${user_id} AND badge_id = ${badge_id};
      `;
      if (existing.length > 0) {
        return res.status(400).json({ error: 'You have already redeemed this sacred relic.' });
      }

      // Calculate user total points
      const pointsRes = await sql`
        SELECT COALESCE(SUM(points), 0) as total FROM task_completions WHERE user_id = ${user_id};
      `;
      const redemptionsRes = await sql`
        SELECT COALESCE(SUM(cost), 0) as spent FROM redemptions WHERE user_id = ${user_id};
      `;

      const earned = parseInt(pointsRes[0].total, 10);
      const spent = parseInt(redemptionsRes[0].spent, 10);
      const balance = earned - spent;

      if (balance < cost) {
        return res.status(400).json({ error: `Insufficient points. You need ${cost} points but only have ${balance}.` });
      }

      // Insert redemption and user_badge
      await sql`
        INSERT INTO redemptions (user_id, badge_id, cost) VALUES (${user_id}, ${badge_id}, ${cost});
      `;
      await sql`
        INSERT INTO user_badges (user_id, badge_id) VALUES (${user_id}, ${badge_id});
      `;

      return res.status(200).json({ success: true, message: 'Sacred relic redeemed successfully!' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Store API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
