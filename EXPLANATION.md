# VeloTask | Project Retrospective & Documentation 🧠🔌

This document provides a detailed overview of what was built, the API architecture, and the technical challenges and solutions encountered during the development of VeloTask.

---

## 🛠️ What Was Built
VeloTask is a premium, high-performance full-stack task tracker and mini-project manager designed to match modern hand-crafted productivity software (inspired by Todoist and Linear).
* **Next.js 16/15 Client**: A light cream workspace theme featuring a responsive two-column layout (sidebar views and dynamic tags), clean CSS transitions, circular checklist toggles, and an animated toast notification system.
* **Express & SQLite3 Server**: Serves a secure, JWT-authenticated RESTful API backed by an embedded SQLite database with automatic schema seed initializations.
* **Smart Text Parser**: Features an on-the-fly client-side parser that extracts tags (`#marketing`), priority levels (`!high`), and due dates (`@tomorrow` or `@2026-06-15`) from titles and descriptions. It displays these visually as metadata badges and renders a **Live Preview** in the creation form.

---

## 🔌 API Endpoints Created
All task management endpoints are protected and require a `Authorization: Bearer <token>` request header.

### Authentication Endpoints (Public)
* `POST /api/auth/signup` - Register a new user account.
* `POST /api/auth/login` - Authenticate credentials and return a 24h JWT.

### Task Management Endpoints (Protected)
* `GET /api/tasks` - Retrieve all user tasks (supports search and status query filtering).
* `GET /api/tasks/stats` - Fetch aggregate workspace stats (total, completed, pending, percentage).
* `GET /api/tasks/:id` - Fetch details of a single task.
* `POST /api/tasks` - Create a new task.
* `PATCH /api/tasks/:id` - Partially update title, description, or status.
* `DELETE /api/tasks/:id` - Delete a task.

---

## 🧠 Challenges Faced & Technical Solutions

### 1. Monorepo Subfolder Deployments on Vercel
* **Challenge**: When pushing the full-stack repo to GitHub, Vercel's automated git builds failed because it searched for Next.js configurations at the root `/` level instead of the `/frontend` subfolder.
* **Solution**: Injected a root-level `vercel.json` telling Vercel to install dependencies, run build steps, and read output maps directly inside the `/frontend` directory, resolving build errors without manual configuration.

### 2. Stateless Frontend vs. Persistent SQLite Backend
* **Challenge**: SQLite is file-based and writes to `database.db` locally. Hosting this on serverless architectures like Vercel is impossible because serverless functions are read-only and recycle frequently, losing database state.
* **Solution**: Decoupled the architecture. Deployed the Next.js client to Vercel, and the Node/Express backend to Render as a persistent Web Service, ensuring SQLite writes persist successfully.

### 3. Dynamic Metadata Parsing Without Schema Bloat
* **Challenge**: Adding checkboxes, due dates, and tags would normally require modifying the SQLite schemas, updating migrations, and adding extensive database fields.
* **Solution**: Developed a regular-expression text parser on the client side that extracts metadata on-the-fly from titles and descriptions. This allowed features like priority borders and dynamic hashtag groups to run instantly without altering the backend SQL schema.

### 4. CORS Authorization Between Vercel and Render
* **Challenge**: Connecting a frontend on one domain to a backend on another triggers cross-origin resource blockings (CORS), especially with credentials enabled.
* **Solution**: Reconfigured the backend's CORS origin options to pull allowed hosts dynamically from a comma-separated `ALLOWED_ORIGINS` environment variable, enabling secure cross-origin communication between Vercel and Render.
