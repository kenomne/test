import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Crowbar.gg Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.username}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          
          {/* User Stats Card */}
          <div className="dashboard-card">
            <h3>Your Stats</h3>
            <div className="stats-grid">
              <div className="stat">
                <span className="stat-value">{user.rating || 1000}</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user.games_played || 0}</span>
                <span className="stat-label">Games Played</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user.games_won || 0}</span>
                <span className="stat-label">Games Won</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {user.games_played > 0 
                    ? Math.round((user.games_won / user.games_played) * 100) 
                    : 0}%
                </span>
                <span className="stat-label">Win Rate</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="dashboard-card">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <Link to="/matches/new" className="action-btn">
                <span className="action-icon">⚔️</span>
                New Match
              </Link>
              <Link to="/matches" className="action-btn">
                <span className="action-icon">📋</span>
                Match History
              </Link>
              <Link to="/leaderboard" className="action-btn">
                <span className="action-icon">🏆</span>
                Leaderboard
              </Link>
              <Link to="/profile" className="action-btn">
                <span className="action-icon">👤</span>
                Profile
              </Link>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="dashboard-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-text">Welcome to Crowbar.gg!</span>
                <span className="activity-time">Just now</span>
              </div>
              <div className="activity-item">
                <span className="activity-text">Account created successfully</span>
                <span className="activity-time">Today</span>
              </div>
            </div>
          </div>

          {/* Leaderboard Preview Card */}
          <div className="dashboard-card">
            <h3>Top Players</h3>
            <div className="leaderboard-preview">
              <div className="leaderboard-item">
                <span className="rank">#1</span>
                <span className="player">Player1</span>
                <span className="rating">1500</span>
              </div>
              <div className="leaderboard-item">
                <span className="rank">#2</span>
                <span className="player">Player2</span>
                <span className="rating">1450</span>
              </div>
              <div className="leaderboard-item">
                <span className="rank">#3</span>
                <span className="player">Player3</span>
                <span className="rating">1400</span>
              </div>
            </div>
            <Link to="/leaderboard" className="view-all-link">
              View Full Leaderboard →
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Landing;