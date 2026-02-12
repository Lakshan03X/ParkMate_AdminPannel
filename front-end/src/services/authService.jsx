
/**
 * API Gateway endpoint configuration
 * TODO: Replace this URL with your actual API Gateway URL after AWS deployment
 * 
 * INSTRUCTIONS FOR AWS TEAM MEMBER:
 * After deploying API Gateway, replace the URL below with your Invoke URL
 * Example: 'https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod'
 */
const API_ENDPOINT = 'https://your-api-id.execute-api.your-region.amazonaws.com/prod';

class AuthService {
  constructor() {
    this.apiEndpoint = API_ENDPOINT;
  }

  /**
   * Get API endpoint URL
   * @returns {string} API endpoint
   */
  getApiUrl() {
    return this.apiEndpoint;
  }

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data with token and role
   */
  async login(email, password) {
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
   * Logout user and clear stored data
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get current user role
   * @returns {string|null}
   */
  getUserRole() {
    return localStorage.getItem('userRole');
  }

  /**
   * Get current user name
   * @returns {string|null}
   */
  getUserName() {
    return localStorage.getItem('userName');
  }

  /**
   * Get authentication token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Verify token with backend (optional - for enhanced security)
   * @returns {Promise<boolean>}
   */
  async verifyToken() {
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
}

// Export singleton instance as default
export default new AuthService();