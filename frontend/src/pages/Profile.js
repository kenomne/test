import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      username: parsedUser.username,
      email: parsedUser.email,
      avatar: parsedUser.avatar || ''
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // This would be an API call to update user profile
      // For now, just update localStorage
      const updatedUser = {
        ...user,
        username: formData.username,
        email: formData.email,
        avatar: formData.avatar
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email,
      avatar: user.avatar || ''
    });
    setIsEditing(false);
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  const winRate = user.games_played > 0 
    ? Math.round((user.games_won / user.games_played) * 100) 
    : 0;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button 
          onClick={() => navigate('/landing')} 
          className="back-btn"
        >
          ← Back to Dashboard
        </button>
        <h1>Profile</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h2>{user.username}</h2>
              <p className="profile-email">{user.email}</p>
              <div className="profile-rating">
                <span className="rating-value">{user.rating}</span>
                <span className="rating-label">Rating</span>
              </div>
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="edit-btn"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="save-btn"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={handleCancel} 
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="edit-form-card">
              <h3>Edit Profile</h3>
              <form className="edit-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="avatar">Avatar URL</label>
                  <input
                    type="url"
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="Enter avatar image URL"
                  />
                </div>
              </form>
            </div>
          )}

        </div>

        <div className="profile-sidebar">
          
          {/* Stats Card */}
          <div className="stats-card">
            <h3>Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{user.games_played}</span>
                <span className="stat-label">Games Played</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.games_won}</span>
                <span className="stat-label">Games Won</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.games_lost}</span>
                <span className="stat-label">Games Lost</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{winRate}%</span>
                <span className="stat-label">Win Rate</span>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="account-info-card">
            <h3>Account Information</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Member Since:</span>
                <span className="info-value">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Login:</span>
                <span className="info-value">
                  {new Date(user.last_login).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`status ${user.is_active ? 'active' : 'inactive'}`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;