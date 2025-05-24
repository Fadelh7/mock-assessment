const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory task store
let tasks = [];
let nextId = 1;

// CRUD Endpoints
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  const task = { id: nextId++, title, description };
  tasks.push(task);
  res.status(201).json(task);
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.patch('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const { title, description } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(index, 1);
  res.status(204).send();
});

// AI Suggestion Endpoint
app.post('/tasks/:id/suggest', async (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  try {
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
