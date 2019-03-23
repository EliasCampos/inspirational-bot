const { MongoClient } = require('mongodb');
const connectClient = (url) => (new Promise((resolve, reject) => {
  MongoClient.connect(url, {useNewUrlParser:true},
    (err, client) => {
      if (err) reject(err);
      else {
        console.log("Connected to:", url);
        resolve(client);
      }
  });
}));

const extractCollection = collection => (new Promise((resolve, reject) => {
  collection.find({}).toArray((err, items) => {
    if (err) reject(err);
    else resolve(items);
  });
}));

module.exports = {
  connectClient,
  extractCollection
};
