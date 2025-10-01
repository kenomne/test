const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const matchRoutes = require('./matches');

// Use route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/matches', matchRoutes);

// GET /api/
router.get('/', (req, res) => {
  res.json({
    message: 'Dobrodošli na crowbar.gg API!',
    version: '1.0.0',
    features: [
      'User authentication (register, login)',
      'User management and profiles',
      'Match history with ELO rating system',
      'Leaderboard system',
      'Match statistics'
    ],
    endpoints: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/me',
        'PUT /api/auth/profile'
      ],
      users: [
        'GET /api/users',
        'GET /api/users/leaderboard',
        'GET /api/users/:id',
        'DELETE /api/users/me'
      ],
      matches: [
        'POST /api/matches',
        'GET /api/matches',
        'GET /api/matches/recent',
        'GET /api/matches/:id',
        'GET /api/matches/user/:userId',
        'GET /api/matches/my',
        'GET /api/matches/stats/:userId',
        'GET /api/matches/my/stats'
      ],
      legacy: [
        'GET /api/test',
        'POST /api/test',
        'GET /health'
      ]
    }
  });
});

// GET /api/test
router.get('/test', (req, res) => {
  res.json({
    message: 'Test ruta radi!',
    timestamp: new Date().toISOString(),
    data: {
      server: 'Node.js Express',
      status: 'active',
      database: 'MySQL connected'
    }
  });
});

// POST /api/test
router.post('/test', (req, res) => {
  const { name, message } = req.body;
  
  res.json({
    message: 'POST zahtev uspešno obrađen!',
    received: {
      name: name || 'Nepoznato',
      message: message || 'Nema poruke'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;