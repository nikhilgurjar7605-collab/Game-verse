import React from 'react';
import { Construction } from 'lucide-react';

export default function PlaceholderGame({ title }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 neu-card max-w-2xl mx-auto mt-8">
      <div className="w-24 h-24 rounded-full bg-surface-secondary flex items-center justify-center mb-6 neu-inset">
        <Construction className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-gradient mb-4">{title || 'Game Under Construction'}</h2>
      <p className="text-text-muted text-center max-w-md">
        This game module is currently a placeholder. The core game registry and routing infrastructure are ready, but the game logic is yet to be implemented.
      </p>
      <div className="mt-8 flex gap-4">
        <div className="px-4 py-2 bg-surface-secondary rounded-lg border border-white/5 text-sm">
          Coming Soon
        </div>
      </div>
    </div>
  );
}
