import React from 'react';
import PropTypes from 'prop-types';
import { SlWallet } from 'react-icons/sl';
import { signInWithGoogle } from '../services/auth';
import UserAvatar from './UserAvatar';
import './Header.css';

const Header = ({ user }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title"><SlWallet /> Expense Tracker</h1>
        
        <div className="user-section">
          {user ? (
            <UserAvatar user={user} />
          ) : (
            <button onClick={signInWithGoogle} className="btn btn-primary">
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default Header;
