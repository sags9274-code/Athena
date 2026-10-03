import sql from '../db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'church_of_athena_sacred_jwt_secret_key_2026_goddess';

export default async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const users = await sql`SELECT id, email, username, role, avatar_url, created_at FROM users WHERE id = ${decoded.id};`;
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.status(200).json({ user: users[0] });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
