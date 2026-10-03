import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';

// Import handlers manually since Vercel automatically routes them, but locally we need to map them
import authLogin from './api/auth/login.js';
import authSignup from './api/auth/signup.js';
import authMe from './api/auth/me.js';
import checkout from './api/checkout.js';
import contracts from './api/contracts.js';
import dashboard from './api/dashboard.js';
import initDb from './api/init-db.js';
import profile from './api/profile.js';
import store from './api/store.js';
import tasks from './api/tasks.js';
import wallOfShame from './api/wall-of-shame.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Helper to wrap Vercel handlers for Express
const wrapHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
};

// Map routes exactly as Vercel would
app.all('/api/auth/login', wrapHandler(authLogin));
app.all('/api/auth/signup', wrapHandler(authSignup));
app.all('/api/auth/me', wrapHandler(authMe));
app.all('/api/checkout', wrapHandler(checkout));
app.all('/api/contracts', wrapHandler(contracts));
app.all('/api/dashboard', wrapHandler(dashboard));
app.all('/api/init-db', wrapHandler(initDb));
app.all('/api/profile', wrapHandler(profile));
app.all('/api/store', wrapHandler(store));
app.all('/api/tasks', wrapHandler(tasks));
app.all('/api/wall-of-shame', wrapHandler(wallOfShame));

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
