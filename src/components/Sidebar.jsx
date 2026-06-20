import React from 'react';
import { NavLink } from 'react-router-dom';
import { SlHome, SlWallet, SlSettings, SlPlus } from 'react-icons/sl';
import PropTypes from 'prop-types';
import './Sidebar.css';

const Sidebar = ({ activeBook }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">Txn</h1>
        {activeBook && (
          <div className="active-book">
            <span className="book-icon">📖</span>
            <span className="book-name">{activeBook.name}</span>
          </div>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <SlHome className="nav-icon" />
          <span className="nav-label">Dashboard</span>
        </NavLink>
        
        <NavLink to="/add" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <SlPlus className="nav-icon" />
          <span className="nav-label">Add Transaction</span>
        </NavLink>
        
        <NavLink to="/transactions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <SlWallet className="nav-icon" />
          <span className="nav-label">Transactions</span>
        </NavLink>
        
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <SlSettings className="nav-icon" />
          <span className="nav-label">Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  activeBook: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default Sidebar;
