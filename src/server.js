const app = require('./app');
const connectDB = require('./config/db');
const dotenv = require('dotenv');


const PORT = process.env.PORT || 5000;
dotenv.config();


// Connect to the database, then start the server
const startServer = async () => {
    try {
        await connectDB();
        console.log('Database connection successful');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database', error);
        process.exit(1); // Exit the process with failure code
    }
};

startServer();
