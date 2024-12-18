const express = require('express');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


const router = express.Router();

// Public Routes
// GET /products - Get all products
router.get('/', getProducts);

// GET /products/:id - Get a single product by ID
router.get('/:id', protect, getProductById);

// Admin Routes
// POST /products - Add a new product (Admin only)
router.post('/', protect, admin, upload.single('image'), createProduct);

// PUT /products/:id - Update an existing product (Admin only)
router.put('/:id', protect, admin, upload.single('image'), updateProduct);

// DELETE /products/:id - Delete a product (Admin only)
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
