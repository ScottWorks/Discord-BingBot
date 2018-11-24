require('dotenv').config();
const https = require('https');
const Discord = require('discord.js');

const client = new Discord.Client();

const { AZURE_SUBSCRIPTION_KEY, DISCORD_BOT_SECRET, PORT } = process.env;

client.on('ready', () => {
  console.log(`Initialization Complete...`);
});

client.on('message', (msg) => {
  const mention = msg.cleanContent;

  // Check if mention of 'BingBot' is in message
  if (mention.includes('@BingBot')) {
    // Parse-out message and mention
    var parsedMessage = mention
      .replace('@BingBot', '')
      .toLowerCase()
      .trim();

    var query, endpointOptions;

    // Check if '-help' is in parsedMessage
    if (parsedMessage.includes('-help')) {
      // Send help menu in response
      return msg.reply(
        '```\n Commands: \n -help \n -search \n -videos \n -images \n -news```'
      );
    }

    // Switch logic that checks if '-search, - video, -images, or news' is in parsedMessage
    else if (parsedMessage.includes('-search')) {
      endpointOptions = 'search?responseFilter=WebPages&';
      query = parsedMessage.replace('-search', '').trim();
    } else if (parsedMessage.includes('-videos')) {
      endpointOptions = 'videos/search?';
      query = parsedMessage.replace('-videos', '').trim();
    } else if (parsedMessage.includes('-images')) {
      endpointOptions = 'images/search?';
      query = parsedMessage.replace('-images', '').trim();
    } else if (parsedMessage.includes('-news')) {
      endpointOptions = 'news/search?';
      query = parsedMessage.replace('-news', '').trim();
    } else return;

    // Make a request to Bing API
    https.get(
      {
        hostname: 'api.cognitive.microsoft.com',
        path:
          `/bing/v7.0/${endpointOptions}count=5&safeSearch=Strict&q=` +
          encodeURIComponent(`${query}`),
        headers: { 'Ocp-Apim-Subscription-Key': AZURE_SUBSCRIPTION_KEY }
      },
      (res) => {
        let body = '';

        // Assemble response body
        res.on('data', (part) => (body += part));
        res.on('end', () => {
          try {
            var parsedBody;

            // Parse body of Bing API reply
            JSON.parse(body).webPages
              ? (parsedBody = JSON.parse(body).webPages.value)
              : (parsedBody = JSON.parse(body).value);

            // Attatch links to discord reply
            return parsedBody.reverse().forEach((searchResult) => {
              console.log(searchResult);
              return searchResult.url
                ? msg.reply(searchResult.url)
                : msg.reply(searchResult.contentUrl);
            });
          } catch (err) {
            // Handle empty response
            console.log(err.message);
            return msg.reply(
              'Sorry, I could not Bing that request. Try again...'
            );
          }
        });

        // Handle errors from Bing API
        res.on('error', (err) => {
          console.log('Error: ' + err.message);
          throw e;
        });
      }
    );
  }
});

client.login(DISCORD_BOT_SECRET);

https
  .createServer((req, res) => {
    res.end();
  })
  .listen(PORT, () => console.log(`Still tippin on Port ${PORT}`));
