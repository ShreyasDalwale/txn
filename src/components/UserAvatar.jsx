import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout } from '../services/auth';
import './UserAvatar.css';

const UserAvatar = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
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

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="user-menu" ref={dropdownRef}>
      <img
        src={user.photoURL}
        alt={user.displayName}
        className="user-avatar"
        onClick={() => setShowDropdown(!showDropdown)}
      />
      {showDropdown && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <p className="user-name">{user.displayName}</p>
            <p className="user-email">{user.email}</p>
          </div>
          <Link 
            to="/settings" 
            className="dropdown-link"
            onClick={() => setShowDropdown(false)}
          >
            Settings
          </Link>
          <button onClick={handleLogout} className="btn-logout">
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