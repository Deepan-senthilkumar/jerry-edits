const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test & Healthcheck Routes (for keep-alive cron & monitoring)
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running! 🚀', uptime: Math.floor(process.uptime()) });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: Math.floor(process.uptime()), timestamp: Date.now() });
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/stats', require('./routes/stats'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});