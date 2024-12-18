const express = require('express');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');
const { globalLimiter } = require('./utils/rateLimiter');
const { swaggerUi } = require('./utils/swaggerDocumentation');
const swaggerDocument = require('../swagger.json');
const path = require('path');
const cors = require('cors')

const app = express();
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data
app.use(globalLimiter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin: '*', // Allow all origins
    methods: 'GET, POST, PUT, DELETE',
  }));
 

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);



module.exports = app;
