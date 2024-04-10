// server.js

const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const producerRoutes = require('./routes/producerRoutes');
const { fetchUserDetails } = require('./middlewares/userMiddleware');

const app = express();

const corsOptions = {
  origin: '*',
};

// Enable CORS with specific options
app.use(cors(corsOptions));

// Add session middleware to your Express.js app
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Middleware
app.use(express.json());


app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.use(expressLayouts);

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Serve Bootstrap files from node_modules
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));



// api routes ------------------------------>
app.use('/api/user', userRoutes);
app.use('/api/producer', producerRoutes);

// Apply the middleware to all site routes
app.use('/', fetchUserDetails);

app.get('/', (req, res) => {
  var locals = {
    title: 'Home',
    description: 'Welcome to the home page',
    header: 'Home Page',
    user: req.user
  };
  res.render('pages/home', locals);
});

app.get('/map', (req, res) => {
  res.render('pages/map', { user: req.user });
});


// admin routes ---------------------------->
app.get('/admin', (req, res) => {
  res.render('admin/login', { user: req.user });
});

app.get('/admin/dashboard', (req, res) => {
  res.render('admin/dashboard', { user: req.user });
});

app.get('/admin/users', (req, res) => {
  res.render('admin/users', { user: req.user });
});

app.get('/admin/users/:id', (req, res) => {
  res.render('admin/user', { user: req.user, id: req.params.id });
});



// Middleware to handle 404 errors
app.use((req, res, next) => {
  res.status(404).render('404'); // Render the 404 page
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
