const express = require('express');
const { getCart, addProductToCart, updateCartQuantity, removeProductFromCart } = require('../controllers/cartController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// GET /cart - Retrieve the user's cart
router.get('/', protect, getCart);

// POST /cart - Add product to the cart
router.post('/', protect, addProductToCart);

// PUT /cart/:id - Update product quantity in the cart
router.put('/:id', protect, updateCartQuantity);

// DELETE /cart/:id - Remove product from the cart
router.delete('/:id', protect, removeProductFromCart);

module.exports = router;
