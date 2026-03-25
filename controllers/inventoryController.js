const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

// Get all inventories
exports.getAllInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find().populate('product');
    
    res.status(200).json({
      success: true,
      count: inventories.length,
      data: inventories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get inventory by ID
exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate('product');
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy inventory'
      });
    }
    
    res.status(200).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add stock
exports.addStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    
    // Validate input
    if (!product || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp product và quantity'
      });
    }
    
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity phải lớn hơn 0'
      });
    }
    
    // Find inventory by product
    const inventory = await Inventory.findOne({ product });
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy inventory cho sản phẩm này'
      });
    }
    
    // Add stock
    inventory.stock += quantity;
    await inventory.save();
    
    await inventory.populate('product');
    
    res.status(200).json({
      success: true,
      message: `Đã cộng ${quantity} vào stock`,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove stock
exports.removeStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    
    // Validate input
    if (!product || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp product và quantity'
      });
    }
    
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity phải lớn hơn 0'
      });
    }
    
    // Find inventory by product
    const inventory = await Inventory.findOne({ product });
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy inventory cho sản phẩm này'
      });
    }
    
    // Check if stock is enough
    if (inventory.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stock không đủ. Hiện tại có ${inventory.stock}, yêu cầu ${quantity}`
      });
    }
    
    // Remove stock
    inventory.stock -= quantity;
    await inventory.save();
    
    await inventory.populate('product');
    
    res.status(200).json({
      success: true,
      message: `Đã trừ ${quantity} từ stock`,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reservation
exports.reserve = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    
    // Validate input
    if (!product || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp product và quantity'
      });
    }
    
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity phải lớn hơn 0'
      });
    }
    
    // Find inventory by product
    const inventory = await Inventory.findOne({ product });
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy inventory cho sản phẩm này'
      });
    }
    
    // Check if stock is enough
    if (inventory.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stock không đủ để reserve. Hiện tại có ${inventory.stock}, yêu cầu ${quantity}`
      });
    }
    
    // Update inventory
    inventory.stock -= quantity;
    inventory.reserved += quantity;
    await inventory.save();
    
    await inventory.populate('product');
    
    res.status(200).json({
      success: true,
      message: `Đã đặt hàng ${quantity} sản phẩm`,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Sell
exports.sell = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    
    // Validate input
    if (!product || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp product và quantity'
      });
    }
    
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity phải lớn hơn 0'
      });
    }
    
    // Find inventory by product
    const inventory = await Inventory.findOne({ product });
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy inventory cho sản phẩm này'
      });
    }
    
    // Check if reserved is enough
    if (inventory.reserved < quantity) {
      return res.status(400).json({
        success: false,
        message: `Reserved không đủ. Hiện tại có ${inventory.reserved}, yêu cầu ${quantity}`
      });
    }
    
    // Update inventory
    inventory.reserved -= quantity;
    inventory.soldCount += quantity;
    await inventory.save();
    
    await inventory.populate('product');
    
    res.status(200).json({
      success: true,
      message: `Đã bán ${quantity} sản phẩm`,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
