import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';
import workerRoutes from './routes/workers.js';
import userRoutes from './routes/users.js';
import mediaRoutes from './routes/media.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://your-frontend-domain.com']
      : true, // Allow all origins in development for mobile app
    credentials: true
  }
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend-domain.com']
    : true, // Allow all origins in development for mobile app
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Civic Pulse API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      complaints: '/api/complaints',
      workers: '/api/workers',
      users: '/api/users',
      media: '/api/media',
      analytics: '/api/analytics'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/analytics', analyticsRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Accessible from Android emulator at http://10.0.2.2:${PORT}`);
});

export { io };
