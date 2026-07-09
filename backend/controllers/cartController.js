const Cart = require('../models/Cart');
const ActivityLog = require('../models/ActivityLog');

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const qty = Number(quantity) || 1;

    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += qty;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId,
        productId,
        quantity: qty
      });
    }

    // Save Activity Log for Admin Dashboard
    await ActivityLog.create({
      userId,
      productId,
      action: 'ADD_TO_CART'
    });

    return res.status(201).json(cartItem);
  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({ message: 'Server error adding product to cart' });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const cartItems = await Cart.find({ userId }).populate('productId');
    return res.json(cartItems);
  } catch (error) {
    console.error('Fetch cart error:', error);
    return res.status(500).json({ message: 'Server error retrieving cart' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const userId = req.user._id;

    const cartItem = await Cart.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (cartItem.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Cart.deleteOne({ _id: cartItemId });
    return res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return res.status(500).json({ message: 'Server error removing item from cart' });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItemId = req.params.id;
    const userId = req.user._id;

    if (quantity === undefined || Number(quantity) < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const cartItem = await Cart.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (cartItem.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    cartItem.quantity = Number(quantity);
    await cartItem.save();

    return res.json(cartItem);
  } catch (error) {
    console.error('Update cart quantity error:', error);
    return res.status(500).json({ message: 'Server error updating cart quantity' });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity
};
