const Product = require('../models/productModel');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');


// GET /products - Get all products
const getProducts = async (req, res) => {
    try {
        const { keyword, category, minPrice, maxPrice } = req.query;

        // Build a query object dynamically based on provided filters
        const query = {};

        // Search by name (case-insensitive)
        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Fetch filtered products from the database
        const products = await Product.find(query);

        res.status(200).json(products);
    } catch (error) {
        console.error(`Error fetching products: ${error.message}`);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};



// GET /products/:id - Get a product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(`Error fetching product by ID: ${error.message}`);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};



// POST /products - Create a new product (admin only)
const createProduct = async (req, res) => {
    const { name, category, price } = req.body;

    // Validate required fields
    if (!name || !category || !price) {
        return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' });
    }

    const uploadedImage = req.file;

    try {
        const outputDir = path.join(__dirname, '../uploads/products');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const imageResolutions = {
            thumbnail: '100x100',
            mobile: '300x300',
            tablet: '600x600',
            desktop: '1200x1200',
        };

        const processedImages = {};

        for (const [resolution, size] of Object.entries(imageResolutions)) {
            const uniqueFilename = `${Date.now()}-${resolution}.jpg`;
            const outputPath = path.join(outputDir, uniqueFilename);
            const [width, height] = size.split('x').map(Number);

            console.log(`Processing image for resolution: ${resolution}`);

            await sharp(uploadedImage.path)
                .resize(width, height)
                .toFormat('jpeg')
                .toFile(outputPath);

            processedImages[resolution] = `/uploads/products/${uniqueFilename}`;
        }

        const product = new Product({
            name,
            category,
            price,
            image: processedImages,
        });

        const createdProduct = await product.save();

        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(`Error creating product: ${error.message}`);
        res.status(500).json({ message: 'Failed to create product' });
    }
};


// PUT /products/:id - Update a product by ID (admin only)
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, price } = req.body;

    try {
        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update basic fields if provided
        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price !== undefined ? price : product.price;

        // Process and update image if a new file is uploaded
        if (req.file) {
            const uploadedImage = req.file;

            // Define output paths for resized images
            const outputDir = path.join(__dirname, '../uploads/products');
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

            const imageResolutions = {
                thumbnail: '100x100',
                mobile: '300x300',
                tablet: '600x600',
                desktop: '1200x1200',
            };

            const processedImages = {};

            for (const [resolution, size] of Object.entries(imageResolutions)) {
                const outputPath = path.join(outputDir, `${Date.now()}-${resolution}.jpg`);
                const [width, height] = size.split('x').map(Number);

                // Resize and save the image
                await sharp(uploadedImage.path)
                    .resize(width, height)
                    .toFormat('jpeg')
                    .toFile(outputPath);

                processedImages[resolution] = `/uploads/products/${path.basename(outputPath)}`;
            }

            // Delete the old image files
            if (product.image) {
                for (const key in product.image) {
                    let imagePath = product.image[key];
                    if (typeof imagePath !== 'string') {
                        continue;  // Skip if it's not a valid string
                    }

                    const oldImagePath = path.join(__dirname, '../', product.image[key]);
                    // Ensure old images are deleted if they exist
                    if (fs.existsSync(oldImagePath)) {
                        console.log(`Deleting old image: ${oldImagePath}`);
                        fs.unlinkSync(oldImagePath);
                    }
                }
            }

            // Update the image field with new processed images
            product.image = processedImages;

        }

        // Save the updated product
        const updatedProduct = await product.save();

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(`Error updating product: ${error.message}`);
        res.status(500).json({ message: 'Failed to update product' });
    }
};



// DELETE /products/:id - Delete a product by ID (admin only)
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Debug: Log the product to ensure it's correct
        console.log('Product found:', product);

        // Delete image files associated with the product
        if (product.image) {
            for (const key in product.image) {
                 // Check if imagePath is a string before proceeding
                 let imagePath = product.image[key];
                if (typeof imagePath !== 'string') {
                    continue;  // Skip this iteration if it's not a valid string
                }

                imagePath = path.join(__dirname, '../', product.image[key]);;

                // Ensure that the image path is a valid string before attempting to delete
                if (typeof imagePath === 'string' && fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                } else {
                   continue;
                }
            }
        }

        // Delete the product from the database
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            console.error('Product deletion failed:', id);
            return res.status(500).json({ message: 'Failed to delete product from database' });
        }

        console.log('Product deleted from database:', deletedProduct);

        // Send success response
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(`Error deleting product: ${error.message}`);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};



module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
