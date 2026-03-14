const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const crypto = require('crypto'); // Add this at the top of index.js

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from "Bearer <token>"
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE token = ?', [token]);
    if (rows.length === 0) return res.status(401).json({ message: 'Session expired' });

    req.user = { id: rows[0].id }; // Attach user ID to the request
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is active');
});

// Add this route directly in index.js
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = crypto.randomUUID(); 

    // Update the user record with the new token
    // If this line fails, it's usually because the 'token' column is missing
    await pool.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

    res.status(200).json({ token: token });
  } catch (err) {
  	console.error("LOGIN ERROR:", err)
    res.status(500).json({ error: err.message });
  }
});

// Add this to index.js
app.get('/tasks/my-tasks', authenticate, async (req, res) => {
  try {
    // ONLY select tasks belonging to req.user.id
    const [rows] = await pool.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// index.js
app.post('/tasks', authenticate, async (req, res) => {
  const { title, description } = req.body;
  try {
    await pool.query(
      'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)',
      [title, description, req.user.id]
    );
    res.status(201).json({ message: 'Task created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1. UPDATE Task (Title, Description, or Completed status)
app.put('/tasks/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  
  try {
    // We include user_id in the WHERE clause for security!
    const [result] = await pool.query(
      'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?',
      [title, description, completed, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. DELETE Task
app.delete('/tasks/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));