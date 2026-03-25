require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/products', productRoutes);
app.use('/api/inventories', inventoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route tidak tìm thấy'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   - POST   /api/products - Tạo product (tự động tạo inventory)`);
  console.log(`   - GET    /api/products - Lấy tất cả product`);
  console.log(`   - GET    /api/inventories - Lấy tất cả inventory`);
  console.log(`   - GET    /api/inventories/:id - Lấy inventory theo ID`);
  console.log(`   - POST   /api/inventories/add-stock - Tăng stock`);
  console.log(`   - POST   /api/inventories/remove-stock - Giảm stock`);
  console.log(`   - POST   /api/inventories/reserve - Đặt hàng`);
  console.log(`   - POST   /api/inventories/sell - Bán hàng\n`);
});

module.exports = app;
