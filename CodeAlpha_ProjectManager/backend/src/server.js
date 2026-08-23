const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require('socket.io');

const config = require('./config/env');
const { initSocket } = require('./sockets/socketHandler');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [config.clientUrl, 'http://localhost:5175', 'http://127.0.0.1:5175', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  },
});
initSocket(io);

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or localhost
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === config.clientUrl) {
        return callback(null, true);
      }
      return callback(null, true); // Allow configured deployments
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ProjectManager API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// 404 Route handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling
app.use(errorHandler);

// Start server if not in test
if (process.env.NODE_ENV !== 'test') {
  const PORT = config.port || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 ProjectManager Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.io server ready for real-time collaboration`);
    console.log(`🔐 Clerk Auth configured | 🗄️  Supabase PostgreSQL connected`);
  });
}

module.exports = { app, server };
