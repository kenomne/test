const { executeQuery, executeTransaction } = require('../db/connection');
const bcrypt = require('bcrypt');

class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.avatar = data.avatar;
    this.rating = data.rating || 1000;
    this.games_played = data.games_played || 0;
    this.games_won = data.games_won || 0;
    this.games_lost = data.games_lost || 0;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.last_login = data.last_login;
    this.is_active = data.is_active;
  }

  // Kreiranje novog korisnika
  static async create(userData) {
    try {
      const { username, email, password, avatar } = userData;
      
      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);
      
      const query = `
        INSERT INTO users (username, email, password_hash, avatar, rating)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const result = await executeQuery(query, [
        username, 
        email, 
        password_hash, 
        avatar || null, 
        1000
      ]);
      
      if (result.success) {
        return await User.findById(result.data.insertId);
      }
      
      return null;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  // Pronalaženje korisnika po ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ? AND is_active = TRUE';
    const result = await executeQuery(query, [id]);
    
    if (result.success && result.data.length > 0) {
      return new User(result.data[0]);
    }
    
    return null;
  }

  // Pronalaženje korisnika po email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
    const result = await executeQuery(query, [email]);
    
    if (result.success && result.data.length > 0) {
      return new User(result.data[0]);
    }
    
    return null;
  }

  // Pronalaženje korisnika po username
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ? AND is_active = TRUE';
    const result = await executeQuery(query, [username]);
    
    if (result.success && result.data.length > 0) {
      return new User(result.data[0]);
    }
    
    return null;
  }

  // Verifikacija lozinke
  async verifyPassword(password) {
    try {
      return await bcrypt.compare(password, this.password_hash);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // Update last login
  async updateLastLogin() {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
    return await executeQuery(query, [this.id]);
  }

  // Update rating
  async updateRating(newRating) {
    const query = 'UPDATE users SET rating = ? WHERE id = ?';
    const result = await executeQuery(query, [newRating, this.id]);
    
    if (result.success) {
      this.rating = newRating;
    }
    
    return result;
  }

  // Update game statistics
  async updateGameStats(won) {
    const query = `
      UPDATE users 
      SET games_played = games_played + 1,
          games_won = games_won + ?,
          games_lost = games_lost + ?
      WHERE id = ?
    `;
    
    const result = await executeQuery(query, [
      won ? 1 : 0,
      won ? 0 : 1,
      this.id
    ]);
    
    if (result.success) {
      this.games_played += 1;
      if (won) {
        this.games_won += 1;
      } else {
        this.games_lost += 1;
      }
    }
    
    return result;
  }

  // Svi korisnici sa paginacijom
  static async findAll(page = 1, limit = 10) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const query = `
      SELECT id, username, email, created_at, rating, games_won, games_lost
      FROM users  
    `;
    
    const result = await executeQuery(query, [parseInt(limit), parseInt(offset)]);
    
    if (result.success) {
      return result.data.map(userData => new User(userData));
    }
    
    return [];
  }

  // Leaderboard (top igrači)
  static async getLeaderboard(limit = 10) {
    const query = `
      SELECT id, username, avatar, rating, games_played, games_won, games_lost
      FROM users 
      WHERE is_active = TRUE AND games_played > 0
      ORDER BY rating DESC 
      LIMIT ?
    `;
    
    const result = await executeQuery(query, [parseInt(limit)]);
    
    if (result.success) {
      return result.data;
    }
    
    return [];
  }

  // Update profila
  async updateProfile(updateData) {
    const allowedFields = ['username', 'email', 'avatar'];
    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (updates.length === 0) {
      return { success: false, error: 'No valid fields to update' };
    }
    
    values.push(this.id);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    
    return await executeQuery(query, values);
  }

  // Brisanje korisnika (soft delete)
  async delete() {
    const query = 'UPDATE users SET is_active = FALSE WHERE id = ?';
    return await executeQuery(query, [this.id]);
  }

  // Konvertovanje u JSON bez osetljivih podataka
  toJSON() {
    const { password_hash, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;