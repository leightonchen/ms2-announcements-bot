const Discord = require('discord.js');
const Crawler = require('simplecrawler');
const cheerio = require('cheerio');
const { token, channel } = require('./config.js');

const client = new Discord.Client();
const crawler = new Crawler('http://maplestory2.nexon.net/en/news');

crawler.maxDepth = 1;

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.channel.send('pong');
  }
});

crawler.on("fetchcomplete", (_, responseBuffer) => {
  const announcementChannel = client.channels.find('name', channel);
  let $ = cheerio.load(responseBuffer.toString());
  let items = $('.news-item');
  for (let i = 0; i < items.length; i++) {
    let re = /'(.*)'/;
    let [_, image] = re.exec($(items[i]).find('.news-item-image').css('background-image'));
    let item = {
      title: $(items[i]).find('h2').text(),
      description: $(items[i]).find('.short-post-text').text(),
      url: `http://maplestory2.nexon.net${$(items[i]).find('a').attr('href')}`,
      image,
    };

    let msg = new Discord.RichEmbed(item);
    msg.setImage(item.thumbnail);
    if (i === 0) announcementChannel.send(msg);
  }
});

(async () => {
  await client.login(token);
  crawler.start();
})();