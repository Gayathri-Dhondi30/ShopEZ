const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const autoSeed = require('./autoSeed');

// Load env variables
dotenv.config();

// Connect database and seed
connectDB().then(() => {
  autoSeed();
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Bind API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Check for and serve frontend build folder in production
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      return res.sendFile(path.resolve(distPath, 'index.html'));
    } else {
      return res.status(404).json({ message: 'API Route Not Found' });
    }
  });
} else {
  app.get('/', (req, res) => {
    return res.send('ShopEZ API Server is running. Frontend has not been built yet.');
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  return res.status(500).json({ message: 'An internal server error occurred' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ShopEZ Server is running on port ${PORT}`);
});
