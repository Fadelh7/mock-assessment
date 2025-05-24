import React, { useEffect, useState } from "react";
import { fetchTasks, createTask, updateTask, deleteTask, getSuggestion, Task } from "./api";
import styles from "./page.module.css";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<{ [id: number]: string }>({});
  const [loadingSuggestion, setLoadingSuggestion] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const task = await createTask({ title: newTitle, description: newDesc });
    setTasks([...tasks, task]);
    setNewTitle("");
    setNewDesc("");
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDesc(task.description);
  };

  const handleUpdate = async (id: number) => {
    const updated = await updateTask(id, { title: editTitle, description: editDesc });
    setTasks(tasks.map(t => t.id === id ? updated : t));
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleGetSuggestion = async (id: number) => {
    setLoadingSuggestion(id);
    setAiSuggestion({ ...aiSuggestion, [id]: "Loading..." });
    try {
      const res = await getSuggestion(id);
      setAiSuggestion({ ...aiSuggestion, [id]: res.suggestion });
    } catch {
      setAiSuggestion({ ...aiSuggestion, [id]: "Error getting suggestion" });
    }
    setLoadingSuggestion(null);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>AI-Powered To-Do Manager</h1>
        <form onSubmit={handleCreate} className={styles.form}>
          <input
            placeholder="Title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            required
          />
          <input
            placeholder="Description"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>
        <ul className={styles.taskList}>
          {tasks.map(task => (
            <li key={task.id} className={styles.taskItem}>
              {editingId === task.id ? (
                <>
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                  <input value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                  <button onClick={() => handleUpdate(task.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>{task.title}</strong> <span>{task.description}</span>
                  <button onClick={() => handleEdit(task)}>Edit</button>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                  <button onClick={() => handleGetSuggestion(task.id)} disabled={loadingSuggestion === task.id}>
                    Get AI Suggestion
                  </button>
                  {aiSuggestion[task.id] && (
                    <div className={styles.suggestionBox}>{aiSuggestion[task.id]}</div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
