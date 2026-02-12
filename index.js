const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());

// Explicit CORS configuration for maximum compatibility
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-reset-token']
}));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const DATA_FILE = path.join(__dirname, 'reset.json');
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

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

function readLeaderboard() {
  try {
    const raw = fs.readFileSync(LEADERBOARD_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeLeaderboard(data) {
  fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/reset', (req, res) => {
  const data = readData();
  res.json({ resetTS: data.resetTS || 0 });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/leaderboard', (req, res) => {
  const data = readLeaderboard();
  res.json(data.slice(0, 10)); // Return top 10
});

app.post('/leaderboard', (req, res) => {
  const { name, score, mode } = req.body;
  if (!name || score === undefined || !mode) {
    return res.status(400).json({ error: 'invalid data' });
  }

  const data = readLeaderboard();
  data.push({ name, score, mode, date: new Date().toISOString() });
  data.sort((a, b) => b.score - a.score);
  const truncated = data.slice(0, 50); // Keep top 50
  writeLeaderboard(truncated);
  res.json(truncated.slice(0, 10));
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

  const now = new Date().toISOString();
  writeData({ resetTS: now });
  writeLeaderboard([]); // Clear global leaderboard
  res.json({ resetTS: now, message: 'Global leaderboard cleared' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Space Shooter backend running on ${port}`));
