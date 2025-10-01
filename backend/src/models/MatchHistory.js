const { executeQuery, executeTransaction } = require('../db/connection');
const User = require('./User');

class MatchHistory {
  constructor(data) {
    this.id = data.id;
    this.player1_id = data.player1_id;
    this.player2_id = data.player2_id;
    this.winner_id = data.winner_id;
    this.loser_id = data.loser_id;
    this.player1_rating_before = data.player1_rating_before;
    this.player2_rating_before = data.player2_rating_before;
    this.player1_rating_after = data.player1_rating_after;
    this.player2_rating_after = data.player2_rating_after;
    this.rating_change = data.rating_change;
    this.game_type = data.game_type;
    this.game_duration = data.game_duration;
    this.match_date = data.match_date;
    this.notes = data.notes;
  }

  // Kreiranje novog meča
  static async create(matchData) {
    const {
      player1_id,
      player2_id,
      winner_id,
      game_type = 'casual',
      game_duration = null,
      notes = null
    } = matchData;

    try {
      // Dobijanje trenutnih rating-a igrača
      const player1 = await User.findById(player1_id);
      const player2 = await User.findById(player2_id);

      if (!player1 || !player2) {
        return { success: false, error: 'Jedan ili oba igrača ne postoje' };
      }

      // Izračunavanje novih rating-ova
      const ratingChanges = MatchHistory.calculateRatingChange(
        player1.rating,
        player2.rating,
        winner_id === player1_id
      );

      const player1_rating_after = player1.rating + ratingChanges.player1Change;
      const player2_rating_after = player2.rating + ratingChanges.player2Change;
      const loser_id = winner_id === player1_id ? player2_id : player1_id;

      // Transakcija za kreiranje meča i ažuriranje rating-ova
      const queries = [
        // Kreiranje match zapisa
        {
          query: `
            INSERT INTO match_history 
            (player1_id, player2_id, winner_id, loser_id, player1_rating_before, 
             player2_rating_before, player1_rating_after, player2_rating_after, 
             rating_change, game_type, game_duration, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          params: [
            player1_id, player2_id, winner_id, loser_id,
            player1.rating, player2.rating,
            player1_rating_after, player2_rating_after,
            Math.abs(ratingChanges.player1Change),
            game_type, game_duration, notes
          ]
        },
        // Ažuriranje rating-a za player1
        {
          query: `
            UPDATE users 
            SET rating = ?, games_played = games_played + 1,
                games_won = games_won + ?, games_lost = games_lost + ?
            WHERE id = ?
          `,
          params: [
            player1_rating_after,
            winner_id === player1_id ? 1 : 0,
            winner_id === player1_id ? 0 : 1,
            player1_id
          ]
        },
        // Ažuriranje rating-a za player2
        {
          query: `
            UPDATE users 
            SET rating = ?, games_played = games_played + 1,
                games_won = games_won + ?, games_lost = games_lost + ?
            WHERE id = ?
          `,
          params: [
            player2_rating_after,
            winner_id === player2_id ? 1 : 0,
            winner_id === player2_id ? 0 : 1,
            player2_id
          ]
        }
      ];

      const result = await executeTransaction(queries);

      if (result.success) {
        return {
          success: true,
          match_id: result.data[0].insertId,
          rating_changes: {
            player1: {
              old_rating: player1.rating,
              new_rating: player1_rating_after,
              change: ratingChanges.player1Change
            },
            player2: {
              old_rating: player2.rating,
              new_rating: player2_rating_after,
              change: ratingChanges.player2Change
            }
          }
        };
      }

      return result;
    } catch (error) {
      console.error('Error creating match:', error);
      return { success: false, error: error.message };
    }
  }

  // ELO rating kalkulacija
  static calculateRatingChange(rating1, rating2, player1Won, kFactor = 32) {
    // Expectedni score na osnovu ELO formule
    const expectedScore1 = 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
    const expectedScore2 = 1 / (1 + Math.pow(10, (rating1 - rating2) / 400));

    // Actualni score
    const actualScore1 = player1Won ? 1 : 0;
    const actualScore2 = player1Won ? 0 : 1;

    // Nove premeene u rating-u
    const player1Change = Math.round(kFactor * (actualScore1 - expectedScore1));
    const player2Change = Math.round(kFactor * (actualScore2 - expectedScore2));

    return {
      player1Change,
      player2Change
    };
  }

  // Dobijanje meča po ID
  static async findById(id) {
    const query = `
      SELECT mh.*, 
             u1.username as player1_username, u1.avatar as player1_avatar,
             u2.username as player2_username, u2.avatar as player2_avatar,
             uw.username as winner_username
      FROM match_history mh
      JOIN users u1 ON mh.player1_id = u1.id
      JOIN users u2 ON mh.player2_id = u2.id  
      JOIN users uw ON mh.winner_id = uw.id
      WHERE mh.id = ?
    `;

    const result = await executeQuery(query, [id]);

    if (result.success && result.data.length > 0) {
      return result.data[0];
    }

    return null;
  }

  // Match istorija za korisnika
  static async getUserMatches(userId, page = 1, limit = 10) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const query = `
      SELECT mh.*, 
             u1.username as player1_username, u1.avatar as player1_avatar,
             u2.username as player2_username, u2.avatar as player2_avatar,
             uw.username as winner_username
      FROM match_history mh
      JOIN users u1 ON mh.player1_id = u1.id
      JOIN users u2 ON mh.player2_id = u2.id
      JOIN users uw ON mh.winner_id = uw.id
      WHERE mh.player1_id = ? OR mh.player2_id = ?
      ORDER BY mh.match_date DESC
      LIMIT ? OFFSET ?
    `;

    const result = await executeQuery(query, [userId, userId, parseInt(limit), parseInt(offset)]);

    if (result.success) {
      return result.data;
    }

    return [];
  }

  // Sve mecevi sa paginacijom
  static async findAll(page = 1, limit = 10) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    console.log('findAll DEBUG:', {
      page: page,
      limit: limit,
      pageType: typeof page,
      limitType: typeof limit,
      offset: offset,
      offsetType: typeof offset,
      parseIntLimit: parseInt(limit),
      parseIntOffset: parseInt(offset)
    });
    
    const query = `
      SELECT mh.*, 
             u1.username as player1_username, u1.avatar as player1_avatar,
             u2.username as player2_username, u2.avatar as player2_avatar,
             uw.username as winner_username
      FROM match_history mh
      JOIN users u1 ON mh.player1_id = u1.id
      JOIN users u2 ON mh.player2_id = u2.id
      JOIN users uw ON mh.winner_id = uw.id
      ORDER BY mh.match_date DESC
      LIMIT ? OFFSET ?
    `;

    const result = await executeQuery(query, [parseInt(limit), parseInt(offset)]);

    if (result.success) {
      return result.data;
    }

    return [];
  }

  // Statistike korisnika
  static async getUserStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_matches,
        SUM(CASE WHEN winner_id = ? THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN winner_id != ? THEN 1 ELSE 0 END) as losses,
        AVG(CASE WHEN player1_id = ? THEN player1_rating_after ELSE player2_rating_after END) as avg_rating,
        AVG(game_duration) as avg_game_duration
      FROM match_history 
      WHERE player1_id = ? OR player2_id = ?
    `;

    const result = await executeQuery(query, [userId, userId, userId, userId, userId]);

    if (result.success && result.data.length > 0) {
      const stats = result.data[0];
      return {
        total_matches: parseInt(stats.total_matches),
        wins: parseInt(stats.wins),
        losses: parseInt(stats.losses),
        win_rate: stats.total_matches > 0 ? (stats.wins / stats.total_matches * 100).toFixed(2) : 0,
        avg_rating: stats.avg_rating ? parseFloat(stats.avg_rating).toFixed(0) : 0,
        avg_game_duration: stats.avg_game_duration ? parseInt(stats.avg_game_duration) : 0
      };
    }

    return {
      total_matches: 0,
      wins: 0,
      losses: 0,
      win_rate: 0,
      avg_rating: 0,
      avg_game_duration: 0
    };
  }

  // Nedavni mecevi (za dashboard)
  static async getRecentMatches(limit = 5) {
    const query = `
      SELECT mh.*, 
             u1.username as player1_username, u1.avatar as player1_avatar,
             u2.username as player2_username, u2.avatar as player2_avatar,
             uw.username as winner_username
      FROM match_history mh
      JOIN users u1 ON mh.player1_id = u1.id
      JOIN users u2 ON mh.player2_id = u2.id
      JOIN users uw ON mh.winner_id = uw.id
      ORDER BY mh.match_date DESC
      LIMIT ?
    `;

    const result = await executeQuery(query, [parseInt(limit)]);

    if (result.success) {
      return result.data;
    }

    return [];
  }
}

module.exports = MatchHistory;