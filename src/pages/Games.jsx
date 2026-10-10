import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameRegistry } from '../games/core/GameRegistry';
import { Play, Gamepad2, AlertCircle } from 'lucide-react';

export default function Games() {
  const navigate = useNavigate();

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Game Library</h1>
        <p className="text-text-muted">Choose a game to play and climb the leaderboards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GameRegistry.map(game => (
          <div
            key={game.id}
            className="neu-card flex flex-col overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1"
            onClick={() => navigate(game.route)}
          >
            <div className="h-48 relative overflow-hidden">
              <img
                src={game.thumbnail}
                alt={game.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
              {game.isPlaceholder && (
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-white/10">
                  <AlertCircle className="w-3 h-3 text-secondary" /> Coming Soon
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                    {game.category}
                  </span>
                  <h3 className="text-xl font-bold">{game.name}</h3>
                </div>
              </div>

              <p className="text-sm text-text-muted mb-6 flex-1 line-clamp-2">
                {game.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                  {game.supportedInputs.map(input => (
                    <div key={input} className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center neu-inset" title={`Supports ${input}`}>
                      <Gamepad2 className="w-4 h-4 text-text-muted" />
                    </div>
                  ))}
                </div>

                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
                    game.isPlaceholder
                      ? 'bg-surface-secondary text-text-muted'
                      : 'neu-button text-primary group-hover:bg-primary group-hover:text-background'
                  } transition-colors`}
                >
                  <Play className={`w-4 h-4 ${!game.isPlaceholder && 'fill-current'}`} />
                  {game.isPlaceholder ? 'View' : 'Play'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
