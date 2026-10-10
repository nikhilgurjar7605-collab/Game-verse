import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Coins, Sparkles, Check } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

const SHOP_ITEMS = [
  { id: 'avatar_neon', name: 'Neon Avatar Frame', description: 'Make your profile pop.', price: 500, type: 'cosmetic' },
  { id: 'color_pink', name: 'Pink UI Theme', description: 'Change your primary accent.', price: 1000, type: 'theme' },
  { id: 'badge_vip', name: 'VIP Badge', description: 'Show everyone you mean business.', price: 2500, type: 'badge' },
  { id: 'snake_skin_gold', name: 'Golden Snake Skin', description: 'A shiny skin for Neon Snake.', price: 5000, type: 'game_item' },
];

export default function Shop() {
  const { user: demoUser, purchaseItem: demoPurchase } = useDemo();
  const { isDemoMode } = useAuth();
  const [message, setMessage] = useState('');
  const [loadingItemId, setLoadingItemId] = useState(null);

  const user = demoUser; // In a full implementation, merge this with AuthContext user data

  const handlePurchase = async (item) => {
    if (user.inventory.includes(item.id)) {
      setMessage(`You already own ${item.name}.`);
      return;
    }

    if (isDemoMode) {
      if (demoPurchase(item)) {
        setMessage(`Successfully purchased ${item.name}!`);
      } else {
        setMessage('Not enough coins.');
      }
    } else {
      setLoadingItemId(item.id);
      try {
        const buyItem = httpsCallable(functions, 'buyItem');
        await buyItem({
          itemId: item.id,
          price: item.price,
          transactionId: `${user.uid}_${item.id}_${Date.now()}`
        });
        setMessage(`Successfully purchased ${item.name}!`);
        // Note: Real state sync would happen via Firestore snapshot listeners here
      } catch (error) {
        setMessage(error.message || 'Transaction failed.');
      } finally {
        setLoadingItemId(null);
      }
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-secondary" /> Item Shop
          </h1>
          <p className="text-text-muted mt-2">Spend your hard-earned coins on cosmetics and upgrades.</p>
        </div>

        <div className="flex items-center gap-2 px-6 py-3 rounded-full neu-inset bg-surface-secondary text-lg">
          <span className="text-text-muted">Balance:</span>
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-yellow-500">{user.balance}</span>
        </div>
      </div>

      {message && (
        <div className="p-4 mb-6 rounded-xl bg-surface-secondary border border-white/10 text-center font-bold text-primary animate-pulse">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SHOP_ITEMS.map(item => {
          const isOwned = user.inventory.includes(item.id);
          const canAfford = user.balance >= item.price;
          const isPurchasing = loadingItemId === item.id;

          return (
            <div key={item.id} className="neu-card p-6 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-2xl bg-surface-secondary flex items-center justify-center mb-6 neu-inset relative">
                <Sparkles className={`w-10 h-10 ${isOwned ? 'text-text-muted' : 'text-primary'}`} />
                {isOwned && (
                  <div className="absolute -top-2 -right-2 bg-secondary text-background rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>

              <h3 className="font-bold text-lg mb-2">{item.name}</h3>
              <p className="text-sm text-text-muted mb-6 flex-1">{item.description}</p>

              <button
                onClick={() => handlePurchase(item)}
                disabled={isOwned || (!isOwned && !canAfford) || isPurchasing}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isOwned
                    ? 'bg-surface-secondary text-text-muted cursor-not-allowed'
                    : canAfford
                      ? 'neu-button text-yellow-500 hover:text-yellow-400'
                      : 'bg-surface-secondary text-text-muted/50 cursor-not-allowed'
                }`}
              >
                {isPurchasing ? 'Processing...' : isOwned ? 'Owned' : (
                  <>
                    <Coins className="w-4 h-4" /> {item.price}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
