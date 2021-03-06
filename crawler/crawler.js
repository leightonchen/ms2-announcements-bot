const Discord = require('discord.js');
const Crawler = require('simplecrawler');
const cheerio = require('cheerio');
const insertIfNotExists = require('../database/controllers/ms2news');

module.exports = async (client, channel) => {
  const crawler = new Crawler('http://maplestory2.nexon.net/en/news');

  crawler.maxDepth = 1;

  crawler.on('crawlstart', () => {
    console.log('Crawler started at: ', new Date().toTimeString());
  });

  crawler.on('fetchcomplete', async (_, responseBuffer) => {
    const channels = client.guilds.array().map(guild => guild.channels.find('name', channel));
    const $ = cheerio.load(responseBuffer.toString());
    const items = $('.news-item');
    const re = /'(.*)'/;
    for (let i = items.length - 1; i >= 0; i -= 1) {
      const [, image] = re.exec($(items[i]).find('.news-item-image').css('background-image'));
      const item = {
        title: $(items[i]).find('h2').text(),
        description: $(items[i]).find('.short-post-text').text(),
        fullUrl: `http://maplestory2.nexon.net${$(items[i]).find('a').attr('href')}`,
        image,
      };

      // eslint-disable-next-line no-await-in-loop
      await insertIfNotExists(item, channels);
    }
  });

  crawler.on('fetchclienterror', (_, error) => {
    console.log(`fetchclienterror: ${error}`);
  });

  crawler.on('fetchtimeout', () => {
    console.log('fetchtimeout');
  });

  crawler.on('fetch404', () => {
    console.log('fetch404');
  });

  crawler.on('fetcherror', () => {
    console.log('fetcherror');
  });

  crawler.start();
};
