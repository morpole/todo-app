const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks');
const { auth } = require('express-openid-connect');
const userRoutes = require('./routes/tasks');
require('dotenv').config();

// Initialize Express app
const app = express();

// Determine if we're in a production or development environment
const isProduction = process.env.NODE_ENV === 'production'; 

// Auth0 configuration
const config = {
  authRequired: true,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET || 'default-secret-for-local-testing',
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

// Use auth middleware
app.use(auth(config));

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/tasks', taskRoutes);
app.use('/api', userRoutes); // Mount the user routes

// MongoDB Atlas connection string
const mongoUri = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Define routes after auth middleware
// app.get('/', (req, res) => {
//   console.log(req.oidc); // Debugging
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

app.get('/protected', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.send('You are authenticated!');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.oidc.login();
});


app.get('/signed-out', (req, res) => {
  res.sendFile(__dirname + '/public/signout.html');
});

app.get('/logout', (req, res) => {
  res.oidc.logout({ returnTo: '/signed-out' });
});