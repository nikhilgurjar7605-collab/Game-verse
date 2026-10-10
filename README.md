# Nexus Gaming Ecosystem

A unified gaming ecosystem consisting of a responsive React web platform and a Telegram Mini App companion bot. Built with Vite, React, Firebase, and Telegraf.

## Product Overview
Nexus provides a seamless cross-platform gaming experience. Users can access the platform via the web or through the Telegram Mini App environment. Progress, inventory, and leaderboards are synchronized across both interfaces.

## Features
*   **Multi-Game Architecture**: A registry-based system currently featuring "Neon Snake" and three placeholder slots ready for expansion.
*   **Responsive UI**: Custom CSS Design System using Neumorphism and Mirror Glassmorphism.
*   **Telegram Integration**: Seamless login and account linking via Telegram Web Apps SDK.
*   **Unified Progression**: Shared XP, level, inventory, and coins managed via a secure backend.
*   **Local Demo Mode**: Out-of-the-box local development state management without requiring Firebase credentials.

## Architecture

### Frontend (React + Vite)
*   React Router for navigation.
*   Tailwind CSS + Custom CSS Variables for the design system.
*   `DemoContext` for local state (mocking the backend when not connected to Firebase).
*   `GameRegistry` for dynamically loading game modules.

### Backend (Firebase Functions)
*   **Telegraf**: Handles the Telegram Bot webhook `/webhook` and commands (`/start`, `/games`, etc.).
*   **Economy API**: Idempotent Cloud Functions for score validation, granting XP, and purchasing items.
*   **Auth API**: Server-side HMAC SHA-256 validation of Telegram `initData` ensuring secure account linking.

## Local Development (Demo Mode)

The frontend runs locally in "Demo Mode" without needing real Firebase credentials.

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
3.  Open `http://localhost:5173`.

## Setup & Deployment

### 1. Firebase Setup
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable Firestore and Authentication.
3. Deploy Firestore Security Rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 2. Telegram Bot Creation
1. Message `@BotFather` on Telegram.
2. Send `/newbot` and follow the instructions to get a `BOT_TOKEN`.
3. Use `/setmenubutton` and `/newapp` in BotFather to configure the Mini App URL (once deployed).

### 3. Backend Deployment
1. Navigate to the `functions` directory: `cd functions`
2. Install dependencies: `npm install`
3. Set environment variables in Firebase:
   ```bash
   firebase functions:config:set telegram.token="YOUR_BOT_TOKEN" telegram.webhook_secret="RANDOM_SECRET" platform.url="YOUR_FRONTEND_URL"
   ```
4. Deploy functions:
   ```bash
   firebase deploy --only functions
   ```

### 4. Webhook Registration
Once your functions are deployed, you MUST register the webhook with Telegram.
Make an HTTP GET request to:
`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_FUNCTION_URL>/telegramWebhook&secret_token=<YOUR_RANDOM_SECRET>`

*Never store your Bot Token in the frontend repository or public configuration.*

## Security and Privacy
*   **No Bot Token in Frontend**: The Telegram bot token is strictly maintained within the Firebase Functions environment.
*   **Server-Side Validation**: All `initData` payloads from the Telegram Mini App are validated on the server using HMAC SHA-256 before granting authentication or linking accounts.
*   **Least-Privilege Firestore Rules**: Clients cannot directly write to sensitive fields like `balance`, `xp`, or `inventory`. They must use the provided Cloud Functions.
*   **Idempotency**: Economy transactions utilize Firestore transactions to prevent race conditions and duplicate purchases.

## Adding New Games
1. Create a new folder in `src/games/your-game-name`.
2. Implement your game logic, ensuring it calls `submitScore(gameId, score)` upon game over.
3. Add the game's metadata to `src/games/core/GameRegistry.js`.
