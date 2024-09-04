const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks');
const { auth } = require('express-openid-connect');
require('dotenv').config();

// Initialize Express app
const app = express();


// Log environment variables for debugging
console.log('AUTH0_SECRET:', process.env.AUTH0_SECRET);
console.log('BASE_URL:', process.env.BASE_URL);
console.log('AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID);
console.log('AUTH0_ISSUER_BASE_URL:', process.env.AUTH0_ISSUER_BASE_URL);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Secure /tasks routes
app.use('/tasks', (req, res, next) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }
  next();
}, taskRoutes);

// MongoDB Atlas connection string
const mongoUri = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose.connect(mongoUri)
.then(() => console.log('Connected to MongoDB Atlas!'))
.catch(err => console.error('Error connecting to MongoDB', err));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET || fun7fc7140297f20a1791b9beab3e1ce08507637f80bea0bea12a43d8e9b7694486,
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID, 
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-603hvls21rfemblu.eu.auth0.com'
};

// Auth0 middleware
app.use(auth(config));

// Public and protected routes
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});




// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

console.log('AUTH0_SECRET:', process.env.AUTH0_SECRET);
