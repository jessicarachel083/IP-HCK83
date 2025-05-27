require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Model } = require('sequelize');

// Import routes
// const authRoutes = require('./routes/authRoutes');
// const missingPetRoutes = require('./routes/missingPetRoutes');
// const sightingRoutes = require('./routes/sightingRoutes');
// const commentRoutes = require('./routes/commentRoutes');

// Import error handler middleware
// const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json())
// app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/missing-pets', missingPetRoutes);
// app.use('/api/sightings', sightingRoutes);
// app.use('/api/comments', commentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Missing Pets API is running!', timestamp: new Date() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Missing Pets API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      missingPets: '/api/missing-pets',
      sightings: '/api/sightings',
      comments: '/api/comments'
    }
  });
});

// Error handling middleware (must be last)
// app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Missing Pets API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;