import React from 'react';
import { NavLink } from 'react-router-dom';
import { SlHome, SlWallet, SlSettings, SlPlus } from 'react-icons/sl';
import PropTypes from 'prop-types';
import { signInWithGoogle } from '../services/auth';
import UserAvatar from './UserAvatar';

const navItems = [
  { to: '/', label: 'Dashboard', icon: SlHome },
  { to: '/transactions', label: 'Transactions', icon: SlWallet },
  { to: '/settings', label: 'Settings', icon: SlSettings },
];

const Sidebar = ({ activeBook, user, onAddClick }) => {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-black px-5 pt-6 md:flex z-20">
      <div className="flex h-full w-full flex-col">
        {/* Workspace Brand Header */}
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 dark:bg-zinc-800 text-sm font-semibold text-white">
            TX
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">Workspace</p>
            <p className="truncate text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">
              {activeBook ? activeBook.name : 'Personal'}
            </p>
          </div>
        </div>

        {/* CTA Add Transaction Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onAddClick}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-4 py-3.5 text-sm font-bold shadow-none transition duration-150 outline-none active:scale-[0.98]"
          >
            <SlPlus className="text-sm font-bold" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold border-l-2 transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-white border-slate-900 dark:border-white shadow-none'
                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="text-base" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Profile Details */}
        <div className="mt-auto border-t border-slate-200 dark:border-zinc-800 pt-4 pb-6">
          {user ? (
            <UserAvatar user={user} />
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex w-full items-center justify-center rounded-2xl border border-slate-200 dark:border-zinc-800 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-zinc-900"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  activeBook: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    photoURL: PropTypes.string,
  }),
  onAddClick: PropTypes.func.isRequired,
};

export default Sidebar;
