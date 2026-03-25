const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm'],
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
