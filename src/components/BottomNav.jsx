import React from 'react';
import { NavLink } from 'react-router-dom';
import { SlHome, SlWallet, SlSettings, SlPlus } from 'react-icons/sl';
import PropTypes from 'prop-types';

const BottomNav = ({ onAddClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-black px-4 md:hidden pb-safe">
      {/* Home Link */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold tracking-wide transition-colors ${
            isActive ? 'text-brand-teal' : 'text-slate-400 dark:text-slate-500'
          }`
        }
      >
        <SlHome className="text-lg mb-1" />
        <span>Home</span>
      </NavLink>

      {/* Transactions Link */}
      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold tracking-wide transition-colors ${
            isActive ? 'text-brand-teal' : 'text-slate-400 dark:text-slate-500'
          }`
        }
      >
        <SlWallet className="text-lg mb-1" />
        <span>Txns</span>
      </NavLink>

      {/* Center Plus CTA */}
      <div className="flex flex-1 justify-center">
        <button
          type="button"
          onClick={onAddClick}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 outline-none transition duration-150 active:scale-90"
          aria-label="Add transaction"
        >
          <SlPlus className="text-lg font-bold" />
        </button>
      </div>

      {/* Settings Link */}
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold tracking-wide transition-colors ${
            isActive ? 'text-brand-teal' : 'text-slate-400 dark:text-slate-500'
          }`
        }
      >
        <SlSettings className="text-lg mb-1" />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
};

BottomNav.propTypes = {
  onAddClick: PropTypes.func.isRequired,
};

export default BottomNav;
