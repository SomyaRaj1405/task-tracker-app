# VeloTask ⚡

VeloTask is a premium, high-performance, full-stack Task Tracker and Mini-Project Management application. It is designed around a modular **Node.js/Express** backend serving a RESTful API backed by **SQLite**, and a dynamic, responsive **Next.js 15** frontend using the **App Router** and **Premium Vanilla CSS** styling.

---

## 🏗️ Architecture & Project Structure

The project is cleanly split into two separate directories:

```
task-tracker-app/
├── backend/                # Node.js + Express REST API Server
│   ├── config/             # Database connection setup (SQLite3)
│   ├── controllers/        # Route controllers (Request/Response handlers)
│   ├── middleware/         # Auth guarding (JWT) & Global Error catching
│   ├── models/             # SQLite Table Schemas & Seeds
│   ├── routes/             # REST resource mappings
│   ├── services/           # Business logic & SQL queries (Separation of concerns)
│   ├── .env                # Port, Database path, and Secrets
│   └── server.js           # Server bootstrap entry point
│
└── frontend/               # Next.js 15 Frontend Client
    ├── public/             # Static UI icons/assets
    └── src/
        ├── app/            # App Router views & route guards
        ├── components/     # UI widgets, Navigation, & Forms
        ├── hooks/          # React Auth session hooks
        └── services/       # Front-end API client layer
```

---

## 🛠️ Technical Stack & Highlights

### ⚡ Backend Server
- **Core Server**: Node.js & Express.
- **Database**: SQLite3 (Embedded). Automatically initializes table schemas at startup. Enables foreign keys for relational constraint integrity on tasks cascades (`ON DELETE CASCADE`).
- **Authentication**: JWT-based session tokens with a 24-hour expiration duration.
- **Security**: Secure password hashing utilizing `bcryptjs` salts.
- **Validations**: Stringent body payload sanitization and validations (name, regex email structures, password length).
- **Error Handling**: A centralized global error-catching middleware returning formatted JSON errors to clients.

### 🎨 Frontend Client
- **Framework**: Next.js 15 (React 19) App Router.
- **Styling**: **Premium Custom Vanilla CSS** featuring an immersive dark theme (`#090d16`), glassmorphism panels, customized typography (Inter), smooth state-based transition vectors, responsive flexible grids, and loading skeleton states.
- **Auth Guarding**: Custom React Hook `useAuth` syncing with local storage and intercepting unauthorized navigations to protect secure layouts.
- **Dashboard Utilities**: Interactive aggregate cards, completion percentage metrics progress indicators, and dynamic search/status filter updates.

---

## 🚀 Local Installation & Run Guide

Ensure that you have [Node.js (v18+)](https://nodejs.org) and `npm` installed.

### 1️⃣ Clone & Workspace Setup
Place the project folder inside your workspace and set the root directory as your active folder in your code editor:
```bash
# Set your terminal to the project root
cd task-tracker-app
```

---

### 2️⃣ Running the Backend API
1. Navigate into the `backend/` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the environment configuration. Create a `.env` file (this has been preconfigured for you):
   ```env
   PORT=5000
   JWT_SECRET=super_secret_key_for_velotask_auth_2026_antigravity
   DB_PATH=database.db
   NODE_ENV=development
   ```
4. Start the Express server:
   ```bash
   npm start
   ```
   *The server will run on **`http://localhost:5000`** and automatically initialize `database.db` inside your backend root folder.*

---

### 3️⃣ Running the Frontend Client
1. Open a new terminal session and navigate into the `frontend/` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js dev server:
   ```bash
   npm run dev
   ```
   *The client application will run on **`http://localhost:3000`**.*

---

## 🔗 Creating Your GitHub Repository

To upload this complete codebase to your own GitHub profile, run the following commands in the root `task-tracker-app` folder:

```bash
# 1. Initialize a git repository
git init

# 2. Stage all project files (ignoring node_modules and logs automatically)
git add .

# 3. Create your initial commit
git commit -m "feat: initial commit - complete full-stack VeloTask app"

# 4. Set the default main branch
git branch -M main

# 5. Connect your local repository to your remote GitHub repository
# (Replace your-username and your-repo-name with your actual details)
git remote add origin https://github.com/your-username/your-repo-name.git

# 6. Push the code
git push -u origin main
```
