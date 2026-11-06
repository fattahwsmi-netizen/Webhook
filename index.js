const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === 'vibecoding') {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post('/webhook', async (req, res) => {
  const userMessage = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
  
  if (!userMessage) {
    return res.findStatus(200);
  }

  try {
    const response = await fetch("https://dev.meta.ai/api/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.META_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    console.log("Meta Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error calling Meta API:", error);
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

