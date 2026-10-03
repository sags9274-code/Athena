import sql from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'church_of_athena_sacred_jwt_secret_key_2026_goddess';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists
    const existing = await sql`SELECT id FROM users WHERE email = ${cleanEmail};`;
    if (existing.length > 0) {
      return res.status(400).json({ error: 'This spirit is already bound. Please log in.' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Default username if not provided
    const user_name = username || cleanEmail.split('@')[0];
    const user_id = 'usr_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

    // Assign role ('goddess' for athena/admin emails, otherwise 'sub')
    let role = 'sub';
    if (cleanEmail.includes('athena') || cleanEmail.includes('admin') || cleanEmail.includes('goddess')) {
      role = 'goddess';
    }

    const newUser = await sql`
      INSERT INTO users (id, email, password_hash, username, role)
      VALUES (${user_id}, ${cleanEmail}, ${password_hash}, ${user_name}, ${role})
      RETURNING id, email, username, role, avatar_url, created_at;
    `;

    const user = newUser[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({ user, token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message || 'Server error during signup' });
  }
}
