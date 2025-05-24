import axios from 'axios';

export interface Task {
  id: number;
  title: string;
  description: string;
}

export interface SuggestionResponse {
  suggestion: string;
}

const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : '';

export async function fetchTasks(): Promise<Task[]> {
  const res = await axios.get(`${API_BASE}/tasks`);
  return res.data;
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  const res = await axios.post(`${API_BASE}/tasks`, task);
  return res.data;
}

export async function updateTask(id: number, updates: Partial<Omit<Task, 'id'>>): Promise<Task> {
  const res = await axios.patch(`${API_BASE}/tasks/${id}`, updates);
  return res.data;
}

export async function deleteTask(id: number): Promise<void> {
  await axios.delete(`${API_BASE}/tasks/${id}`);
}

export async function getSuggestion(id: number): Promise<SuggestionResponse> {
  const res = await axios.post(`${API_BASE}/tasks/${id}/suggest`);
  return res.data;
}
