import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
// import ProtectedRoute from './components/ProtectedRoute';
// import { ROLES } from './utils/roleRoutes';
import  authService  from './services/authService';

// Import your dashboard components (create these based on your needs)
// import SuperAdminDashboard from './components/dashboards/SuperAdminDashboard';
// import MunicipalAdminDashboard from './components/dashboards/MunicipalAdminDashboard';
// import FineCheckerDashboard from './components/dashboards/FineCheckerDashboard';

// Placeholder dashboard components (replace with your actual components)
const SuperAdminDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
    <button 
      onClick={() => authService.logout()}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  </div>
);

const MunicipalAdminDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Municipal Admin Dashboard</h1>
    <button 
      onClick={() => authService.logout()}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  </div>
);

const FineCheckerDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Fine Checker Dashboard</h1>
    <button 
      onClick={() => authService.logout()}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route - Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Super Admin */}
        <Route 
          path="/dashboard/super-admin" 
          element={
           
              <SuperAdminDashboard />
            
          } 
        />

        {/* Protected Routes - Municipal Admin */}
        <Route 
          path="/dashboard/municipal" 
          element={
            
              <MunicipalAdminDashboard />
            
          } 
        />

        {/* Protected Routes - Fine Checker */}
        <Route 
          path="/dashboard/checker" 
          element={
           
              <FineCheckerDashboard />
            
          } 
        />

        {/* Default Route - Redirect based on auth status */}
        <Route 
          path="/" 
          element={
            authService.isAuthenticated() 
              ? <Navigate to={`/dashboard/${authService.getUserRole()?.toLowerCase().replace('_', '-')}`} replace />
              : <Navigate to="/login" replace />
          } 
        />

        {/* 404 - Not Found */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;