const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Telegraf } = require('telegraf');
const express = require('express');
const { setupBot } = require('./botHandlers');
const { validateTelegramWebAppData } = require('./auth');
const { validateScore, purchaseItem } = require('./economy');

admin.initializeApp();

// Load environment variables / secrets
const BOT_TOKEN = process.env.BOT_TOKEN || functions.config().telegram?.token || 'DEMO_TOKEN';
const WEBAPP_URL = process.env.WEBAPP_URL || functions.config().platform?.url || 'https://demo-platform.app';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || functions.config().telegram?.webhook_secret || 'DEMO_SECRET';

// Initialize Bot
const bot = new Telegraf(BOT_TOKEN);
setupBot(bot, WEBAPP_URL);

// --- Telegram Webhook Function ---
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  // Verify webhook secret token (Telegram feature)
  const secretToken = req.header('X-Telegram-Bot-Api-Secret-Token');
  if (secretToken !== WEBHOOK_SECRET && BOT_TOKEN !== 'DEMO_TOKEN') {
    console.warn("Unauthorized webhook access attempt");
    return res.status(401).send('Unauthorized');
  }

  // Pass update to Telegraf
  bot.handleUpdate(req.body, res);
});

// Expose webhook as Firebase Function
exports.telegramWebhook = functions.https.onRequest(app);

// --- API Endpoints ---

/**
 * Validates Telegram Init Data and returns a session token or user data.
 */
exports.verifyTelegramAuth = functions.https.onCall(async (data, context) => {
  const { initData } = data;

  if (!initData) {
    throw new functions.https.HttpsError('invalid-argument', 'initData is required');
  }

  const userData = validateTelegramWebAppData(initData, BOT_TOKEN);

  if (!userData) {
    throw new functions.https.HttpsError('unauthenticated', 'Invalid Telegram authentication data');
  }

  // Here you would link the Telegram ID to a Firebase Auth UID
  // and return a Custom Token for the client to signInWithCustomToken()

  return {
    success: true,
    telegramId: userData.id,
    username: userData.username
  };
});

/**
 * Submits a score securely.
 */
exports.submitScore = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { gameId, score, validationPayload } = data;

  if (!validateScore(gameId, score, validationPayload)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid score payload');
  }

  const db = admin.firestore();

  // Save score
  await db.collection('scores').add({
    userId: context.auth.uid,
    gameId,
    score,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true };
});

/**
 * Buy an item securely using a transaction.
 */
exports.buyItem = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { itemId, price, transactionId } = data;

  const result = await purchaseItem(context.auth.uid, itemId, price, transactionId);

  if (!result.success) {
    throw new functions.https.HttpsError('failed-precondition', result.error);
  }

  return result;
});
