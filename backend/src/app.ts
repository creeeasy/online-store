import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import uploadRoutes from './routes/uploadRoutes';

// Load env vars
dotenv.config();

const app = express();

// ✅ CORS first (allow everything in dev)
app.use(
  cors({
    origin: (origin, callback) => callback(null, origin || '*'),
    credentials: true,
  })
);

// Body parser (for JSON/text fields only)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ✅ Mount upload routes
app.use('/api/upload', uploadRoutes);

// Mount other routes
app.use('/api', routes);

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Error handler middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;
