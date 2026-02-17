// Top navigation bar with search, notifications, and profile
import React, { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, Menu } from 'lucide-react';
import { getRoleDisplayName } from '../../../config/navigationConfig';
import authService from '../../../services/authService';

const TopNavbar = ({ userData, onMobileMenuToggle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const roleDisplayName = getRoleDisplayName(userData?.role);

  console.log(userData);

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    console.log('User logged out');
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
      if (!event.target.closest('.profile-dropdown')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#50B748] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <div className="relative notification-dropdown">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 hover:bg-gray-50 rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {/* Notification Badge */}
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {/* Sample Notifications */}
                  {[
                    { id: 1, text: 'New fine payment received', time: '2 minutes ago', unread: true },
                    { id: 2, text: 'Vehicle owner registration updated', time: '1 hour ago', unread: true },
                    { id: 3, text: 'Monthly revenue report ready', time: '3 hours ago', unread: false },
                  ].map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {notification.unread && (
                          <div className="w-2 h-2 bg-[#50B748] rounded-full mt-2 flex-shrink-0"></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{notification.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t border-gray-200">
                  <button className="text-sm text-[#50B748] hover:text-[#093F86] w-full text-center font-medium transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 sm:gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors"
              aria-label="Profile menu"
            >
              {/* Avatar */}
              <div className="w-9 h-9 bg-gradient-to-br from-[#50B748] to-[#093F86] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {getUserInitials(userData?.name)}


                </span>
              </div>
              
              {/* User Info (hidden on small screens) */}
              <div className="text-left hidden lg:block min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                  {userData?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                  {userData?.email || 'admin@parkmate.com'}
                </p>
              </div>
              
              <ChevronDown 
                className={`w-4 h-4 text-gray-600 hidden lg:block flex-shrink-0 transition-transform ${
                  showProfileMenu ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-3 border-b border-gray-100 lg:hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userData?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userData?.email || 'admin@parkmate.com'}
                  </p>
                </div>

                <div className="p-2">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <p className="text-sm font-medium text-gray-900">
                      {roleDisplayName}
                    </p>
                  </div>

                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mt-2 transition-colors">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    Account
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    Preferences
                  </button>
                </div>
                
                <div className="border-t border-gray-200 p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;