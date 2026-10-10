import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedGames, getRecentGames } from '../games/core/GameRegistry';
import { useDemo } from '../context/DemoContext';
import { Trophy, Play, Info, Sparkles, Send } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { user, isDemoMode } = useDemo();

  const featured = getFeaturedGames();
  const recent = getRecentGames();

  const handleOpenBot = () => {
    window.open('https://t.me/your_bot_username', '_blank');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="neu-card p-6 md:p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 transition-all duration-700 group-hover:bg-primary/20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -ml-10 -mb-10 transition-all duration-700 group-hover:bg-secondary/20" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">Welcome back, <span className="text-gradient">{user.username}</span>!</h1>
          </div>
          <p className="text-text-muted mb-6 max-w-2xl">
            {isDemoMode
              ? "Running in Demo Mode. Your progress is saved locally. Connect Telegram to save to the cloud."
              : "Ready to conquer the leaderboards today?"}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/games')}
              className="px-6 py-3 rounded-xl neu-button flex items-center gap-2 font-bold text-primary"
            >
              <Play className="w-5 h-5 fill-current" /> Browse Games
            </button>
            <button
              onClick={handleOpenBot}
              className="px-6 py-3 rounded-xl bg-surface border border-white/10 flex items-center gap-2 font-bold hover:bg-surface-secondary transition-colors"
            >
              <Send className="w-5 h-5" /> Open Telegram Bot
            </button>
          </div>
        </div>
      </div>

      {/* Featured Games */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" /> Featured
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map(game => (
            <div key={game.id} className="neu-card overflow-hidden group cursor-pointer" onClick={() => navigate(game.route)}>
              <div className="h-48 relative overflow-hidden">
                <img
                  src={game.thumbnail}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary backdrop-blur-md rounded-md mb-2 inline-block">
                      {game.category}
                    </span>
                    <h3 className="text-2xl font-bold">{game.name}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full neu-button flex items-center justify-center bg-surface/80 backdrop-blur-md group-hover:bg-primary group-hover:text-background transition-all">
                    <Play className="w-4 h-4 fill-current ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats & Mini Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Progression Card */}
        <div className="neu-card p-6 lg:col-span-1">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-secondary" /> Your Progress
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-muted">Level {user.level}</span>
                <span className="font-bold text-primary">{user.xp % 1000} / 1000 XP</span>
              </div>
              <div className="w-full h-3 bg-surface-secondary rounded-full neu-inset overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                  style={{ width: `${(user.xp % 1000) / 10}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-secondary p-3 rounded-xl neu-inset text-center">
                <div className="text-2xl font-bold text-secondary mb-1">{user.balance}</div>
                <div className="text-xs text-text-muted uppercase tracking-wider">Coins</div>
              </div>
              <div className="bg-surface-secondary p-3 rounded-xl neu-inset text-center">
                <div className="text-2xl font-bold text-primary mb-1">{user.achievements.length}</div>
                <div className="text-xs text-text-muted uppercase tracking-wider">Awards</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Games */}
        <div className="neu-card p-6 lg:col-span-2">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" /> Game Library
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recent.map(game => (
              <div
                key={game.id}
                onClick={() => navigate(game.route)}
                className="group cursor-pointer text-center"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-2 neu-raised p-1">
                  <img
                    src={game.thumbnail}
                    alt={game.name}
                    className="w-full h-full object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                  />
                </div>
                <h4 className="font-bold text-sm truncate">{game.name}</h4>
                <p className="text-xs text-text-muted">{game.category}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
