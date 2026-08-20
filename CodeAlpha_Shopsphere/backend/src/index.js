import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { isSupabaseConfigured } from './config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// -----------------------------------------------------------------------------
// High-Performance Middleware
// -----------------------------------------------------------------------------
// 1. Gzip/Brotli payload compression for fast network transfers
app.use(compression({
  level: 6,
  threshold: 512
}));

// 2. CORS configuration
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-clerk-user-id', 'x-user-id', 'x-guest-id', 'x-user-email']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ShopSphere API is running smoothly',
    timestamp: new Date().toISOString(),
    supabaseConnected: isSupabaseConfigured,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);

// -----------------------------------------------------------------------------
// Error Handling
// -----------------------------------------------------------------------------
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

// -----------------------------------------------------------------------------
// Start Server
// -----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 ShopSphere Backend running on http://localhost:${PORT}`);
  console.log(`📦 Product API: http://localhost:${PORT}/api/products`);
  console.log(`🛍️ Orders API:  http://localhost:${PORT}/api/orders`);
  console.log(`⚡ Supabase DB: ${isSupabaseConfigured ? 'Connected (PostgreSQL)' : 'Resilient Fallback Mode (Ready for keys)'}`);
  console.log(`⚡ Compression: Enabled (Gzip / Deflate)`);
  console.log(`====================================================`);
});
