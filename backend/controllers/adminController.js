const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ActivityLog = require('../models/ActivityLog');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Summing revenue from Orders
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    });
  } catch (error) {
    console.error('Fetch dashboard stats error:', error);
    return res.status(500).json({ message: 'Server error retrieving dashboard statistics' });
  }
};

const getFrequentlyViewed = async (req, res) => {
  try {
    // Sort products by highest views count descending
    const products = await Product.find()
      .sort({ views: -1 })
      .limit(10);
    return res.json(products);
  } catch (error) {
    console.error('Fetch frequently viewed error:', error);
    return res.status(500).json({ message: 'Server error retrieving frequently viewed products' });
  }
};

const getRecentCartActivities = async (req, res) => {
  try {
    // Fetch and populate recent cart additions
    const activities = await ActivityLog.find({ action: 'ADD_TO_CART' })
      .populate('userId', 'name email')
      .populate('productId', 'name image category price')
      .sort({ date: -1 })
      .limit(10);
    return res.json(activities);
  } catch (error) {
    console.error('Fetch recent cart activities error:', error);
    return res.status(500).json({ message: 'Server error retrieving recent cart activities' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    return res.status(500).json({ message: 'Server error retrieving users list' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete an administrator account' });
    }

    await User.deleteOne({ _id: req.params.id });
    return res.json({ message: 'User account removed successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Server error deleting user' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('products.productId')
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error('Fetch admin orders error:', error);
    return res.status(500).json({ message: 'Server error retrieving global orders list' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Order Placed', 'Processing', 'Shipped', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid order status value' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    return res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({ message: 'Server error updating order status' });
  }
};

module.exports = {
  getDashboardStats,
  getFrequentlyViewed,
  getRecentCartActivities,
  getUsers,
  deleteUser,
  getOrders,
  updateOrderStatus
};
