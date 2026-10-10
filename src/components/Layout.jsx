import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Gamepad2, User, Trophy, ShoppingBag, Settings, Menu, X, Coins } from 'lucide-react';
import { useDemo } from '../context/DemoContext';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user } = useDemo();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Gamepad2, label: 'Home' },
    { path: '/games', icon: Gamepad2, label: 'Games' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/shop', icon: ShoppingBag, label: 'Shop' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-text">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <Gamepad2 className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl text-gradient">Nexus</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-secondary bg-surface-secondary px-3 py-1 rounded-full neu-inset">
            <Coins className="w-4 h-4" />
            <span className="font-medium text-sm">{user.balance}</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg neu-button"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <nav className={`
        fixed md:sticky top-0 left-0 h-screen z-40
        w-64 glass-panel md:border-r border-white/5
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        <div className="hidden md:flex items-center gap-3 p-6 mb-6">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <span className="font-bold text-2xl text-gradient">Nexus</span>
        </div>

        {/* User Quick Stats (Desktop) */}
        <div className="hidden md:flex flex-col items-center p-4 mx-4 mb-6 neu-card">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 mb-2 shadow-lg">
            <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
              <User className="w-8 h-8 text-text-muted" />
            </div>
          </div>
          <h3 className="font-bold text-lg">{user.username}</h3>
          <div className="flex items-center gap-1 text-sm text-secondary mt-1">
            <Coins className="w-4 h-4" />
            <span>{user.balance}</span>
          </div>
          <div className="w-full bg-background rounded-full h-2 mt-3 neu-inset">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${(user.xp % 1000) / 10}%` }}
            />
          </div>
          <p className="text-xs text-text-muted mt-1">Lvl {user.level} - {user.xp % 1000}/1000 XP</p>
        </div>

        <div className="flex-1 px-4 py-6 md:py-0 space-y-2 overflow-y-auto mt-16 md:mt-0">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${isActive
                  ? 'bg-surface shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(255,255,255,0.05)] text-primary'
                  : 'hover:bg-surface-secondary text-text-muted hover:text-text'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-4 mt-auto">
          <NavLink
            to="/settings"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive
                ? 'bg-surface shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(255,255,255,0.05)] text-primary'
                : 'hover:bg-surface-secondary text-text-muted hover:text-text'}
            `}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </NavLink>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 min-w-0 overflow-x-hidden relative">
        <Outlet />
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
