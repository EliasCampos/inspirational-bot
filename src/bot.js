const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');

const bot = new TelegramBot(config.get("bot.token"), {
  webHook: {
    port: config.get("bot.port"),
    autoOpen: false
  }
});
bot.setWebHook(`${config.get("bot.url")}/bot${config.get("bot.token")}`);

module.exports = bot;
