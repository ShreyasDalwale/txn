import React from 'react';
import { NavLink } from 'react-router-dom';
import { SlHome, SlWallet, SlSettings } from 'react-icons/sl';
import PropTypes from 'prop-types';
import { signInWithGoogle } from '../services/auth';
import UserAvatar from './UserAvatar';

const navItems = [
  { to: '/', label: 'Dashboard', icon: SlHome },
  { to: '/transactions', label: 'Transactions', icon: SlWallet },
  { to: '/settings', label: 'Settings', icon: SlSettings },
];

const Sidebar = ({ user }) => {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-black px-5 pt-8 md:flex z-20">
      <div className="flex h-full w-full flex-col">

        {/* Animated Brand Logo */}
        <div className="mb-8 flex items-center gap-3 px-1">
          <div className="flex-shrink-0">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
              <defs>
                <style>{`
                  @keyframes txn-b1 {
                    0%,100% { transform: scaleY(0.35); }
                    50%      { transform: scaleY(1); }
                  }
                  @keyframes txn-b2 {
                    0%,100% { transform: scaleY(0.8); }
                    50%      { transform: scaleY(0.3); }
                  }
                  @keyframes txn-b3 {
                    0%,100% { transform: scaleY(0.5); }
                    50%      { transform: scaleY(1); }
                  }
                  @keyframes txn-b4 {
                    0%,100% { transform: scaleY(1); }
                    50%      { transform: scaleY(0.45); }
                  }
                  @keyframes txn-shine {
                    0%   { transform: translateX(-20px); opacity: 0; }
                    30%  { opacity: 0.18; }
                    100% { transform: translateX(60px); opacity: 0; }
                  }
                  .txn-b1 {
                    transform-box: fill-box;
                    transform-origin: bottom;
                    animation: txn-b1 1.6s ease-in-out infinite;
                  }
                  .txn-b2 {
                    transform-box: fill-box;
                    transform-origin: bottom;
                    animation: txn-b2 1.6s ease-in-out infinite 0.25s;
                  }
                  .txn-b3 {
                    transform-box: fill-box;
                    transform-origin: bottom;
                    animation: txn-b3 1.6s ease-in-out infinite 0.5s;
                  }
                  .txn-b4 {
                    transform-box: fill-box;
                    transform-origin: bottom;
                    animation: txn-b4 1.6s ease-in-out infinite 0.75s;
                  }
                  .txn-shine {
                    animation: txn-shine 3.5s ease-in-out infinite 1s;
                  }
                `}</style>
              </defs>

              {/* Dark rounded square background — stays dark in both themes */}
              <rect x="0" y="0" width="40" height="40" rx="11"
                className="fill-slate-900 dark:fill-zinc-800" />

              {/* Shine sweep */}
              <rect className="txn-shine" x="0" y="0" width="18" height="40" rx="0"
                fill="white" opacity="0" />

              {/* Animated equalizer bars — 4 bars growing from the bottom */}
              {/* Bar 1 */}
              <rect className="txn-b1" x="7"  y="12" width="5" height="18" rx="2.5"
                fill="white" opacity="0.9" />
              {/* Bar 2 */}
              <rect className="txn-b2" x="14.5" y="12" width="5" height="18" rx="2.5"
                fill="white" opacity="0.9" />
              {/* Bar 3 */}
              <rect className="txn-b3" x="22" y="12" width="5" height="18" rx="2.5"
                fill="white" opacity="0.9" />
              {/* Bar 4 */}
              <rect className="txn-b4" x="29" y="12" width="4" height="18" rx="2"
                fill="white" opacity="0.55" />

              {/* Upward arrow in top-right — indicates growth */}
              <path d="M31 10 L35 6 M35 6 L35 10 M35 6 L31 6"
                stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                opacity="0.5" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">Txn</p>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 tracking-widest uppercase">Expense Tracker</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
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
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default Sidebar;
