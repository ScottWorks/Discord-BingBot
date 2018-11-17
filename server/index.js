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
    // Extract search query
    var query = mention
      .replace('@BingBot', '')
      .toLowerCase()
      .trim();

    // Make a request to Bing API
    https.get(
      {
        hostname: 'api.cognitive.microsoft.com',
        path:
          '/bing/v7.0/search?responseFilter=Webpages&count=5&safeSearch=Strict&q=' +
          encodeURIComponent(`${query}`),
        headers: { 'Ocp-Apim-Subscription-Key': AZURE_SUBSCRIPTION_KEY }
      },
      (res) => {
        let body = '';

        // Assemble response body
        res.on('data', (part) => (body += part));
        res.on('end', () => {
          try {
            // Parse body of Bing API reply
            const parsedBody = JSON.parse(body).webPages.value;

            // Attatch links to discord reply
            return parsedBody
              .reverse()
              .forEach((searchResult) => msg.reply(searchResult.url));
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

    // Return if @BingBot is not mentioned
  } else {
    return;
  }
});

client.login(DISCORD_BOT_SECRET);

https
  .createServer((req, res) => {
    res.end();
  })
  .listen(PORT, () => console.log(`Still tippin on Port ${PORT}`));
