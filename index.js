const BotHelper = require('./src/classes/BotHelper.js');
const bot = require('./src/bot.js');
const config = require('./config');
const dbModel = require('./src/db');
const searchWords = require('./keywords.json');

// First let's connect to mongodb server:
dbModel.connectClient(config.get('mongo.url'))
  .then(client => { /* Now let's extract all required text resources,
transfer them to the bot, and then close connection with mongodb server */
    const db = client.db(config.get('mongo.db_name'));

    Promise.all(searchWords.collections
      .map(collectionName => db.collection(collectionName))
      .map(dbModel.extractCollection))
    .then(collections => {
      const material = Object.create(null);
      searchWords.collections.forEach((name, indx) => {
        commandName = searchWords.command_correspondence[name];
        material[commandName] = collections[indx];
      });
      const botHelper = new BotHelper(bot, material);
      botHelper.run();
    })
    .then(() => client.close())
    .catch(err => {throw err});
  });
