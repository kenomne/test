const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// POST /api/auth/register - Registracija novog korisnika
router.post('/register', validate(schemas.register), async (req, res) => {
  try {
    const { username, email, password, avatar } = req.validatedData;

    // Proveravamo da li korisnik već postoji
    const existingUserByEmail = await User.findByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'Korisnik sa ovim email-om već postoji'
      });
    }

    const existingUserByUsername = await User.findByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({
        error: 'Username taken',
        message: 'Ovo korisničko ime je već zauzeto'
      });
    }

    // Kreiramo novog korisnika
    const newUser = await User.create({
      username,
      email,
      password,
      avatar
    });

    if (!newUser) {
      return res.status(500).json({
        error: 'Failed to create user',
        message: 'Greška pri kreiranju korisnika'
      });
    }

    // Kreiramo JWT token
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Korisnik uspešno kreiran',
      user: newUser.toJSON(),
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Interna greška servera'
    });
  }
});

// POST /api/auth/login - Prijava korisnika
router.post('/login', validate(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    // Pronalazimo korisnika
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Neispravni pristupni podaci'
      });
    }

    // Verifikujemo lozinku
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Neispravni pristupni podaci'
      });
    }

    // Ažuriramo poslednju prijavu
    await user.updateLastLogin();

    // Kreiramo JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Uspešna prijava',
      user: user.toJSON(),
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Interna greška servera'
    });
  }
});

// GET /api/auth/me - Trenutni korisnik
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: 'Failed to get user data',
      message: 'Interna greška servera'
    });
  }
});

// PUT /api/auth/profile - Ažuriranje profila
router.put('/profile', authenticateToken, validate(schemas.updateProfile), async (req, res) => {
  try {
    const updateData = req.validatedData;

    // Proveravamo da li novo korisničko ime već postoji
    if (updateData.username && updateData.username !== req.user.username) {
      const existingUser = await User.findByUsername(updateData.username);
      if (existingUser) {
        return res.status(400).json({
          error: 'Username taken',
          message: 'Ovo korisničko ime je već zauzeto'
        });
      }
    }

    // Proveravamo da li novi email već postoji
    if (updateData.email && updateData.email !== req.user.email) {
      const existingUser = await User.findByEmail(updateData.email);
      if (existingUser) {
        return res.status(400).json({
          error: 'Email taken',
          message: 'Ovaj email je već u upotrebi'
        });
      }
    }

    const result = await req.user.updateProfile(updateData);

    if (!result.success) {
      return res.status(500).json({
        error: 'Update failed',
        message: 'Greška pri ažuriranju profila'
      });
    }

    // Dobijamo ažurirane podatke
    const updatedUser = await User.findById(req.user.id);

    res.json({
      message: 'Profil uspešno ažuriran',
      user: updatedUser.toJSON()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Update failed',
      message: 'Interna greška servera'
    });
  }
});

module.exports = router;