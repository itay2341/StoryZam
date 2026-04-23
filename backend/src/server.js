import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { config, validateConfig } from './config/config.js';
import songRoutes from './routes/songRoutes.js';

// Validate environment variables before starting
try {
  validateConfig();
} catch (error) {
  console.error('❌ Configuration Error:', error.message);
  console.error('Please copy .env.example to .env and fill in your API keys');
  process.exit(1);
}

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/songs', songRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Storyzam API is running' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Audio file must be less than 10MB',
      });
    }
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Storyzam API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🎵 Song recognition: http://localhost:${PORT}/api/songs/recognize`);
});

export default app;
