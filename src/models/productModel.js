const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
        },
        image: {
            thumbnail: { type: String, required: true },
            mobile: { type: String, required: true },
            tablet: { type: String, required: true },
            desktop: { type: String, required: true },
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
