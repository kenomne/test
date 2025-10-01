import api from './api';

// Auth Service
export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

// User Service
export const userService = {
  // Get leaderboard
  async getLeaderboard(page = 1, limit = 10) {
    try {
      const response = await api.get(`/users/leaderboard?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
};

// Match Service
export const matchService = {
  // Get all matches
  async getMatches(page = 1, limit = 10) {
    try {
      const response = await api.get(`/matches?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch matches');
    }
  },

  // Create new match
  async createMatch(matchData) {
    try {
      const response = await api.post('/matches', matchData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create match');
    }
  }
};