const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

// Create product
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tên sản phẩm'
      });
    }
    
    // Create product
    const product = new Product({ name });
    await product.save();
    
    // Auto create inventory for this product
    const inventory = new Inventory({ product: product._id });
    await inventory.save();
    
    res.status(201).json({
      success: true,
      message: 'Sản phẩm được tạo thành công',
      data: {
        product,
        inventory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
