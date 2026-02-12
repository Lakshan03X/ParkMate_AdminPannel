import React from 'react';

const LoginForm = ({ logo, formData, loading, error, onSubmit, onChange }) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
      
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-6">
          <img src={logo} alt="Logo" className="w-32 h-32" />
        </div>
        <h1 className="text-3xl font-bold text-[#093F86] mb-2">
          Admin Portal
        </h1>
        <p className="text-gray-600 text-center">
          Manage Smart Parking System
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#50B748] focus:border-transparent outline-none transition-all duration-200 bg-white"
            placeholder="admin@parkmate.com"
            disabled={loading}
          />
        </div>

        {/* Password Input */}
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#50B748] focus:border-transparent outline-none transition-all duration-200 bg-white"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#50B748] to-[#093F86] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing In...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Footer Text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          ParkMate Admin Portal v1.0
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};

export default LoginForm;