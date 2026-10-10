import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  WORLD_SIZE,
  SNAKE_RADIUS,
  FOOD_RADIUS,
  createInitialState,
  advanceGame
} from './SnakeEngine';
import { Play, RotateCcw, Trophy } from 'lucide-react';

export default function SnakeUI({ onGameOver }) {
  const [gameState, setGameState] = useState(createInitialState());
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const inputRef = useRef({ targetAngle: 0, isBoosting: false });

  // Handle Input (Mouse & Touch) relative to screen center
  const updateInputAngle = useCallback((clientX, clientY) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    // Only update if moved outside a small deadzone
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      inputRef.current.targetAngle = Math.atan2(dy, dx);
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    updateInputAngle(e.clientX, e.clientY);
  }, [updateInputAngle]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 0) {
      updateInputAngle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [updateInputAngle]);

  const handlePointerDown = useCallback((e) => {
    inputRef.current.isBoosting = true;
    updateInputAngle(e.clientX, e.clientY);
  }, [updateInputAngle]);

  const handlePointerUp = useCallback(() => {
    inputRef.current.isBoosting = false;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') inputRef.current.isBoosting = true;
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') inputRef.current.isBoosting = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Game Loop
  const gameLoop = useCallback((timestamp) => {
    setGameState(prevState => {
      if (prevState.status !== 'playing') return prevState;

      // Inject current input before advancing
      const stateWithInput = { ...prevState };
      stateWithInput.player.targetAngle = inputRef.current.targetAngle;
      stateWithInput.player.isBoosting = inputRef.current.isBoosting;

      const nextState = advanceGame(stateWithInput, timestamp);

      if (nextState.status === 'gameover' && prevState.status === 'playing') {
        if (onGameOver) onGameOver(nextState.score);
      }

      return nextState;
    });

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [onGameOver]);

  useEffect(() => {
    if (gameState.status === 'playing') {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState.status, gameLoop]);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = '#111318';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState.status === 'idle') return; // Don't draw if not playing

    const playerHead = gameState.player.body[0];
    const viewWidth = canvas.width;
    const viewHeight = canvas.height;

    // Camera Transform (center on player)
    ctx.save();
    const camX = playerHead.x - viewWidth / 2;
    const camY = playerHead.y - viewHeight / 2;
    ctx.translate(-camX, -camY);

    // Draw Grid (relative to world)
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    const gridSize = 100;
    const startX = Math.floor(camX / gridSize) * gridSize;
    const startY = Math.floor(camY / gridSize) * gridSize;

    for (let x = startX; x < camX + viewWidth; x += gridSize) {
      if (x >= 0 && x <= WORLD_SIZE) {
        ctx.beginPath(); ctx.moveTo(x, Math.max(0, camY)); ctx.lineTo(x, Math.min(WORLD_SIZE, camY + viewHeight)); ctx.stroke();
      }
    }
    for (let y = startY; y < camY + viewHeight; y += gridSize) {
      if (y >= 0 && y <= WORLD_SIZE) {
        ctx.beginPath(); ctx.moveTo(Math.max(0, camX), y); ctx.lineTo(Math.min(WORLD_SIZE, camX + viewWidth), y); ctx.stroke();
      }
    }

    // Draw World Bounds
    ctx.strokeStyle = '#FF5757';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, WORLD_SIZE, WORLD_SIZE);

    // Draw Food
    gameState.food.forEach(f => {
      // Only draw if on screen
      if (f.x > camX - 20 && f.x < camX + viewWidth + 20 && f.y > camY - 20 && f.y < camY + viewHeight + 20) {
        ctx.fillStyle = f.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, FOOD_RADIUS + f.value, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Draw Snakes
    const allSnakes = [gameState.player, ...gameState.bots].filter(s => !s.isDead);

    // Draw bodies from tail to head
    allSnakes.forEach(snake => {
      for (let i = snake.body.length - 1; i >= 0; i--) {
        const segment = snake.body[i];

        // Skip if way off screen
        if (segment.x < camX - 50 || segment.x > camX + viewWidth + 50 ||
            segment.y < camY - 50 || segment.y > camY + viewHeight + 50) continue;

        ctx.fillStyle = snake.color;

        // Make body slightly darker than head, and fade towards tail
        ctx.globalAlpha = 1 - (i / snake.body.length) * 0.5;

        ctx.beginPath();
        const radius = i === 0 ? SNAKE_RADIUS * 1.2 : SNAKE_RADIUS * (1 - (i / snake.body.length) * 0.3);
        ctx.arc(segment.x, segment.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Draw eyes on head
        if (i === 0) {
          ctx.fillStyle = '#111318';
          const eyeDist = radius * 0.5;
          const eyeAngle1 = snake.angle + Math.PI / 4;
          const eyeAngle2 = snake.angle - Math.PI / 4;

          ctx.beginPath(); ctx.arc(segment.x + Math.cos(eyeAngle1)*eyeDist, segment.y + Math.sin(eyeAngle1)*eyeDist, 2, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(segment.x + Math.cos(eyeAngle2)*eyeDist, segment.y + Math.sin(eyeAngle2)*eyeDist, 2, 0, Math.PI*2); ctx.fill();
        }
      }
    });

    ctx.restore();

  }, [gameState]);

  const startGame = () => {
    const initialState = createInitialState();
    initialState.status = 'playing';
    initialState.lastTime = performance.now();
    inputRef.current = { targetAngle: 0, isBoosting: false };
    setGameState(initialState);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto touch-none select-none">
      <div className="w-full flex justify-between items-center mb-4 p-4 neu-card">
        <div className="font-bold text-xl flex items-center gap-2">
          <Trophy className="text-secondary w-6 h-6" />
          <span>{gameState.score}</span>
        </div>
        <div className="text-text-muted text-sm uppercase tracking-widest font-bold hidden sm:block">
          Neon Snake IO
        </div>
        <div className="text-sm font-bold text-primary">
          Rank: {gameState.status === 'playing' ?
            [gameState.player, ...gameState.bots].filter(s => !s.isDead).sort((a,b) => b.score - a.score).findIndex(s => s.isPlayer) + 1
            : '-'} / {[gameState.player, ...gameState.bots].filter(s => !s.isDead).length}
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-video min-h-[400px] md:min-h-[600px] neu-card bg-surface-secondary overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full object-cover"
        />

        {gameState.status === 'idle' && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center flex-col z-10">
            <h3 className="text-3xl font-bold mb-6 text-gradient">Neon Snake.io</h3>
            <p className="text-text-muted mb-8 text-center max-w-sm">Move cursor/finger to steer. Click/Tap/Space to boost (uses mass). Destroy other snakes!</p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-3 rounded-full neu-button text-primary font-bold text-lg"
            >
              <Play className="w-5 h-5 fill-current" /> Play Now
            </button>
          </div>
        )}

        {gameState.status === 'gameover' && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center flex-col p-6 text-center z-10">
            <h3 className="text-4xl font-bold mb-2 text-gradient">Wasted</h3>
            <p className="text-2xl mb-8">Final Mass: <span className="font-bold text-secondary">{gameState.score}</span></p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-3 rounded-full neu-button text-primary font-bold text-lg"
            >
              <RotateCcw className="w-5 h-5" /> Play Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-text-muted text-sm flex gap-4 justify-center">
        <span className="hidden md:inline">🖱️ Mouse: Steer</span>
        <span className="hidden md:inline">🖱️ Click / Spacebar: Boost</span>
        <span className="md:hidden">👆 Touch & Drag: Steer</span>
        <span className="md:hidden">👆 Tap: Boost</span>
      </div>
    </div>
  );
}
