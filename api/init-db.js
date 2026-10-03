import sql from './db.js';

export default async function handler(req, res) {
  try {
    // Create Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        username VARCHAR(255),
        role VARCHAR(50) DEFAULT 'sub',
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Contracts table
    await sql`
      CREATE TABLE IF NOT EXISTS contracts (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        contract_type VARCHAR(255) NOT NULL,
        terms TEXT NOT NULL,
        file_urls TEXT[] DEFAULT '{}',
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Tasks table
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        difficulty VARCHAR(50) DEFAULT 'Medium',
        time_estimate VARCHAR(50) DEFAULT '15 mins',
        points INT DEFAULT 50
      );
    `;

    // Seed default tasks if empty
    const existingTasks = await sql`SELECT COUNT(*) FROM tasks;`;
    if (parseInt(existingTasks[0].count, 10) === 0) {
      await sql`
        INSERT INTO tasks (title, difficulty, time_estimate, points) VALUES
        ('Sacred Chant of Devotion: Recite 100 times "Hail Goddess Athena, Wisdom and Power"', 'Easy', '10 mins', 25),
        ('Altar Cleaning & Sanctification: Kneel and polish the sacred floor', 'Medium', '20 mins', 50),
        ('Silent Meditation on Athena''s Glare: Stare at Her picture for 15 unbroken minutes', 'Medium', '15 mins', 50),
        ('Vow of Financial Submission: Submit immediate tribute link to Goddess Athena', 'Hard', '5 mins', 100),
        ('Confession of Unworthiness: Write a 500-word prayer of submission', 'Hard', '30 mins', 150);
      `;
    }

    // Create Task Completions table
    await sql`
      CREATE TABLE IF NOT EXISTS task_completions (
        id SERIAL PRIMARY KEY,
        task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        proof_text TEXT,
        proof_media_urls TEXT[] DEFAULT '{}',
        points INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Wall of Shame table
    await sql`
      CREATE TABLE IF NOT EXISTS wall_of_shame (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
        media_urls TEXT[] DEFAULT '{}',
        caption TEXT NOT NULL,
        tag VARCHAR(100) DEFAULT 'Sinful Penance',
        is_nsfw BOOLEAN DEFAULT false,
        likes_count INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Shame Comments table
    await sql`
      CREATE TABLE IF NOT EXISTS shame_comments (
        id SERIAL PRIMARY KEY,
        shame_id INT REFERENCES wall_of_shame(id) ON DELETE CASCADE,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        username VARCHAR(255) NOT NULL,
        comment_text TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Badges table
    await sql`
      CREATE TABLE IF NOT EXISTS badges (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(50) NOT NULL,
        cost INT NOT NULL
      );
    `;

    // Seed Badges if empty
    const existingBadges = await sql`SELECT COUNT(*) FROM badges;`;
    if (parseInt(existingBadges[0].count, 10) === 0) {
      await sql`
        INSERT INTO badges (title, description, icon, cost) VALUES
        ('Sanctified Penitent', 'Demonstrated humble devotion in the Church of Athena', '🕯️', 100),
        ('Altar Servant', 'Completed 5 sacred rites for Goddess Athena', '⛪', 250),
        ('Sacred Devotee', 'Offered financial tribute at the Holy Altar', '👑', 500),
        ('High Priest''s Favorite', 'Earned divine grace through unwavering obedience', '📜', 1000);
      `;
    }

    // Create User Badges table
    await sql`
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        badge_id INT REFERENCES badges(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Redemptions table
    await sql`
      CREATE TABLE IF NOT EXISTS redemptions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        badge_id INT REFERENCES badges(id) ON DELETE CASCADE,
        cost INT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    res.status(200).json({ success: true, message: 'Database initialized successfully on NeonDB!' });
  } catch (err) {
    console.error('Database initialization error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}
