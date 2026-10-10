/**
 * Handles Telegram bot commands using Telegraf.
 */

const setupBot = (bot, webAppUrl) => {
  // Configurable menu and descriptions
  bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot and open games' },
    { command: 'games', description: 'Discover available games' },
    { command: 'profile', description: 'View your gaming profile' },
    { command: 'leaderboard', description: 'View top scores' },
    { command: 'help', description: 'Get help and info' },
  ]);

  bot.command('start', (ctx) => {
    const welcomeMessage = `Welcome to the Nexus Gaming Ecosystem, *${ctx.from.first_name}*!\n\n` +
      `Play games, climb the leaderboards, and earn rewards directly in Telegram.`;

    ctx.replyWithMarkdown(welcomeMessage, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎮 Open Games', web_app: { url: webAppUrl } }],
          [{ text: '👤 My Profile', callback_data: 'view_profile' }, { text: '🏆 Leaderboard', callback_data: 'view_leaderboard' }]
        ]
      }
    });
  });

  bot.command('games', (ctx) => {
    ctx.reply('Check out our featured games!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🐍 Neon Snake', web_app: { url: `${webAppUrl}/games/snake-01` } }],
          [{ text: '🚀 View All Games', web_app: { url: `${webAppUrl}/games` } }]
        ]
      }
    });
  });

  bot.command('profile', (ctx) => {
    // In a real implementation, this would fetch from Firestore based on ctx.from.id
    ctx.reply(`*Your Profile*\n\nWelcome back! Open the Mini App to see your detailed stats, level, and inventory.`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'View Full Profile', web_app: { url: `${webAppUrl}/profile` } }]
        ]
      }
    });
  });

  bot.command('leaderboard', (ctx) => {
    ctx.reply('See who is dominating the charts!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'View Leaderboards', web_app: { url: `${webAppUrl}/leaderboard` } }]
        ]
      }
    });
  });

  bot.command('help', (ctx) => {
    const helpText = `*Help & Support*\n\n` +
      `• Use /start to launch the Mini App.\n` +
      `• Ensure your Telegram app is up to date to play games.\n` +
      `• Need support? Contact @support_placeholder.`;

    ctx.replyWithMarkdown(helpText);
  });

  // Handle callback queries
  bot.on('callback_query', (ctx) => {
    const data = ctx.callbackQuery.data;

    if (data === 'view_profile') {
      ctx.answerCbQuery();
      ctx.reply('Open the Mini App to view your full profile:', {
        reply_markup: { inline_keyboard: [[{ text: 'Open Profile', web_app: { url: `${webAppUrl}/profile` } }]] }
      });
    } else if (data === 'view_leaderboard') {
      ctx.answerCbQuery();
      ctx.reply('Open the Mini App to view the leaderboards:', {
        reply_markup: { inline_keyboard: [[{ text: 'Open Leaderboard', web_app: { url: `${webAppUrl}/leaderboard` } }]] }
      });
    } else {
      ctx.answerCbQuery('Unknown action');
    }
  });

  // Error handling
  bot.catch((err, ctx) => {
    console.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
    ctx.reply('Sorry, an error occurred. Please try again later.').catch(e => console.error("Could not send error message", e));
  });
};

module.exports = { setupBot };
