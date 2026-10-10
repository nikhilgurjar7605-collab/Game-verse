// Physics and Engine parameters
export const WORLD_SIZE = 2000;
export const BASE_SPEED = 200; // pixels per second
export const BOOST_MULTIPLIER = 1.8;
export const TURN_SPEED = Math.PI * 1.5; // radians per second
export const SNAKE_RADIUS = 10;
export const FOOD_RADIUS = 6;
export const MAX_FOOD = 150;
export const INITIAL_LENGTH = 20;
export const SEGMENT_SPACING = 5;

export const createInitialState = () => {
  const player = createSnake(WORLD_SIZE / 2, WORLD_SIZE / 2, 0, '#A78BFA', true);

  return {
    player,
    bots: [
      createSnake(WORLD_SIZE * 0.2, WORLD_SIZE * 0.2, Math.PI / 4, '#70E1F5', false),
      createSnake(WORLD_SIZE * 0.8, WORLD_SIZE * 0.8, Math.PI * 1.25, '#F57070', false),
      createSnake(WORLD_SIZE * 0.2, WORLD_SIZE * 0.8, -Math.PI / 4, '#F5E170', false),
      createSnake(WORLD_SIZE * 0.5, WORLD_SIZE * 0.2, Math.PI / 2, '#70F5A1', false),
    ],
    food: Array(MAX_FOOD).fill(0).map(() => generateRandomFood()),
    status: 'idle', // idle, playing, gameover
    score: 0,
    lastTime: 0
  };
};

function createSnake(x, y, angle, color, isPlayer) {
  const body = [];
  for (let i = 0; i < INITIAL_LENGTH; i++) {
    body.push({
      x: x - Math.cos(angle) * (i * SEGMENT_SPACING),
      y: y - Math.sin(angle) * (i * SEGMENT_SPACING)
    });
  }
  return {
    id: isPlayer ? 'player' : Math.random().toString(36).substr(2, 9),
    isPlayer,
    body, // head is body[0]
    angle,
    targetAngle: angle,
    speed: BASE_SPEED,
    isBoosting: false,
    color,
    isDead: false,
    score: 0,
    aiState: { timer: 0 } // Used by bots
  };
}

function generateRandomFood() {
  return {
    x: Math.random() * WORLD_SIZE,
    y: Math.random() * WORLD_SIZE,
    color: ['#FF5757', '#70E1F5', '#A78BFA', '#57FF8D', '#F5E170'][Math.floor(Math.random() * 5)],
    value: Math.floor(Math.random() * 3) + 1
  };
}

const distSq = (x1, y1, x2, y2) => (x2 - x1)**2 + (y2 - y1)**2;

export function advanceGame(state, timestamp) {
  if (state.status !== 'playing') return state;

  const dt = state.lastTime ? (timestamp - state.lastTime) / 1000 : 0.016;
  const clampedDt = Math.min(dt, 0.05);

  let { player, bots, food } = state;
  let allSnakes = [player, ...bots].filter(s => !s.isDead);

  // --- AI Bot Logic ---
  bots.filter(b => !b.isDead).forEach(bot => {
    bot.aiState.timer -= clampedDt;
    if (bot.aiState.timer <= 0) {
      // Find nearest food
      let nearestFood = null;
      let minDistSq = Infinity;
      const head = bot.body[0];

      for (const f of food) {
        const d = distSq(head.x, head.y, f.x, f.y);
        if (d < minDistSq) {
          minDistSq = d;
          nearestFood = f;
        }
      }

      if (nearestFood) {
        bot.targetAngle = Math.atan2(nearestFood.y - head.y, nearestFood.x - head.x);
      } else {
        // Wander randomly
        bot.targetAngle += (Math.random() - 0.5) * Math.PI;
      }
      bot.aiState.timer = 1.0 + Math.random(); // Think every 1-2 seconds
      bot.isBoosting = Math.random() < 0.1 && bot.score > 10; // Rarely boost
    }
  });

  // --- Move snakes ---
  allSnakes.forEach(snake => {
    let diff = snake.targetAngle - snake.angle;
    while (diff <= -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    const turnAmount = TURN_SPEED * clampedDt;
    if (Math.abs(diff) < turnAmount) {
      snake.angle = snake.targetAngle;
    } else {
      snake.angle += Math.sign(diff) * turnAmount;
    }

    const currentSpeed = snake.isBoosting ? snake.speed * BOOST_MULTIPLIER : snake.speed;
    const moveDist = currentSpeed * clampedDt;

    const head = snake.body[0];
    const newHead = {
      x: head.x + Math.cos(snake.angle) * moveDist,
      y: head.y + Math.sin(snake.angle) * moveDist
    };

    newHead.x = Math.max(0, Math.min(WORLD_SIZE, newHead.x));
    newHead.y = Math.max(0, Math.min(WORLD_SIZE, newHead.y));

    snake.body.unshift(newHead);

    const targetLength = INITIAL_LENGTH + Math.floor(snake.score / 5);
    while (snake.body.length > targetLength) {
      snake.body.pop();
    }

    if (snake.isBoosting && snake.score > 0 && Math.random() < 0.1) {
      snake.score -= 1;
      const tail = snake.body[snake.body.length - 1];
      food.push({ x: tail.x, y: tail.y, color: snake.color, value: 1 });
    }
  });

  // --- Collisions: Snake vs Food ---
  allSnakes.forEach(snake => {
    const head = snake.body[0];
    const eatDistSq = (SNAKE_RADIUS + FOOD_RADIUS)**2;

    food = food.filter(f => {
      if (distSq(head.x, head.y, f.x, f.y) < eatDistSq) {
        snake.score += f.value;
        return false; // Remove food
      }
      return true; // Keep food
    });
  });

  // --- Collisions: Snake vs Snake ---
  // A snake dies if its head hits ANY segment of ANOTHER snake
  const killDistSq = (SNAKE_RADIUS * 1.5)**2;

  allSnakes.forEach(snake1 => {
    const head = snake1.body[0];
    for (const snake2 of allSnakes) {
      if (snake1.id === snake2.id) continue;

      // Check collision against all body segments of snake2
      // Optimization: Skip the tail end if not near bounding box, but we'll do naive for now
      for (const segment of snake2.body) {
        if (distSq(head.x, head.y, segment.x, segment.y) < killDistSq) {
          snake1.isDead = true;
          break;
        }
      }
      if (snake1.isDead) break;
    }
  });

  // Handle dead snakes (turn into food)
  allSnakes.forEach(snake => {
    if (snake.isDead) {
      // Drop food for every few segments
      snake.body.forEach((segment, idx) => {
        if (idx % 2 === 0) {
          food.push({
            x: segment.x + (Math.random() - 0.5) * 20,
            y: segment.y + (Math.random() - 0.5) * 20,
            color: snake.color,
            value: 2
          });
        }
      });
    }
  });

  // Respawn missing bots & replenish food
  const liveBots = bots.filter(b => !b.isDead);
  while (liveBots.length < 4) {
    const newBot = createSnake(
      Math.random() * WORLD_SIZE,
      Math.random() * WORLD_SIZE,
      Math.random() * Math.PI * 2,
      ['#70E1F5', '#F57070', '#F5E170', '#70F5A1'][Math.floor(Math.random() * 4)],
      false
    );
    liveBots.push(newBot);
  }
  bots = liveBots;

  while (food.length < MAX_FOOD) {
    food.push(generateRandomFood());
  }

  // Update player status
  if (player.isDead) {
    return { ...state, status: 'gameover', score: player.score };
  }

  return {
    ...state,
    player: { ...player },
    bots,
    food,
    score: player.score,
    lastTime: timestamp
  };
}
