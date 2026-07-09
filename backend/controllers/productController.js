const Product = require('../models/Product');
const ActivityLog = require('../models/ActivityLog');

const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    return res.status(500).json({ message: 'Server error fetching products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment views
    product.views = (product.views || 0) + 1;
    await product.save();

    // Log Activity (requires auth middleware)
    if (req.user) {
      await ActivityLog.create({
        userId: req.user._id,
        productId: product._id,
        action: 'VIEW_PRODUCT'
      });
    }

    return res.json(product);
  } catch (error) {
    console.error('Fetch product by ID error:', error);
    return res.status(500).json({ message: 'Server error fetching product details' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, image, stock } = req.body;

    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({ message: 'All product fields are required' });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      discount: Number(discount || 0),
      category,
      image,
      stock: Number(stock || 0)
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ message: 'Server error creating product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, image, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.discount = discount !== undefined ? Number(discount) : product.discount;
    product.category = category || product.category;
    product.image = image || product.image;
    product.stock = stock !== undefined ? Number(stock) : product.stock;

    const updatedProduct = await product.save();
    return res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ message: 'Server error updating product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });
    return res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ message: 'Server error deleting product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
