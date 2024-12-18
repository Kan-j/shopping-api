
const { default: mongoose } = require('mongoose');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// GET /cart - Retrieve the current user's cart
const getCart = async (req, res) => {
    try {
        // Find the user's cart by user ID and populate product details in cart items
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product'); 
        console.log(cart)
        if (!cart) {
            // Create a new cart if none exists
            cart = new Cart({ user: req.user._id, items: [], totalAmount: 0 });
            await cart.save();
        }

        // Return the populated cart
        res.status(200).json(cart);
    } catch (error) {
        console.error(`Error retrieving cart: ${error.message}`);
        res.status(500).json({ message: 'Failed to retrieve cart' });
    }
};



// POST /cart - Add product to the cart
const addProductToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        // Find the product in the database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            // Create a new cart if none exists
            cart = new Cart({ user: req.user._id, items: [], totalAmount: 0 });
        }

        // Check if the product is already in the cart
        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            // If the product already exists, update the quantity
            existingItem.quantity += quantity;
        } else {
            // If the product doesn't exist in the cart, add a new item
            cart.items.push({
                product,
                quantity,
                price: product.price // Store the price of the product
            });
        }

        // Recalculate the total amount of the cart after the update
        cart.totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

        // Save the updated cart
        await cart.save();

        // Return the updated cart
        res.status(201).json(cart);
    } catch (error) {
        console.error(`Error adding product to cart: ${error.message}`);
        res.status(500).json({ message: 'Failed to add product to cart' });
    }
};


// PUT /cart/:id - Update product quantity in cart
const updateCartQuantity = async (req, res) => { 
    const { id } = req.params;
    const { quantity } = req.body;
    // Convert the product id string to a mongoose ObjectId
    const productId = new mongoose.Types.ObjectId(id);
    try {
        // Validate the quantity
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity. Quantity must be a positive number.' });
        }

        // Find the user's cart
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart by item id
        const item = cart.items.find(item => item.product.equals(productId));


        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Find the product in the database
        const product = await Product.findById(item.product);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the quantity of the item in the cart
        item.quantity = quantity;

        // Update the total amount of the cart
        cart.totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

        // Save the updated cart
        await cart.save();

        // Return the updated cart
        res.status(200).json(cart);
    } catch (error) {
        console.error(`Error updating cart: ${error.message}`);
        res.status(500).json({ message: 'Failed to update cart' });
    }
};


// DELETE /cart/:id - Remove product from cart
const removeProductFromCart = async (req, res) => {
    const { id } = req.params;
    const productId = new mongoose.Types.ObjectId(id); // Ensure the ID is in ObjectId format

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Filter out the product from cart.items
        cart.items = cart.items.filter(item => !item.product.equals(productId));

        // Recalculate the total amount
        cart.totalAmount = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        // Save the updated cart
        await cart.save();

        // Return success response
        res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        console.error(`Error removing product from cart: ${error.message}`);
        res.status(500).json({ message: 'Failed to remove product from cart' });
    }
};





module.exports = {
    getCart,
    addProductToCart,
    updateCartQuantity,
    removeProductFromCart
};
