const { getRandomItem } = require('../functions');
const keywords = require('../../keywords.json');

class BotHelper {
  /**
  Provides bunch of method for control bot behavior, based on incoming
  messages and presence one of supported command:
    "/inspire",
    "/motivate",
    "/encourage",
    "/tell <topic>"

  Constructor accepts telegram bot object, which works BASED ON WEBHOOKS,
  and object-table, prepared earlier, of key - value, where key is command-name,
  and value are dataset from correspond database collection.
  */
  constructor(bot, aidMaterial) {
    this.bot = bot;
    this.aidMaterial = aidMaterial;
  }

  prepareSpeech(topic) {
    if (!(topic in this.aidMaterial)) {
      return BotHelper.explain.unknown_command;
    }

    const item = getRandomItem(this.aidMaterial[topic]);
    let begin;
    if ("author" in item) {
      begin = getRandomItem(BotHelper.speechBegin.refer)
        .replace(BotHelper.AUTHOR, item.author);
    } else {
      begin = getRandomItem(BotHelper.speechBegin.self);
    }

    return (begin === null ? "" : begin + ", ") + item.text ;
  }

  handleMessage(message) {
    const {text, chat} = message;
    let command, param, response;
    const match = BotHelper.commandPattern.exec(text);
    if (match === null) { // If the message is not command
      response = BotHelper.explain.not_command;
    } else if ((command = match[1].trim()) === BotHelper.START) {
      response = BotHelper.explain.start;
    } else if (command === BotHelper.HELP) {
      response = BotHelper.explain.help;
    } else {
      response = this.prepareSpeech(command);
    }

    this.bot.sendMessage(chat.id, response);
  }

  run() {
    this.bot.on('message', this.handleMessage.bind(this));
    if (!this.bot.hasOpenWebHook()) this.bot.openWebHook();
  }
}
BotHelper.commandPattern = /^\s*\/([a-zA-Z]+)\s*(\w+)?\s*$/;
BotHelper.START = "start";
BotHelper.HELP = "help";
BotHelper.AUTHOR = "<author>";
BotHelper.speechBegin = keywords.bot_speech_begin;
BotHelper.explain = keywords.bot_explain;

module.exports = BotHelper;
