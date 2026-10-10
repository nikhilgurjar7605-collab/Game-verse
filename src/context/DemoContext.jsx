import React, { createContext, useContext, useState, useEffect } from 'react';

const DemoContext = createContext();

export const useDemo = () => useContext(DemoContext);

export const DemoProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(true);

  const [user, setUser] = useState({
    uid: 'demo-user-123',
    username: 'DemoPlayer',
    level: 5,
    xp: 1250,
    balance: 500,
    telegramLinked: false,
    inventory: [],
    achievements: ['first_login', 'played_snake'],
  });

  const [scores, setScores] = useState({
    'snake-01': [
      { id: '1', username: 'DemoPlayer', score: 150, date: new Date().toISOString() },
      { id: '2', username: 'ProGamer', score: 320, date: new Date().toISOString() },
    ]
  });

  // Mock server operations
  const grantXP = (amount) => {
    setUser(prev => ({
      ...prev,
      xp: prev.xp + amount,
      level: Math.floor((prev.xp + amount) / 1000) + 1
    }));
  };

  const updateBalance = (amount) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));
  };

  const submitScore = (gameId, score) => {
    setScores(prev => {
      const gameScores = prev[gameId] || [];
      const newScore = {
        id: Date.now().toString(),
        username: user.username,
        score,
        date: new Date().toISOString()
      };

      const updatedScores = [...gameScores, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Keep top 10

      return {
        ...prev,
        [gameId]: updatedScores
      };
    });

    // Grant some XP and coins for playing
    grantXP(Math.floor(score / 10));
    updateBalance(Math.floor(score / 20));
  };

  const purchaseItem = (item) => {
    if (user.balance >= item.price) {
      setUser(prev => ({
        ...prev,
        balance: prev.balance - item.price,
        inventory: [...prev.inventory, item.id]
      }));
      return true;
    }
    return false;
  };

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      setIsDemoMode,
      user,
      scores,
      grantXP,
      updateBalance,
      submitScore,
      purchaseItem
    }}>
      {children}
    </DemoContext.Provider>
  );
};
