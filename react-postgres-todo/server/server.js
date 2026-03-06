// server.js
require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Allows parsing JSON body

// --- POSTGRESQL CONNECTION POOL ---
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// Test connection (optional, but good for debugging)
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Successfully connected to PostgreSQL!');
    release();
});

// --- API ROUTES (CRUD) ---

// 1) Create a new task
app.post('/api/tasks', async (req, res) => {
    try {
        const { description } = req.body || {};
        if (!description || !description.trim()) {
            return res.status(400).json({ error: 'Description is required' });
        }
        const result = await pool.query(
            'INSERT INTO tasks (description) VALUES ($1) RETURNING *',
            [description.trim()]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2) Get all tasks (newest first)
app.get('/api/tasks', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT task_id, description, completed, created_at FROM tasks ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3) Update task (description and/or completed)
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description, completed } = req.body || {};

        const result = await pool.query(
            `UPDATE tasks
             SET description = COALESCE($1, description),
                 completed   = COALESCE($2, completed)
             WHERE task_id = $3
             RETURNING *`,
            [
                description !== undefined ? String(description).trim() : null,
                typeof completed === 'boolean' ? completed : null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4) Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM tasks WHERE task_id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend API is running on port ' + PORT });
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});