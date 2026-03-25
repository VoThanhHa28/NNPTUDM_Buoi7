const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Vui lòng chọn sản phẩm'],
      unique: true
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock không được âm']
    },
    reserved: {
      type: Number,
      default: 0,
      min: [0, 'Reserved không được âm']
    },
    soldCount: {
      type: Number,
      default: 0,
      min: [0, 'Sold count không được âm']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);
