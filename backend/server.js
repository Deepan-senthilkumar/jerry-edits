const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running! 🚀' });
});

// Routes (we'll add these soon)
app.use('/api/contact', require('./routes/contact'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/stats', require('./routes/stats'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on ${process.env.BACKEND_URL}`);
});