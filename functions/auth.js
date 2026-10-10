const crypto = require('crypto');

/**
 * Validates Telegram Mini App initialization data securely on the server.
 * Ensures the data is genuinely from Telegram and hasn't been tampered with.
 *
 * @param {string} initData - The raw initData string from the Telegram Mini App.
 * @param {string} botToken - The Telegram Bot Token.
 * @returns {object|null} - Returns the parsed user object if valid, otherwise null.
 */
function validateTelegramWebAppData(initData, botToken) {
  if (!initData || !botToken) return null;

  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    if (!hash) return null;

    urlParams.delete('hash');

    // Sort parameters alphabetically
    const keys = Array.from(urlParams.keys()).sort();
    const dataCheckString = keys.map(key => `${key}=${urlParams.get(key)}`).join('\n');

    // Create secret key
    const secretKey = crypto.createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate signature
    const calculatedHash = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      return null;
    }

    // Check expiration (e.g., must be within the last 24 hours)
    const authDate = parseInt(urlParams.get('auth_date'), 10);
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - authDate > 86400) {
      console.warn("Telegram auth data has expired.");
      return null;
    }

    const userJson = urlParams.get('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  } catch (error) {
    console.error("Error validating Telegram data:", error);
    return null;
  }
}

module.exports = {
  validateTelegramWebAppData
};
