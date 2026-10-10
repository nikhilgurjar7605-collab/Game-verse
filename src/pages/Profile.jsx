import React from 'react';
import { useDemo } from '../context/DemoContext';
import { User, Shield, Trophy, Award, Link as LinkIcon, AlertTriangle } from 'lucide-react';

export default function Profile() {
  const { user, isDemoMode } = useDemo();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">

      {isDemoMode && (
        <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 flex gap-4 items-start text-sm">
          <AlertTriangle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-secondary mb-1">Local Demo Mode</p>
            <p className="text-text-muted">You are viewing a local profile. Progress will not be saved permanently until you connect a Telegram account to the cloud backend.</p>
          </div>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="neu-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          <div className="w-32 h-32 rounded-full neu-raised p-2 bg-surface">
            <div className="w-full h-full rounded-full bg-surface-secondary flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gradient">{user.username}</h1>
              <span className="px-4 py-1 bg-surface-secondary rounded-full text-sm font-bold border border-white/5 mt-4 md:mt-0 inline-block">
                User ID: {user.uid.substring(0, 8)}...
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center gap-2 text-text-muted">
                <Shield className="w-4 h-4" /> Member since Today
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <Trophy className="w-4 h-4" /> Rank #42
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className={`px-6 py-2 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                user.telegramLinked
                  ? 'bg-surface-secondary text-text-muted cursor-default'
                  : 'neu-button text-[#0088cc]'
              }`}>
                <LinkIcon className="w-4 h-4" />
                {user.telegramLinked ? 'Telegram Connected' : 'Connect Telegram'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="neu-card p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-1">{user.level}</div>
          <div className="text-xs uppercase tracking-wider text-text-muted font-bold">Level</div>
        </div>
        <div className="neu-card p-6 text-center">
          <div className="text-3xl font-bold text-secondary mb-1">{user.xp}</div>
          <div className="text-xs uppercase tracking-wider text-text-muted font-bold">Total XP</div>
        </div>
        <div className="neu-card p-6 text-center">
          <div className="text-3xl font-bold text-yellow-500 mb-1">{user.balance}</div>
          <div className="text-xs uppercase tracking-wider text-text-muted font-bold">Coins</div>
        </div>
        <div className="neu-card p-6 text-center">
          <div className="text-3xl font-bold text-green-500 mb-1">{user.achievements.length}</div>
          <div className="text-xs uppercase tracking-wider text-text-muted font-bold">Awards</div>
        </div>
      </div>

      {/* Achievements Preview */}
      <div className="neu-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" /> Recent Achievements
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-secondary neu-inset">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold">First Steps</h4>
              <p className="text-xs text-text-muted">Logged in for the first time.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-secondary neu-inset">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h4 className="font-bold">Serpent Master</h4>
              <p className="text-xs text-text-muted">Played Neon Snake.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
