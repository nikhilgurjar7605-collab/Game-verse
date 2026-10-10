import React from 'react';
import SnakeUI from './SnakeUI';
import { useDemo } from '../../context/DemoContext';
import { useAuth } from '../../context/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase';

export default function NeonSnakeGame() {
  const { submitScore: demoSubmitScore } = useDemo();
  const { isDemoMode } = useAuth();

  const handleGameOver = async (score) => {
    if (score <= 0) return;

    if (isDemoMode) {
      demoSubmitScore('snake-01', score);
    } else {
      if (functions) {
        try {
          const submitScore = httpsCallable(functions, 'submitScore');
          await submitScore({
            gameId: 'snake-01',
            score: score,
            validationPayload: {} // Add anti-cheat hashing here in prod
          });
        } catch (error) {
          console.error("Failed to save score to cloud:", error);
          // Fallback to local
          demoSubmitScore('snake-01', score);
        }
      }
    }
  };

  return (
    <div className="w-full">
      <SnakeUI onGameOver={handleGameOver} />
    </div>
  );
}
