import sql from './db.js';

export default async function handler(req, res) {
  try {
    const profiles = await sql`
      SELECT id, username, email, role, created_at FROM users WHERE role = 'sub' ORDER BY created_at DESC;
    `;

    const completions = await sql`
      SELECT c.user_id, c.points FROM task_completions c;
    `;

    const redemptions = await sql`
      SELECT r.user_id, r.cost FROM redemptions r;
    `;

    const shameCountRes = await sql`
      SELECT COUNT(*) FROM wall_of_shame;
    `;

    const subsMap = {};
    profiles.forEach(p => {
      subsMap[p.id] = {
        id: p.id,
        username: p.username || 'Anonymous',
        email: p.email || '',
        joined: new Date(p.created_at).toLocaleDateString(),
        earned: 0,
        spent: 0,
        tasksCompleted: 0
      };
    });

    completions.forEach(c => {
      if (subsMap[c.user_id]) {
        subsMap[c.user_id].earned += (c.points || 0);
        subsMap[c.user_id].tasksCompleted += 1;
      }
    });

    redemptions.forEach(r => {
      if (subsMap[r.user_id]) {
        subsMap[r.user_id].spent += (r.cost || 0);
      }
    });

    res.status(200).json({
      stats: {
        totalSubs: profiles.length,
        totalTasksCompleted: completions.length,
        totalShamePosts: parseInt(shameCountRes[0].count, 10) || 0
      },
      subs: Object.values(subsMap)
    });
  } catch (err) {
    console.error('Dashboard API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
