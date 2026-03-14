const express = require('express');
const router = express.Router();
const pool = require('./db');
const authenticateToken = require('./auth');

// GET /tasks/my-tasks (Auth Required)
router.get('/my-tasks', authenticateToken, async (req, res) => {
  try {
    const [tasks] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ?', 
      [req.user.id]
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks (Auth Required)
router.post('/', authenticateToken, async (req, res) => {
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

module.exports = router;