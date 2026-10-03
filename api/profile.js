import sql from './db.js';

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Calculate total points
      const pointsRes = await sql`
        SELECT COALESCE(SUM(points), 0) as total FROM task_completions WHERE user_id = ${user_id};
      `;
      const redemptionsRes = await sql`
        SELECT COALESCE(SUM(cost), 0) as spent FROM redemptions WHERE user_id = ${user_id};
      `;

      const earned = parseInt(pointsRes[0].total, 10);
      const spent = parseInt(redemptionsRes[0].spent, 10);
      const balance = earned - spent;

      // User badges
      const userBadges = await sql`
        SELECT b.* FROM user_badges ub
        JOIN badges b ON ub.badge_id = b.id
        WHERE ub.user_id = ${user_id};
      `;

      return res.status(200).json({ points: balance, badges: userBadges });
    }

    if (method === 'POST') {
      const { user_id, username, avatar_url } = req.body;

      if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      if (username !== undefined) {
        await sql`UPDATE users SET username = ${username} WHERE id = ${user_id};`;
      }

      if (avatar_url !== undefined) {
        await sql`UPDATE users SET avatar_url = ${avatar_url} WHERE id = ${user_id};`;
      }

      const updated = await sql`SELECT id, email, username, role, avatar_url FROM users WHERE id = ${user_id};`;

      return res.status(200).json({ success: true, user: updated[0] });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Profile API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
