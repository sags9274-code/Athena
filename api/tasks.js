import sql from './db.js';

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const tasks = await sql`SELECT * FROM tasks ORDER BY id ASC;`;
      return res.status(200).json({ tasks });
    }

    if (method === 'POST') {
      const { action, task_id, user_id, proof_text, proof_media_urls, title, difficulty, time_estimate, points } = req.body;

      if (action === 'create_task') {
        const newTask = await sql`
          INSERT INTO tasks (title, difficulty, time_estimate, points)
          VALUES (${title}, ${difficulty || 'Medium'}, ${time_estimate || '15 mins'}, ${points || 50})
          RETURNING *;
        `;
        return res.status(200).json({ task: newTask[0] });
      }

      if (action === 'complete_task') {
        const taskRes = await sql`SELECT points FROM tasks WHERE id = ${task_id};`;
        const taskPoints = taskRes[0] ? taskRes[0].points : 50;

        const completion = await sql`
          INSERT INTO task_completions (task_id, user_id, proof_text, proof_media_urls, points)
          VALUES (${task_id}, ${user_id}, ${proof_text || ''}, ${proof_media_urls || []}, ${taskPoints})
          RETURNING *;
        `;

        return res.status(200).json({ success: true, completion: completion[0] });
      }

      if (action === 'user_completions') {
        const completions = await sql`
          SELECT task_id FROM task_completions WHERE user_id = ${user_id};
        `;
        return res.status(200).json({ completed_task_ids: completions.map(c => c.task_id) });
      }
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Tasks API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
