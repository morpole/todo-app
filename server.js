
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/tasks', taskRoutes);

// MongoDB Atlas connection string
const mongoUri = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose.connect(mongoUri)
.then(() => console.log('Connected to MongoDB Atlas!'))
.catch(err => console.error('Error connecting to MongoDB', err));

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
