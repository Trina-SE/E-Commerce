import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Create product (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, stock, sku, seller, image, images } = req.body;

    if (!name || !description || !price || !category || !sku || !seller) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingSKU = await Product.findOne({ sku });
    if (existingSKU) {
      return res.status(400).json({ message: 'SKU already exists' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      sku,
      seller,
      image: image || 'https://via.placeholder.com/300',
      images: images || [],
    });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Add review
router.post('/:id/reviews', async (req, res) => {
  try {
    const { userId, username, rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = { userId, username, rating, comment };
    product.reviews.push(review);

    // Update average rating
    const avgRating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    product.rating = avgRating;

    await product.save();
    res.status(201).json({ message: 'Review added', product });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

export default router;
