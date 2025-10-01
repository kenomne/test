const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Database connection
const { testConnection, initializeDatabase } = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes/api'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    console.log('🔄 Testiranje konekcije sa bazom...');
    const dbConnected = await testConnection();
    
    if (dbConnected) {
      // Initialize database tables
      console.log('🔄 Inicijalizujem tabele...');
      await initializeDatabase();
    }

    app.listen(PORT, () => {
      console.log('🚀 Crowbar.gg Server je pokrenut!');
      console.log(`🌍 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Database: ${dbConnected ? 'Connected' : 'Disconnected'}`);
      console.log('📋 Available endpoints:');
      console.log('   - GET  /health (Health check)');
      console.log('   - GET  /api/ (API documentation)');
      console.log('   - POST /api/auth/register (User registration)');
      console.log('   - POST /api/auth/login (User login)');
      console.log('   - GET  /api/users/leaderboard (Top players)');
      console.log('   - POST /api/matches (Create match)');
    });
  } catch (error) {
    console.error('❌ Greška pri pokretanju servera:', error);
    process.exit(1);
  }
};

startServer();