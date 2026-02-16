import React, { useState } from 'react';
import authService from '../services/authService';
import { navigateByRole } from '../utils/roleRoutes';
import LoginForm from './Subcomponents/LoginForm';
import logo from '../assets/login_logo.webp';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call authentication service
      const response = await authService.login(formData.email, formData.password);
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userRole', response.role);
      localStorage.setItem('userName', response.name);
      localStorage.setItem('userEmail', response.email);
      
      // Navigate based on role
      navigateByRole(response.role);
      
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#50B748] via-white to-[#093F86] p-4">
      <div className="w-full max-w-md">
        <LoginForm
          logo={logo}
          formData={formData}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
          onChange={handleChange}
        />

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/80">
            Need help? Contact system administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;