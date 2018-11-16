const https = require('https');
const Discord = require('discord.js');

const client = new Discord.Client();

const { AZURE_SUBSCRIPTION_KEY, DISCORD_BOT_SECRET, PORT } = process.env

client.on('ready', () => {
  console.log(`Login Completed`);
});

client.on('message', msg => {
  // Check if prefix '@searchbot' is in message
    // Remove prefix, trim query
    // Make a request to Bing API
    // Copy top 5 responses from response JSON

  // Attatch links to discord response
  // Done

if (msg.content === 'ping') {
  https.get({
      hostname: 'api.cognitive.microsoft.com',
      path:     '/bing/v7.0/search?responseFilter=Webpages&count=5&q=' + encodeURIComponent('Barack Obama'),
      headers:  { 'Ocp-Apim-Subscription-Key': AZURE_SUBSCRIPTION_KEY },
    }, res => {
      let body = ''
      res.on('data', part => body += part)
      res.on('end', () => {
        for (var header in res.headers) {
          if (header.startsWith("bingapis-") || header.startsWith("x-msedge-")) {
            console.log(header + ": " + res.headers[header])
          }
        }
        console.log('\nJSON Response:\n')
        console.dir(JSON.parse(body), { colors: false, depth: null })
      })
      res.on('error', e => {
        console.log('Error: ' + e.message)
        throw e
      })
    })
  }

  // if (msg.content === 'ping') {
  //   msg.reply('pong');
  // }
});

client.login(DISCORD_BOT_SECRET);

https.createServer((req, res) => {
  res.end()
}).listen(PORT, () => console.log(`Still tippin on Port ${PORT}`))
