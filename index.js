const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/webhook', (req, res) => {
  res.send(req.query['hub.challenge']);
});

app.post('/webhook', async (req, res) => {
  const userMessage = req.body;
  if (userMessage) {
    return res.sendStatus(200);
  }
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

