const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addToCart);
router.get('/:userId', protect, getCart);
router.delete('/remove/:id', protect, removeFromCart);
router.put('/update/:id', protect, updateQuantity);

module.exports = router;
