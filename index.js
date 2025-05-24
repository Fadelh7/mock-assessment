const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');
const mysql = require('mysql2/promise');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

// Helper: get all tasks from DB
async function getAllTasks() {
  const [rows] = await db.query('SELECT * FROM tasks');
  return rows;
}

// Helper: get task by id
async function getTaskById(id) {
  const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
  return rows[0];
}

// Helper: create task
async function createTaskDB(title, description) {
  const [result] = await db.query('INSERT INTO tasks (title, description) VALUES (?, ?)', [title, description]);
  return { id: result.insertId, title, description };
}

// Helper: update task
async function updateTaskDB(id, title, description) {
  await db.query('UPDATE tasks SET title = ?, description = ? WHERE id = ?', [title, description, id]);
  return getTaskById(id);
}

// Helper: delete task
async function deleteTaskDB(id) {
  await db.query('DELETE FROM tasks WHERE id = ?', [id]);
}

// CRUD Endpoints
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = await createTaskDB(title, description);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'DB error', details: err.message });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'DB error', details: err.message });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description } = req.body;
  try {
    const task = await getTaskById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const updated = await updateTaskDB(id, title ?? task.title, description ?? task.description);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'DB error', details: err.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const task = await getTaskById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await deleteTaskDB(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'DB error', details: err.message });
  }
});

// AI Suggestion Endpoint
app.post('/tasks/:id/suggest', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const task = await getTaskById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new OpenAIApi(configuration);
    const prompt = `Given the following task description, suggest a priority (High, Medium, Low) and a due date (if possible):\n\n${task.description}`;
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100
    });
    const aiText = completion.data.choices[0].message.content;
    res.json({ suggestion: aiText });
  } catch (err) {
    res.status(500).json({ error: 'AI suggestion failed', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
