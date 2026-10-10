/**
 * GameRegistry maintains the catalog of available games on the platform.
 * It provides metadata for rendering game cards and routing.
 */
export const GameRegistry = [
  {
    id: 'snake-01',
    name: 'Neon Snake',
    description: 'Classic snake with a modern neon twist. Eat, grow, and avoid the walls!',
    category: 'Arcade',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80',
    version: '1.0.0',
    supportedInputs: ['keyboard', 'touch'],
    route: '/games/snake-01',
    path: '../snake/index.jsx',
    instructions: [
      'Use Arrow Keys or Swipe to move',
      'Eat the glowing food to grow',
      'Don\'t hit the walls or yourself'
    ],
    isPlaceholder: false
  },
  {
    id: 'asteroids-02',
    name: 'Asteroid Defender',
    description: 'Protect your ship from incoming space debris.',
    category: 'Action',
    thumbnail: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&q=80',
    version: '0.1.0',
    supportedInputs: ['keyboard', 'touch'],
    route: '/games/asteroids-02',
    path: '../placeholder-1/index.jsx',
    instructions: [],
    isPlaceholder: true
  },
  {
    id: 'memory-03',
    name: 'Cyber Match',
    description: 'Test your memory with this cyberpunk-themed card matching game.',
    category: 'Puzzle',
    thumbnail: 'https://images.unsplash.com/photo-1629857997577-3eeb295a639b?w=400&q=80',
    version: '0.1.0',
    supportedInputs: ['touch', 'mouse'],
    route: '/games/memory-03',
    path: '../placeholder-2/index.jsx',
    instructions: [],
    isPlaceholder: true
  },
  {
    id: 'jump-04',
    name: 'Neon Jumper',
    description: 'Jump endlessly through a neon cityscape.',
    category: 'Arcade',
    thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80',
    version: '0.1.0',
    supportedInputs: ['keyboard', 'touch'],
    route: '/games/jump-04',
    path: '../placeholder-3/index.jsx',
    instructions: [],
    isPlaceholder: true
  }
];

export const getGameById = (id) => GameRegistry.find(g => g.id === id);
export const getFeaturedGames = () => GameRegistry.slice(0, 2);
export const getRecentGames = () => GameRegistry.slice(0, 4);
