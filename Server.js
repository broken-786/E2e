const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileupload');
const fetch = require('node-fetch');
const login = require('facebook-chat-api');

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/templates/index.html');
});

app.post('/sendMessages', async (req, res) => {
  const { password, targetUID, delay, hatersname } = req.body;
  const appStateRaw = req.body.appState;

  // Step 1: Password check
  const passCheck = await fetch('https://pastebin.com/raw/e88veVa6').then(r => r.text());
  if (passCheck.trim() !== password) {
    return res.send("❌ Incorrect Password");
  }

  // Step 2: Validate appState
  let appState;
  try {
    appState = JSON.parse(appStateRaw);
  } catch (err) {
    return res.send("❌ Invalid AppState JSON.");
  }

  // Step 3: Validate file
  if (!req.files || !req.files.messageFile) {
    return res.send("❌ No message file uploaded.");
  }

  const messageData = req.files.messageFile.data.toString().split('\n').map(line => line.trim()).filter(Boolean);

  // Step 4: Login
  login({ appState }, (err, api) => {
    if (err) {
      console.error(err);
      return res.send("❌ Facebook login failed.");
    }

    // Step 5: Message Sending Loop
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
