/**
 * Server-side economy and progression logic.
 * Uses Firebase Admin SDK to interact with Firestore.
 * Implements idempotency to prevent duplicate transactions.
 */
const admin = require('firebase-admin');

/**
 * Validates a game score before saving it.
 * In a real scenario, this should include server-side simulation or crypto checks.
 */
function validateScore(gameId, score, validationPayload) {
  if (typeof score !== 'number' || score < 0) return false;
  if (!gameId) return false;

  // Example basic check: prevent absurdly high scores
  if (score > 1000000) {
    console.warn(`Suspicious score detected: ${score} for game ${gameId}`);
    return false;
  }

  return true;
}

/**
 * Safely adds XP and recalculates level.
 * @param {admin.firestore.Transaction} transaction
 * @param {admin.firestore.DocumentReference} userRef
 * @param {number} xpToAdd
 */
async function addXPSafely(transaction, userRef, xpToAdd) {
  const userDoc = await transaction.get(userRef);
  if (!userDoc.exists) throw new Error("User not found");

  const currentXP = userDoc.data().xp || 0;
  const newXP = currentXP + xpToAdd;
  const newLevel = Math.floor(newXP / 1000) + 1;

  transaction.update(userRef, { xp: newXP, level: newLevel });
  return { newXP, newLevel };
}

/**
 * Purchases an item for a user, using a transaction to prevent race conditions.
 * @param {string} userId
 * @param {string} itemId
 * @param {number} price
 * @param {string} transactionId - Unique ID for idempotency
 */
async function purchaseItem(userId, itemId, price, transactionId) {
  const db = admin.firestore();
  const userRef = db.collection('users').doc(userId);
  const txRef = db.collection('transactions').doc(transactionId);

  try {
    const result = await db.runTransaction(async (transaction) => {
      // Idempotency check
      const txDoc = await transaction.get(txRef);
      if (txDoc.exists) {
        throw new Error("Transaction already processed");
      }

      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("User not found");
      }

      const userData = userDoc.data();
      const currentBalance = userData.balance || 0;
      const inventory = userData.inventory || [];

      if (inventory.includes(itemId)) {
        throw new Error("Item already owned");
      }

      if (currentBalance < price) {
        throw new Error("Insufficient funds");
      }

      // Record transaction
      transaction.set(txRef, {
        userId,
        itemId,
        amount: price,
        type: 'purchase',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      // Update user
      transaction.update(userRef, {
        balance: currentBalance - price,
        inventory: admin.firestore.FieldValue.arrayUnion(itemId)
      });

      return true;
    });
    return { success: true };
  } catch (error) {
    console.error("Purchase failed:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  validateScore,
  addXPSafely,
  purchaseItem
};
