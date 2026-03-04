import { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs'; 
import { adminDynamoService } from '../../services/superAdmin/awsDynamoService';
import authService from '../../services/authService';

const TABLE_NAME = import.meta.env.VITE_DYNAMODB_USERS_TABLE_ADMIN;

const useSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const email = authService.getUserEmail();
        //primary id is email so we can directly query with email as key
        const response = await adminDynamoService.getItem(TABLE_NAME, { email });
        if (response.item) {
          setUserData(response.item);
        } else {
          setUserData(authService.getUserData());
        }
      } catch (err) {
        console.error("Failed to load user data:", err);
        setUserData(authService.getUserData());
      }
    };
    loadUserData();
  }, []);

  const clearMessages = () => {
    setError('');
    setSuccessMsg('');
  };

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
    return '';
  };

  const saveSettings = async (formData) => {
    setIsLoading(true);
    clearMessages();
    
    try {
      const email = authService.getUserEmail();
      
      const updates = {
        name: formData.name,
        updatedAt: new Date().toISOString(),
      };

      if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
          throw new Error('Please fill in all password fields to update your password.');
        }

        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New password and Confirm password do not match.');
        }
        
        const validationError = validatePassword(formData.newPassword);
        if (validationError) throw new Error(validationError);

        
        const dbResponse = await adminDynamoService.getItem(TABLE_NAME, { email });
        const dbUser = dbResponse.item;
        if (!dbUser) throw new Error('User record not found in database.');

        const isMatch = await bcrypt.compare(formData.currentPassword, dbUser.password);
        if (!isMatch) throw new Error('The current password you entered is incorrect.');

        updates.password = await bcrypt.hash(formData.newPassword, 10);
      }

      await adminDynamoService.updateItem(TABLE_NAME, { email }, updates);

      setSuccessMsg('Settings updated successfully.');
      setUserData(prev => ({ ...prev, name: formData.name }));
      
      return true;
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Failed to update settings.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAllUsers = async () => {
      try {
        console.log("Fetching all ADMIN users from DynamoDB...");
        // Use adminDynamoService
        const result = await adminDynamoService.scan(TABLE_NAME);
        
        console.log(" SUCCESS! Here is all the data in AdminUsers table:", result.items);
        console.table(result.items);
        
      } catch (error) {
        console.error(" Failed to fetch all users:", error);
      }
    };
    checkAllUsers();
  }, []);

  return {
    userData,
    isLoading,
    error,
    successMsg,
    saveSettings,
    clearMessages
  };
};

export default useSettings;