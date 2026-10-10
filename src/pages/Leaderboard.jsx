import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { GameRegistry } from '../games/core/GameRegistry';
import { Trophy, Medal, Award, Star } from 'lucide-react';

export default function Leaderboard() {
  const { scores } = useDemo();
  const [activeTab, setActiveTab] = useState('global');

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3 text-gradient">
          <Trophy className="w-10 h-10 text-primary" /> Hall of Fame
        </h1>
        <p className="text-text-muted">Compare your scores against the best players across the platform.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('global')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            activeTab === 'global' ? 'neu-button text-primary' : 'hover:bg-surface-secondary text-text-muted'
          }`}
        >
          Global Level
        </button>
        {GameRegistry.filter(g => !g.isPlaceholder).map(game => (
          <button
            key={game.id}
            onClick={() => setActiveTab(game.id)}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeTab === game.id ? 'neu-button text-secondary' : 'hover:bg-surface-secondary text-text-muted'
            }`}
          >
            {game.name}
          </button>
        ))}
      </div>

      <div className="neu-card overflow-hidden">
        {activeTab === 'global' ? (
          <div className="p-12 text-center text-text-muted">
            <Star className="w-16 h-16 mx-auto mb-4 text-primary/30" />
            <h2 className="text-xl font-bold text-text mb-2">Global Leaderboard</h2>
            <p>Global XP rankings require an active server connection.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 font-bold text-text-muted text-sm uppercase tracking-wider">
              <div className="col-span-2 text-center">Rank</div>
              <div className="col-span-6">Player</div>
              <div className="col-span-4 text-right pr-4">Score</div>
            </div>

            <div className="divide-y divide-white/5">
              {(scores[activeTab] || []).length > 0 ? (
                scores[activeTab].map((score, idx) => (
                  <div key={score.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-surface-secondary/50 transition-colors">
                    <div className="col-span-2 flex justify-center">
                      {idx === 0 ? <Medal className="w-6 h-6 text-yellow-500" /> :
                       idx === 1 ? <Medal className="w-6 h-6 text-gray-400" /> :
                       idx === 2 ? <Medal className="w-6 h-6 text-amber-700" /> :
                       <span className="font-bold text-text-muted">#{idx + 1}</span>}
                    </div>
                    <div className="col-span-6 font-bold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center text-xs text-primary neu-inset">
                        {score.username.charAt(0)}
                      </div>
                      {score.username}
                    </div>
                    <div className="col-span-4 text-right pr-4 font-bold text-secondary text-lg">
                      {score.score.toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-text-muted">
                  No scores recorded yet. Be the first to set a high score!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
