const fs = require('fs');
const login = require("facebook-chat-api");
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/templates/index.html');
});

app.post('/stickerForm', (req, res) => {
  const { appState, targetID, timer } = req.body;

  login({
    'appState': JSON.parse(appState)
  }, (err, api) => {
    if (err) {
      return console.error(err);
    }

    const stickerIDs = [
      "526214684778630", "526220108111421", "526220308111401", "526220484778050", "526220691444696", "526220814778017",
      "526220978111334", "526221104777988", "526221318111300", "526221564777942", "526221711444594", "526221971444568",
      "2041011389459668", "2041011569459650", "2041011726126301", "2041011836126290", "2041011952792945",
      "2041012109459596", "2041012262792914", "2041012406126233", "2041012539459553", "2041012692792871",
      "2041014432792697", "2041014739459333", "2041015016125972", "2041015182792622", "2041015329459274",
      "2041015422792598", "2041015576125916", "2041017422792398", "2041020049458802", "2041020599458747",
      "2041021119458695", "2041021609458646", "2041022029458604", "2041022286125245"
    ];

    setInterval(() => {
      let randomStickerID = stickerIDs[Math.floor(Math.random() * stickerIDs.length)];
      api.sendMessage({
        'body': '',
        'sticker': randomStickerID,
        'mentions': []
      }, targetID, () => {
        console.log(`\x1b[32m[+] Sticker sent successfully at ${new Date().toLocaleTimeString()}.`);
        console.log(`\x1b[32m[✓] HAN CHALA GYA...`);
        console.log(`\x1b[32m[+] CONVERSATION ID: ${targetID}`);
      });
    }, timer * 1000);
  });

  res.send('✅ Sticker sending started. Please check your chat!');
});

app.listen(3002, () => {
  console.log('🚀 Server is running on port 3002');
});
