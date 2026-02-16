import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardLayout from './shared/components/layout/DashboardLayout';
import authService from './services/authService';
import SuperAdminDashboard from './pages/SuperAdmin/Dashborad';
import MunicipalAdminDashboard from './pages/MunicipalAdmin/Dashboard';
import FineCheckerDashboard from './pages/FineChecker/Dashboard';



function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route - Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Super Admin Routes */}
          <Route path="super-admin" element={<SuperAdminDashboard />} />
          {/* Add more Super Admin routes
          <Route path="super-admin/vehicle-owners" element={<VehicleOwners />} />
          <Route path="super-admin/inspectors" element={<Inspectors />} />
          */}

          {/* Municipal Admin Routes */}
          <Route path="municipal" element={<MunicipalAdminDashboard />} />
          {/* Add more Municipal Admin routes
          <Route path="municipal/parking-zones" element={<ParkingZones />} />
          */}

          {/* Fine Checker Routes */}
          <Route path="checker" element={<FineCheckerDashboard />} />
          {/* Add more Fine Checker routes 
          <Route path="checker/fine-payments" element={<FinePayments />} />
          */}
        </Route>

        {/* Default Route - Redirect based on auth status */}
        <Route
          path="/"
          element={
            authService.isAuthenticated() ? (
              <Navigate
                to={`/dashboard/${authService.getUserRole()?.toLowerCase().replace('_', '-')}`}
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 - Not Found */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;