const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileupload');
const login = require('facebook-chat-api');

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/templates/index.html');
});

app.post('/sendMessages', (req, res) => {
  const { targetUID, delay, hatersname } = req.body;
  const appStateRaw = req.body.appState;

  // AppState validate
  let appState;
  try {
    appState = JSON.parse(appStateRaw);
  } catch (err) {
    return res.send("❌ Invalid AppState JSON.");
  }

  // Message file check
  if (!req.files || !req.files.messageFile) {
    return res.send("❌ No message file uploaded.");
  }

  const messageData = req.files.messageFile.data.toString().split('\n').map(line => line.trim()).filter(Boolean);

  login({ appState }, (err, api) => {
    if (err) {
      console.error(err);
      return res.send("❌ Facebook login failed.");
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index >= messageData.length) {
        clearInterval(interval);
        console.log("✅ All messages sent.");
        return;
      }

      const finalMsg = `${hatersname} ${messageData[index]}`;
      api.sendMessage(finalMsg, targetUID, (err) => {
        if (err) {
          console.log(`❌ Failed to send message ${index + 1}:`, err);
        } else {
          console.log(`✅ Sent: ${finalMsg}`);
        }
      });

      index++;
    }, parseInt(delay) * 1000);

    res.send("✅ Message sending started in background.");
  });
});

app.listen(3002, () => {
  console.log('🚀 Server running on http://localhost:3002');
});
