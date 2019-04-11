const Discord = require('discord.js');
const MS2News = require('../models/ms2news');

const insertIfNotExists = async (item, channels) => {
  return MS2News.find({ title: item.title }).exec()
    .then(async (docs) => {
      if (!docs.length) {
        await MS2News.create(item);
        return true;
      }
      return false;
    })
    .then(async (sendMsg) => {
      if (sendMsg) {
        const msg = new Discord.RichEmbed()
          .setTitle(item.title)
          .setDescription(item.description)
          .setImage(item.image)
          .setColor('#1DA1F2')
          .addField('To read the full news click here:', item.fullUrl);
        channels.forEach(channel => channel.send(msg));
      }
    })
    .catch(error => console.log(error));
};

module.exports = insertIfNotExists;
