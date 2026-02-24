// Authentication service with mock data for development

/**
 * MOCK AUTHENTICATION TOGGLE
 */
const USE_MOCK_AUTH = false;

/**
 * Mock user database for development
 * These credentials work when USE_MOCK_AUTH = true
 */
const MOCK_USERS = [
  {
    email: 'superadmin@parkmate.com',
    password: 'super123',
    role: 'SUPER_ADMIN',
    name: 'Super Administrator'
  },
  {
    email: 'municipal@parkmate.com',
    password: 'municipal123',
    role: 'MUNICIPAL_ADMIN',
    name: 'Municipal Officer'
  },
  {
    email: 'checker@parkmate.com',
    password: 'checker123',
    role: 'FINE_CHECKER',
    name: 'Fine Checker'
  }
];

/**
 * API Gateway endpoint configuration
 */
const API_ENDPOINT = import.meta.env.VITE_AWS_API_GATEWAY_URL_LOGIN;

class AuthService {
  constructor() {
    this.apiEndpoint = API_ENDPOINT;
  }

  /**
   * Get API endpoint URL
   */
  getApiUrl() {
    return this.apiEndpoint;
  }

  /**
   * Generate mock JWT token for development
   */
  generateMockToken(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      email: user.email,
      role: user.role,
      name: user.name,
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Mock login  validates against dummy users
   */
  async mockLogin(email, password) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find user in mock database
    const user = MOCK_USERS.find(u => u.email === email.toLowerCase());

    // Check if user exists
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }

    // Generate mock token
    const token = this.generateMockToken(user);
     
    console.log('🔑 Mock login successful for:', user);
    // Return user data
    return {
      
      token,
      role: user.role,
      name: user.name,
      email: user.email
    };
    
  }

  /**
   * Real API login calls AWS backend
   */
  async realLogin(email, password) {
    try {
      const response = await fetch(`${this.apiEndpoint}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      // Handle unsuccessful responses
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Validate response structure
      if (!data.token || !data.role) {
        throw new Error('Invalid response from server');
      }

      return {
        token: data.token,
        role: data.role,
        name: data.name,
        email: data.email
      };

    } catch (error) {
      // Network or other errors
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  /**
   * Login user with email and password
   * Automatically uses mock or real auth based on USE_MOCK_AUTH flag
   */
  async login(email, password) {
    if (USE_MOCK_AUTH) {
      console.log(' Using MOCK authentication (development mode)');
      return this.mockLogin(email, password);
    } else {
      console.log('Using REAL API authentication');
      return this.realLogin(email, password);
    }
  }

  /**
   * Logout user and clear stored data
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get current user role
   */
  getUserRole() {
    return localStorage.getItem('userRole');
  }

  /**
   * Get current user name
   */
  getUserName() {
    return localStorage.getItem('userName');
  }

  /**
   * Get current user email
   */
  getUserEmail() {
    return localStorage.getItem('userEmail');
  }

  /**
   * Get authentication token
   */
  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Get all user data
   */
  getUserData() {
    const token = this.getToken();
    const role = this.getUserRole();
    const name = this.getUserName();
    const email = this.getUserEmail();

    if (!token || !role) return null;

    return {
      token,
      role,
      name,
      email
    };
  }

  /**
   * Verify token with backend
   */
  async verifyToken() {
    if (USE_MOCK_AUTH) {
      // In mock mode, just check if token exists
      return this.isAuthenticated();
    }

    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch(`${this.apiEndpoint}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  /**
   * Get mock users (for development/testing only)
   */
  getMockUsers() {
    if (!USE_MOCK_AUTH) {
      console.warn('Mock users are only available in development mode');
      return [];
    }

    return MOCK_USERS.map(user => ({
      email: user.email,
      role: user.role,
      name: user.name
      
    }));
  }
}
export default new AuthService();