const express = require('express');
const MatchHistory = require('../models/MatchHistory');
const User = require('../models/User');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// POST /api/matches - Kreiranje novog meča
router.post('/', authenticateToken, validate(schemas.createMatch), async (req, res) => {
  try {
    const { player2_id, winner_id, game_type, game_duration, notes } = req.validatedData;
    const player1_id = req.user.id;

    // Proveravamo da li igrač igra protiv sebe
    if (player1_id === player2_id) {
      return res.status(400).json({
        error: 'Invalid match',
        message: 'Ne možete igrati protiv sebe'
      });
    }

    // Proveravamo da li je pobednik jedan od igrača
    if (winner_id !== player1_id && winner_id !== player2_id) {
      return res.status(400).json({
        error: 'Invalid winner',
        message: 'Pobednik mora biti jedan od igrača'
      });
    }

    // Proveravamo da li drugi igrač postoji
    const player2 = await User.findById(player2_id);
    if (!player2) {
      return res.status(404).json({
        error: 'Player not found',
        message: 'Drugi igrač nije pronađen'
      });
    }

    const matchData = {
      player1_id,
      player2_id,
      winner_id,
      game_type,
      game_duration,
      notes
    };

    const result = await MatchHistory.create(matchData);

    if (!result.success) {
      return res.status(500).json({
        error: 'Failed to create match',
        message: result.error || 'Greška pri kreiranju meča'
      });
    }

    res.status(201).json({
      message: 'Meč uspešno kreiran',
      match_id: result.match_id,
      rating_changes: result.rating_changes
    });

  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({
      error: 'Failed to create match',
      message: 'Interna greška servera'
    });
  }
});

// GET /api/matches - Lista svih meceva
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const actualLimit = Math.min(limit, 50);

    const matches = await MatchHistory.findAll(page, actualLimit);

    res.json({
      message: 'Lista meceva',
      data: matches,
      pagination: {
        page,
        limit: actualLimit,
        total: matches.length
      }
    });

  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({
      error: 'Failed to get matches',
      message: 'Interna greška servera'
    });
  }
});

// GET /api/matches/recent - Nedavni mecevi
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const actualLimit = Math.min(limit, 20);

    const recentMatches = await MatchHistory.getRecentMatches(actualLimit);

    res.json({
      message: 'Nedavni mecevi',
      data: recentMatches
    });

  } catch (error) {
    console.error('Get recent matches error:', error);
    res.status(500).json({
      error: 'Failed to get recent matches',
      message: 'Interna greška servera'
    });
  }
});

// GET /api/matches/:id - Detalji meča po ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const matchId = parseInt(req.params.id);

    if (isNaN(matchId)) {
      return res.status(400).json({
        error: 'Invalid match ID',
        message: 'ID meča mora biti broj'
      });
    }

    const match = await MatchHistory.findById(matchId);

    if (!match) {
      return res.status(404).json({
        error: 'Match not found',
        message: 'Meč nije pronađen'
      });
    }

    res.json({
      message: 'Detalji meča',
      data: match
    });

  } catch (error) {
    console.error('Get match by ID error:', error);
    res.status(500).json({
      error: 'Failed to get match',
      message: 'Interna greška servera'
    });
  }
});

// GET /api/matches/user/:userId - Mecevi korisnika
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'ID korisnika mora biti broj'
      });
    }

    // Proveravamo da li korisnik postoji
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Korisnik nije pronađen'
      });
    }

    const actualLimit = Math.min(limit, 50);
    const matches = await MatchHistory.getUserMatches(userId, page, actualLimit);

    res.json({
      message: `Mecevi korisnika ${user.username}`,
      data: matches,
      pagination: {
        page,
        limit: actualLimit,
        total: matches.length
      }
    });

  } catch (error) {
    console.error('Get user matches error:', error);
    res.status(500).json({
      error: 'Failed to get user matches',
      message: 'Interna greška servera'
    });
  }
});

// GET /api/matches/my - Mecevi trenutnog korisnika
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const actualLimit = Math.min(limit, 50);

    const matches = await MatchHistory.getUserMatches(req.user.id, page, actualLimit);

    res.json({
      message: 'Vaši mecevi',
      data: matches,
      pagination: {
        page,
        limit: actualLimit,
        total: matches.length
      }
    });

  } catch (error) {
    console.error('Get my matches error:', error);
    res.status(500).json({
      error: 'Failed to get matches',
      message: 'Interna greška servera'
    });
  }
});

// GET /api/matches/stats/:userId - Statistike korisnika
router.get('/stats/:userId', optionalAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'ID korisnika mora biti broj'
      });
    }

    // Proveravamo da li korisnik postoji
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Korisnik nije pronađen'
      });
    }

    const stats = await MatchHistory.getUserStats(userId);

    res.json({
      message: `Statistike korisnika ${user.username}`,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        current_rating: user.rating
      },
      stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      error: 'Failed to get user stats',
      message: 'Interna greška servera'
    });
  }
});

// GET /api/matches/my/stats - Statistike trenutnog korisnika
router.get('/my/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await MatchHistory.getUserStats(req.user.id);

    res.json({
      message: 'Vaše statistike',
      user: {
        id: req.user.id,
        username: req.user.username,
        avatar: req.user.avatar,
        current_rating: req.user.rating
      },
      stats
    });

  } catch (error) {
    console.error('Get my stats error:', error);
    res.status(500).json({
      error: 'Failed to get stats',
      message: 'Interna greška servera'
    });
  }
});

module.exports = router;