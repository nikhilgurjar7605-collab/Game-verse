import React, { Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameById } from '../games/core/GameRegistry';
import { ArrowLeft, Gamepad2, Info, Loader } from 'lucide-react';
import { useDemo } from '../context/DemoContext';

// Define explicit imports to handle Vite's dynamic import constraints easily
const gameComponents = {
  'snake-01': lazy(() => import('../games/snake/index.jsx')),
  'asteroids-02': lazy(() => import('../games/placeholder-1/index.jsx')),
  'memory-03': lazy(() => import('../games/placeholder-2/index.jsx')),
  'jump-04': lazy(() => import('../games/placeholder-3/index.jsx')),
};

export default function GamePlayer() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = getGameById(gameId);
  const { scores } = useDemo();

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
        <button onClick={() => navigate('/games')} className="px-6 py-2 neu-button rounded-xl">Back to Games</button>
      </div>
    );
  }

  const GameComponent = gameComponents[game.id];
  const gameScores = scores[game.id] || [];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/games')}
          className="p-3 rounded-full neu-button text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold">{game.name}</h1>
          <p className="text-sm text-primary">{game.category}</p>
        </div>
        <div className="w-11" /> {/* Spacer */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Game Container */}
        <div className="lg:col-span-3 order-1">
          <div className="neu-card p-4 md:p-8 min-h-[500px] flex items-center justify-center relative bg-surface-secondary/50">
            <Suspense fallback={
              <div className="flex flex-col items-center text-primary">
                <Loader className="w-8 h-8 animate-spin mb-4" />
                <span className="font-bold">Loading Engine...</span>
              </div>
            }>
              {GameComponent ? <GameComponent title={game.name} /> : <div>Component Not Found</div>}
            </Suspense>
          </div>
        </div>

        {/* Sidebar Info & Leaderboard */}
        <div className="space-y-6 order-2 lg:order-2">

          <div className="neu-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-secondary" /> How to Play
            </h3>
            {game.instructions.length > 0 ? (
              <ul className="space-y-3">
                {game.instructions.map((inst, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-text-muted">
                    <span className="text-primary font-bold">{idx + 1}.</span> {inst}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">Instructions will be provided when the game is available.</p>
            )}

            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="text-xs text-text-muted mb-2 uppercase tracking-wider font-bold">Supported Inputs</div>
              <div className="flex gap-2">
                {game.supportedInputs.map(input => (
                  <div key={input} className="px-3 py-1 text-xs bg-surface-secondary rounded-full border border-white/5 capitalize flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3" /> {input}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="neu-card p-6">
            <h3 className="font-bold mb-4">Local Top Scores</h3>
            {gameScores.length > 0 ? (
              <div className="space-y-3">
                {gameScores.slice(0, 5).map((score, idx) => (
                  <div key={score.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-surface-secondary neu-inset">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-700' : 'text-text-muted'}`}>
                        #{idx + 1}
                      </span>
                      <span>{score.username}</span>
                    </div>
                    <span className="font-bold text-primary">{score.score}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-surface-secondary rounded-xl text-sm text-text-muted neu-inset">
                No scores yet. Be the first!
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
