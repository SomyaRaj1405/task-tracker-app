require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend integrations
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Register Api Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date() });
});

// Fallback for unmatched routes
app.use('*', (req, res, next) => {
  const err = new Error(`Resource not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// Global Error Handling Middleware
app.use(errorMiddleware);

// Initialize Database Schema and Start Express Server
const startServer = async () => {
  try {
    // Run schema migrations/initializations
    await db.initSchema();

    app.listen(PORT, () => {
      console.log(`VeloTask Backend Server successfully running on: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup crashed:', error.message);
    process.exit(1);
  }
};

startServer();
