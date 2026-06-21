import React from 'react';
import { NavLink } from 'react-router-dom';
import { SlHome, SlWallet, SlSettings } from 'react-icons/sl';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-black px-4 md:hidden pb-safe">
      {/* Home Link */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold tracking-wide transition-colors ${
            isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
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
            isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
          }`
        }
      >
        <SlWallet className="text-lg mb-1" />
        <span>Txns</span>
      </NavLink>

      {/* Settings Link */}
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold tracking-wide transition-colors ${
            isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
          }`
        }
      >
        <SlSettings className="text-lg mb-1" />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
