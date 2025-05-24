# AI-Powered To-Do Manager

A full-stack mock assessment project with a Node.js/Express backend and a Next.js React frontend. Integrates OpenAI for AI-powered task suggestions.

## Folder Structure

```
mock-assessment/
├── client/           # Next.js React frontend
├── index.js          # Express backend entry point
├── package.json      # Backend dependencies
├── .env              # Backend environment variables
```

## Backend Setup (Node.js/Express)

1. **Install dependencies:**
   ```powershell
   npm install
   ```
2. **Configure OpenAI API Key:**
   - Copy your OpenAI API key into `.env`:
     ```
     OPENAI_API_KEY=your-key-here
     ```
3. **Run the backend server:**
   ```powershell
   node index.js
   ```
   The server runs on port 5000 by default.

## Frontend Setup (Next.js React)

1. **Install frontend dependencies:**
   ```powershell
   cd client
   npm install
   ```
2. **Run the frontend dev server:**
   ```powershell
   npm run dev
   ```
   The app runs on http://localhost:3000

## API Endpoints

- `POST   /tasks`            - Create a new task
- `GET    /tasks`            - List all tasks
- `PATCH  /tasks/:id`        - Update a task
- `DELETE /tasks/:id`        - Delete a task
- `POST   /tasks/:id/suggest`- Get AI suggestion for a task

## Deploying to Replit/Glitch

- **Replit:**
  - Import this repo.
  - Set the `.env` variable in the Replit secrets panel.
  - Run `node index.js` for backend and `npm run dev` in `client` for frontend.
- **Glitch:**
  - Import the repo.
  - Add `.env` with your OpenAI key.
  - Use Glitch's console to run backend and frontend as above.

## 4-Minute Pitch Recording

1. Briefly introduce the project and its AI features.
2. Demo creating, editing, deleting, and listing tasks.
3. Show the "Get AI Suggestion" feature in action.
4. Explain deployment steps and code structure.

## Scripts

- `npm start` (backend): Starts Express server
- `npm run dev` (frontend): Starts Next.js dev server

---

**Good luck with your assessment!**
