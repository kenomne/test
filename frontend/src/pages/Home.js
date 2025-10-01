import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get leaderboard
        const leaderboardResponse = await axios.get('/api/users/leaderboard?limit=5');
        setLeaderboard(leaderboardResponse.data.data || []);

        // Get recent matches
        const matchesResponse = await axios.get('/api/matches/recent?limit=3');
        setRecentMatches(matchesResponse.data.data || []);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-content">
            <h1>Welcome to Crowbar.gg</h1>
            <p>The ultimate gaming platform for competitive gaming enthusiasts</p>
            
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Start Playing
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Crowbar.gg?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>ELO Rating System</h3>
              <p>Advanced rating system that precisely tracks your skill and ranks players</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Detailed Statistics</h3>
              <p>Track your progress with detailed game analysis and performance metrics</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3>Match History</h3>
              <p>Complete history of your matches with detailed opponent information</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🥇</div>
              <h3>Leaderboards</h3>
              <p>Compete with the best players and climb to the top of the rankings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            
            {/* Top Players */}
            <div className="stat-card leaderboard-preview">
              <h3>Top Players</h3>
              {loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : leaderboard.length > 0 ? (
                <div className="leaderboard-list">
                  {leaderboard.slice(0, 3).map((player, index) => (
                    <div key={player.id} className="leaderboard-item">
                      <span className="rank">#{index + 1}</span>
                      <span className="username">{player.username}</span>
                      <span className="rating">{player.rating}</span>
                    </div>
                  ))}
                  <Link to="/login" className="view-more">
                    Prijavite se za punu tabelu →
                  </Link>
                </div>
              ) : (
                <p>Nema podataka o igračima</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="stat-card recent-matches">
              <h3>Recent Matches</h3>
              {loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : recentMatches.length > 0 ? (
                <div className="matches-list">
                  {recentMatches.slice(0, 2).map((match) => (
                    <div key={match.id} className="match-item">
                      <div className="match-players">
                        <span className="player">{match.player1_username}</span>
                        <span className="vs">vs</span>
                        <span className="player">{match.player2_username}</span>
                      </div>
                      <div className="match-result">
                        Winner: <strong>{match.winner_username}</strong>
                      </div>
                    </div>
                  ))}
                  <Link to="/login" className="view-more">
                    Login for more →
                  </Link>
                </div>
              ) : (
                <p>No recent matches</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to get started?</h2>
            <p>Join thousands of players already enjoying Crowbar.gg</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Register for free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;