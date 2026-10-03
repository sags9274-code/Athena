import sql from './db.js';

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const posts = await sql`
        SELECT w.*, u.username as poster_username 
        FROM wall_of_shame w 
        LEFT JOIN users u ON w.user_id = u.id 
        ORDER BY w.created_at DESC;
      `;

      const comments = await sql`
        SELECT * FROM shame_comments ORDER BY created_at ASC;
      `;

      const postsWithComments = posts.map(post => ({
        ...post,
        comments: comments.filter(c => c.shame_id === post.id)
      }));

      return res.status(200).json({ posts: postsWithComments });
    }

    if (method === 'POST') {
      const { action, user_id, media_urls, caption, tag, is_nsfw, shame_id, comment_text, username } = req.body;

      if (action === 'create_post') {
        const newPost = await sql`
          INSERT INTO wall_of_shame (user_id, media_urls, caption, tag, is_nsfw)
          VALUES (${user_id || null}, ${media_urls || []}, ${caption}, ${tag || 'Sinful Penance'}, ${is_nsfw || false})
          RETURNING *;
        `;
        return res.status(200).json({ post: newPost[0] });
      }

      if (action === 'add_comment') {
        const newComment = await sql`
          INSERT INTO shame_comments (shame_id, user_id, username, comment_text)
          VALUES (${shame_id}, ${user_id || null}, ${username || 'Anonymous Penitent'}, ${comment_text})
          RETURNING *;
        `;
        return res.status(200).json({ comment: newComment[0] });
      }

      if (action === 'like_post') {
        await sql`
          UPDATE wall_of_shame SET likes_count = likes_count + 1 WHERE id = ${shame_id};
        `;
        return res.status(200).json({ success: true });
      }

      if (action === 'delete_post') {
        await sql`DELETE FROM wall_of_shame WHERE id = ${shame_id};`;
        return res.status(200).json({ success: true });
      }
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Wall of Shame API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
