import { Link } from 'react-router-dom';
import { Code2, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isLightMode, setIsLightMode] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    // Check initial state from classList
    setIsLightMode(document.documentElement.classList.contains('light-mode'));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isLightMode) {
      root.classList.remove('light-mode');
      setIsLightMode(false);
    } else {
      root.classList.add('light-mode');
      setIsLightMode(true);
    }
  };

  return (
    <div className="navbar glass-nav px-6 flex-none py-3">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl gap-2 font-bold tracking-tight hover:bg-white/5 transition-colors">
          <Code2 className="text-[var(--color-cc-primary)] w-8 h-8 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
          <span className="text-gradient drop-shadow-md">Code Caramel</span>
        </Link>
      </div>
      <div className="flex-none flex items-center gap-4">
        <ul className="flex items-center gap-6 px-4 font-semibold text-[var(--color-cc-text-muted)] lg:flex">
          <li>
            <Link to="/problems" className="hover:text-[var(--color-cc-primary)] transition-colors relative group whitespace-nowrap">
              Problems
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-cc-primary)] transition-all group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link to="/sheets" className="hover:text-[var(--color-cc-primary)] transition-colors relative group whitespace-nowrap">
              Sheets
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-cc-primary)] transition-all group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link to="/architecture" className="hover:text-purple-400 text-purple-300 transition-colors relative group whitespace-nowrap">
              Architecture
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link to="/leaderboard" className="hover:text-yellow-400 text-yellow-300 transition-colors relative group whitespace-nowrap flex items-center gap-1">
              Leaderboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
            </Link>
          </li>
        </ul>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle hover:bg-[var(--color-cc-card)] transition-colors text-[var(--color-cc-text)]"
          aria-label="Toggle Theme"
        >
          {isLightMode ? <Moon className="w-5 h-5 text-slate-800" /> : <Sun className="w-5 h-5 text-yellow-400" />}
        </button>

        {/* User / Login Section */}
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:ring-2 ring-[var(--color-cc-primary)]/50 transition-all">
              <div className="w-10 rounded-full border-2 border-[var(--color-cc-border)]">
                <img alt="User avatar" src={user.picture || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} />
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-[var(--color-cc-card)] rounded-box w-52 border border-[var(--color-cc-border)]">
              <li className="px-4 py-2 text-sm font-semibold border-b border-[var(--color-cc-border)]">
                {user.name}
              </li>
              <li>
                <Link to="/profile" onClick={() => (document.activeElement as HTMLElement)?.blur()} className="hover:text-[var(--color-cc-primary)] mt-1 font-medium">Profile</Link>
              </li>
              <li>
                <button onClick={() => { logout(); (document.activeElement as HTMLElement)?.blur(); }} className="text-red-500 hover:text-red-400 mt-1 font-medium">Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm rounded-box font-semibold text-[var(--color-cc-text)] hover:bg-[var(--color-cc-card)] transition-all">
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm rounded-box font-semibold shadow-md border-0 bg-[var(--color-cc-primary)] hover:bg-[var(--color-cc-primary)]/90 text-[var(--color-cc-bg)] transition-all">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
