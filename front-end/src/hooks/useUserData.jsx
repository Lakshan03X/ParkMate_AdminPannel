// Hook to get user data from localStorage
import { useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * Custom hook to get user data from localStorage
 */
const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = () => {
      try {
        const token = authService.getToken();
        const role = authService.getUserRole();
        const name = authService.getUserName();
        const email = authService.getUserEmail();

        if (token && role) {
          setUserData({
            token,
            role,
            name: name || 'User',
            email: email || 'user@parkmate.com',
          });
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  return { userData, loading };
};

export default useUserData;