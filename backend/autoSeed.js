const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const ActivityLog = require('./models/ActivityLog');
const bcrypt = require('bcryptjs');

const autoSeed = async () => {
  try {
    const productCount = await Product.countDocuments({});
    if (productCount > 0) {
      console.log('Database already has items. Skipping auto-seeding.');
      return;
    }

    console.log('Database is empty. Initiating automatic seeding...');

    // Hash passwords using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedUserPassword = await bcrypt.hash('user123', salt);

    // Create Admin
    const adminUser = await User.create({
      name: 'ShopEZ Admin',
      email: 'admin@shopez.com',
      password: hashedAdminPassword,
      role: 'admin'
    });

    // Create Standard User
    const standardUser = await User.create({
      name: 'John Doe',
      email: 'user@shopez.com',
      password: hashedUserPassword,
      role: 'user'
    });

    console.log('Default Accounts Seeding Complete:');
    console.log(` - Admin Email: ${adminUser.email} (Password: admin123)`);
    console.log(` - User Email: ${standardUser.email} (Password: user123)`);

    // Define 6 Luxury Leather Products
    const products = [
      {
        name: 'Classic Leather Briefcase',
        description: 'Exquisite hand-finished Italian leather briefcase with solid brass hardware. Features dedicated padded laptop compartment, double buckles, and multiple organization pockets for the discerning professional.',
        price: 249.99,
        discount: 15,
        category: 'Bags',
        image: '/images/briefcase.png',
        stock: 25,
        views: 142
      },
      {
        name: 'Premium Bifold Wallet',
        description: 'Slim, elegant full-grain leather bifold wallet featuring RFID blocking technology. Crafted with 6 card slots, a transparent ID window, and 2 cash compartments for ultimate daily utility.',
        price: 59.99,
        discount: 0,
        category: 'Wallets',
        image: '/images/wallet.png',
        stock: 50,
        views: 98
      },
      {
        name: 'Vintage Leather Duffle Bag',
        description: 'Spacious weekender duffle crafted from rugged, water-resistant crazy horse leather. Complete with double carrying handles, an adjustable shoulder strap, and sturdy zippers for long-distance journeys.',
        price: 320.00,
        discount: 10,
        category: 'Bags',
        image: '/images/duffle.png',
        stock: 15,
        views: 185
      },
      {
        name: 'Handcrafted Leather Belt',
        description: 'Durable vegetable-tanned leather belt with a solid antiqued brass buckle. Hand-burnished edges that will mature and develop a beautiful, unique patina with regular wear.',
        price: 45.00,
        discount: 5,
        category: 'Accessories',
        image: '/images/belt.png',
        stock: 40,
        views: 64
      },
      {
        name: 'Luxury Leather Journal',
        description: 'Refillable leather-bound notebook housing premium heavy-weight, acid-free blank cream paper. Closed secure wrap tie cord to preserve your thoughts and sketches.',
        price: 35.00,
        discount: 0,
        category: 'Accessories',
        image: '/images/journal.png',
        stock: 30,
        views: 75
      },
      {
        name: 'Minimalist Card Holder',
        description: 'Sleek and compact card wallet made from top-grain leather. Quick-access slots on both sides and a central compartment for folded bills, tailored for front-pocket carry.',
        price: 29.99,
        discount: 20,
        category: 'Wallets',
        image: '/images/cardholder.png',
        stock: 60,
        views: 112
      }
    ];

    const seededProducts = await Product.insertMany(products);
    console.log(`Seeded ${seededProducts.length} premium leather products.`);

    // Seed mock visual activities
    const viewsActivities = [
      { userId: standardUser._id, productId: seededProducts[0]._id, action: 'VIEW_PRODUCT', date: new Date(Date.now() - 3600000 * 5) },
      { userId: standardUser._id, productId: seededProducts[2]._id, action: 'VIEW_PRODUCT', date: new Date(Date.now() - 3600000 * 4) },
      { userId: standardUser._id, productId: seededProducts[1]._id, action: 'VIEW_PRODUCT', date: new Date(Date.now() - 3600000 * 3) },
      { userId: standardUser._id, productId: seededProducts[5]._id, action: 'VIEW_PRODUCT', date: new Date(Date.now() - 3600000 * 2) }
    ];
    await ActivityLog.insertMany(viewsActivities);

    // Seed mock add-to-cart activities
    const cartActivities = [
      { userId: standardUser._id, productId: seededProducts[0]._id, action: 'ADD_TO_CART', date: new Date(Date.now() - 1800000) },
      { userId: standardUser._id, productId: seededProducts[2]._id, action: 'ADD_TO_CART', date: new Date(Date.now() - 900000) }
    ];
    await ActivityLog.insertMany(cartActivities);

    // Seed standard items to user's active cart
    await Cart.create({
      userId: standardUser._id,
      productId: seededProducts[0]._id,
      quantity: 1
    });
    await Cart.create({
      userId: standardUser._id,
      productId: seededProducts[2]._id,
      quantity: 1
    });

    // Seed one previous order
    const discountedPriceBriefcase = seededProducts[0].price * (1 - seededProducts[0].discount / 100);
    const discountedPriceWallet = seededProducts[1].price * (1 - seededProducts[1].discount / 100);
    await Order.create({
      userId: standardUser._id,
      products: [
        { productId: seededProducts[0]._id, quantity: 1, price: discountedPriceBriefcase },
        { productId: seededProducts[1]._id, quantity: 1, price: discountedPriceWallet }
      ],
      totalPrice: discountedPriceBriefcase + discountedPriceWallet,
      status: 'Shipped',
      createdAt: new Date(Date.now() - 86400000 * 3) // 3 days ago
    });

    console.log('Auto-Seeding Completed Successfully!');
  } catch (error) {
    console.error('Auto-seeding failed:', error);
  }
};

module.exports = autoSeed;
