const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const DATA_FILE = path.join(__dirname, 'reset.json');

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { resetTS: 0 };
  }
}

function writeData(obj) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

app.get('/reset', (req, res) => {
  const data = readData();
  res.json({ resetTS: data.resetTS || 0 });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Optional secret token header to protect reset. Set RESET_TOKEN env var to enable.
const RESET_TOKEN = process.env.RESET_TOKEN || '';

app.post('/reset', (req, res) => {
  if (RESET_TOKEN) {
    const t = req.get('x-reset-token') || req.body.token;
    if (!t || t !== RESET_TOKEN) {
      return res.status(401).json({ error: 'unauthorized' });
    }
  }

  const now = Date.now();
  writeData({ resetTS: now });
  res.json({ resetTS: now });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Space Shooter backend running on ${port}`));
