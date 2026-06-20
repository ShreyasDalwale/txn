import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { logout } from '../services/auth';

const UserAvatar = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-slate-50"
      >
        <img
          src={user.photoURL}
          alt={user.displayName}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{user.displayName || 'User'}</p>
          <p className="truncate text-xs text-slate-500">{user.email || 'No email'}</p>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute bottom-full left-0 right-0 z-50 mb-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <span>Dark theme</span>
            <span>{darkMode ? 'On' : 'Off'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

UserAvatar.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    photoURL: PropTypes.string,
  }).isRequired,
};

export default UserAvatar;

