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

    const messages = [
      "🔥 Hey, how are you?",
      "🚀 Automated message sent!",
      "💬 Bot is active.",
      "✨ Just checking in...",
      "🕹️ From your friendly bot.",
      "💡 Remember to smile today!",
      "⚡ This is a test message.",
      "✅ Automated Facebook bot message.",
      "🎯 Sending messages on loop!",
      "📢 Hope you're doing well!"
    ];

    setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      api.sendMessage({
        'body': randomMessage,
        'mentions': [] // same field as before, kept untouched
      }, targetID, () => {
        console.log(`\x1b[32m[+] Message sent successfully at ${new Date().toLocaleTimeString()}.`);
        console.log(`\x1b[32m[✓]HAN CHALA GYA...`);
        console.log(`\x1b[32m[+]CONVERSATION ID ${targetID}`);
      });
    }, timer * 0x3e8); // original timer formula kept
  });

  res.send('✅ Message sending started. Please check your chat!');
});

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});
