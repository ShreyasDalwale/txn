import React from 'react';
import { NavLink } from 'react-router-dom';
import { SlHome, SlWallet, SlSettings, SlPlus } from 'react-icons/sl';
import PropTypes from 'prop-types';
import { signInWithGoogle } from '../services/auth';
import UserAvatar from './UserAvatar';

const navItems = [
  { to: '/', label: 'Dashboard', icon: SlHome },
  { to: '/add', label: 'Add Transaction', icon: SlPlus },
  { to: '/transactions', label: 'Transactions', icon: SlWallet },
  { to: '/settings', label: 'Settings', icon: SlSettings },
];

const Sidebar = ({ activeBook, user }) => {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-200 bg-white px-5 pt-6 md:flex">
      <div className="flex h-full w-full flex-col">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            TXN
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace</p>
            {activeBook ? (
              <p className="text-sm font-medium text-slate-700">{activeBook.name}</p>
            ) : (
              <p className="text-sm font-medium text-slate-700">Personal</p>
            )}
          </div>
        </div>

        <nav className="mt-6 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="text-base" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-200 pt-4 pb-6">
          {user ? (
            <UserAvatar user={user} />
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
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
};

export default Sidebar;
