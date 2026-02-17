// Shared sidebar component for all roles
// import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown, LogOut } from 'lucide-react';
import { getNavigationItems} from '../../../config/navigationConfig';
// import authService from '../../../services/authService';
import logo from '../../../assets/login_logo.webp';

const Sidebar = ({ isCollapsed, onToggleCollapse, userData }) => {
  const location = useLocation();
  // const [showProfileMenu, setShowProfileMenu] = )useState(false);

  // Get navigation items based on user role
  const navigationItems = getNavigationItems(userData?.role);
  

  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path;
  };




  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 h-screen fixed left-0 top-0 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={logo}
            alt="ParkMate Logo"
            className={`object-contain transition-all duration-300 ${
              isCollapsed ? 'w-10 h-10' : 'w-12 h-12'
            }`}
          />
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-gray-900 text-base truncate">
                Park Mate
              </h1>
              <p className="text-xs text-gray-500 truncate">Admin Portal</p>
            </div>
          )}
        </div>
        
        {/* Collapse Toggle Button */}
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      {/* Expand Button (when collapsed) */}
      {isCollapsed && (
        <div className="px-6 py-4 border-b border-gray-200">
          <button
            onClick={onToggleCollapse}
            className="w-full p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 mx-auto" />
          </button>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                active
                  ? 'bg-gradient-to-r from-[#50B748] to-[#093F86] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              title={isCollapsed ? item.name : ''}
            >
              <Icon 
                className={`w-5 h-5 flex-shrink-0 ${
                  active ? 'text-white' : 'text-gray-600 group-hover:text-[#50B748]'
                }`} 
              />
              {!isCollapsed && (
                <span className={`text-sm font-medium truncate ${
                  active ? 'text-white' : 'text-gray-700'
                }`}>
                  {item.name}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      
    </aside>
  );
};

export default Sidebar;