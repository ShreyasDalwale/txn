import React from 'react';
import { NavLink } from 'react-router-dom';
import { SlHome, SlWallet, SlSettings, SlPlus } from 'react-icons/sl';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <SlHome className="bottom-nav-icon" />
        <span className="bottom-nav-label">Home</span>
      </NavLink>
      
      <NavLink to="/transactions" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <SlWallet className="bottom-nav-icon" />
        <span className="bottom-nav-label">Transactions</span>
      </NavLink>
      
      <NavLink to="/add" className={({ isActive }) => `bottom-nav-item add ${isActive ? 'active' : ''}`}>
        <div className="add-button">
          <SlPlus className="bottom-nav-icon" />
        </div>
      </NavLink>
      
      <NavLink to="/settings" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <SlSettings className="bottom-nav-icon" />
        <span className="bottom-nav-label">Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
