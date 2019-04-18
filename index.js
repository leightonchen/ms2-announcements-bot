const Discord = require('discord.js');
const crawl = require('./crawler/crawler');
const { token, channel } = require('./config');

const client = new Discord.Client();

client.on('error', console.error);

(async () => {
  await client.login(token);
  setInterval(() => {
    crawl(client, channel);
  }, 60000 * 30);
})();
