import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching products' });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching product' });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      imageUrl,
      category,
      description,
      countInStock,
      colors,
      sizes,
    } = req.body;

    const product = new Product({
      name,
      price,
      // Fix: Only set originalPrice if it's valid, otherwise 'undefined'
      originalPrice: originalPrice || undefined, 
      imageUrl,
      category,
      description,
      countInStock,
      colors,
      sizes,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating product', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      imageUrl,
      category,
      description,
      countInStock,
      colors,
      sizes,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.imageUrl = imageUrl;
      product.category = category;
      product.description = description;
      product.countInStock = countInStock;
      product.colors = colors;
      product.sizes = sizes;

      // --- ✅ This is the "0 Price" Fix for "Update Product" ---
      // Only set originalPrice if it's a valid number > price
      if (originalPrice && Number(originalPrice) > Number(price)) {
        product.originalPrice = originalPrice;
      } else {
        // If it's 0 or empty, set it to 'undefined' to remove it from database
        product.originalPrice = undefined; 
      }
      // --- Fix Complete ---

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};