import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    // Sort by newest first
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
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
});

// --- Admin Only Routes ---

// POST /api/products
router.post('/', protect, admin, async (req, res) => {
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
    
    // Use the logic from our Frontend (AdminProductEditPage)
    const product = new Product({
      name,
      price,
      // Fix: Only set originalPrice if it's valid, otherwise 'undefined'
      originalPrice: (originalPrice && Number(originalPrice) > Number(price)) ? Number(originalPrice) : undefined,
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
    console.error('Product create error:', error);
    res.status(500).json({ message: 'Server Error creating product' });
  }
});

// PUT /api/products/:id
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, price, originalPrice, imageUrl, category, description, countInStock, colors, sizes } = req.body;
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
      // If originalPrice is empty or 0, set it to 'undefined'
      if (originalPrice && Number(originalPrice) > Number(price)) {
        product.originalPrice = Number(originalPrice);
      } else {
        product.originalPrice = undefined; // This removes it from the database
      }
      // --- Fix Complete ---

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ message: 'Server Error updating product' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting product' });
  }
});

export default router;