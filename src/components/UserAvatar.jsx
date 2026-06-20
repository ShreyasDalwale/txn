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

  // Initialize dark mode from localStorage or system preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Sync state changes with localStorage and root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
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
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900/40 outline-none"
      >
        <img
          src={user.photoURL}
          alt={user.displayName}
          className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-200">{user.displayName || 'User'}</p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">{user.email || 'No email'}</p>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute bottom-full left-0 right-0 z-50 mb-2 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-none animate-in fade-in slide-in-from-bottom-2 duration-155">
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-900 dark:hover:text-white transition"
          >
            <span>Dark theme</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold">
              {darkMode ? 'ON' : 'OFF'}
            </span>
          </button>
          
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 block w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"
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
