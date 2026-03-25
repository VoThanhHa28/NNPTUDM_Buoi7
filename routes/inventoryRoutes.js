const express = require('express');
const router = express.Router();
const {
  getAllInventories,
  getInventoryById,
  addStock,
  removeStock,
  reserve,
  sell
} = require('../controllers/inventoryController');

// GET routes
router.get('/', getAllInventories);
router.get('/:id', getInventoryById);

// POST routes
router.post('/add-stock', addStock);
router.post('/remove-stock', removeStock);
router.post('/reserve', reserve);
router.post('/sell', sell);

module.exports = router;
