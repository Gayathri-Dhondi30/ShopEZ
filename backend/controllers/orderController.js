const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // Retrieve active cart items populated with product details
    const cartItems = await Cart.find({ userId }).populate('productId');

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cannot place order: Cart is empty' });
    }

    let totalPrice = 0;
    const orderProducts = [];

    // Verify stock and check product pricing
    for (const item of cartItems) {
      const product = item.productId;

      if (!product) {
        return res.status(404).json({ message: 'One or more products in your cart do not exist' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }

      // Compute discounted price per unit
      const discountedUnitPrice = product.price * (1 - (product.discount || 0) / 100);
      totalPrice += discountedUnitPrice * item.quantity;

      orderProducts.push({
        productId: product._id,
        quantity: item.quantity,
        price: discountedUnitPrice
      });
    }

    // Place the order
    const order = await Order.create({
      userId,
      products: orderProducts,
      totalPrice
    });

    // Decrement product inventory stock levels
    for (const item of cartItems) {
      const product = item.productId;
      product.stock -= item.quantity;
      await product.save();
    }

    // Empty the user's cart
    await Cart.deleteMany({ userId });

    return res.status(201).json(order);
  } catch (error) {
    console.error('Place order error:', error);
    return res.status(500).json({ message: 'Server error placing order' });
  }
};

const getOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({ userId })
      .populate('products.productId')
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return res.status(500).json({ message: 'Server error retrieving orders' });
  }
};

module.exports = {
  placeOrder,
  getOrders
};
