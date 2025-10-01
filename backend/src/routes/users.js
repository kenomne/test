const express = require('express');
const User = require('../models/User');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Lista svih korisnika (sa paginacijom)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Ograničavamo limit na maksimum 50
    const actualLimit = Math.min(limit, 50);

    const users = await User.findAll(page, actualLimit);

    res.json({
      message: 'Lista korisnika',
      data: users.map(user => user.toJSON()),
      pagination: {
        page,
        limit: actualLimit,
        total: users.length
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to get users',
      message: 'Interna greška servera'
    });
  }
});

// GET /api/users/leaderboard - Top igrači po rating-u
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const actualLimit = Math.min(limit, 50);

    const leaderboard = await User.getLeaderboard(actualLimit);

    res.json({
      message: 'Leaderboard',
      data: leaderboard
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to get leaderboard',
      message: 'Interna greška servera'
    });
  }
});

// GET /api/users/:id - Profil korisnika po ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'ID korisnika mora biti broj'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Korisnik nije pronađen'
      });
    }

    res.json({
      message: 'Profil korisnika',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: 'Interna greška servera'
    });
  }
});

// DELETE /api/users/me - Brisanje trenutnog korisnika
router.delete('/me', authenticateToken, async (req, res) => {
  try {
    const result = await req.user.delete();

    if (!result.success) {
      return res.status(500).json({
        error: 'Delete failed',
        message: 'Greška pri brisanju naloga'
      });
    }

    res.json({
      message: 'Nalog uspešno obrisan'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Delete failed',
      message: 'Interna greška servera'
    });
  }
});

module.exports = router;