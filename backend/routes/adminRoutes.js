const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getFrequentlyViewed,
  getRecentCartActivities,
  getUsers,
  deleteUser,
  getOrders,
  updateOrderStatus
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Dashboard data queries
router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/frequently-viewed', protect, admin, getFrequentlyViewed);
router.get('/recent-cart-activities', protect, admin, getRecentCartActivities);

// User lists and user deletion
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);

// Order lists and status tracking
router.get('/orders', protect, admin, getOrders);
router.put('/orders/:id', protect, admin, updateOrderStatus);

module.exports = router;
