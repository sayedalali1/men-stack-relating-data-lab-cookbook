const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
// server.js
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
// server.js

const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');
const usersController = require('./controllers/users.js');


const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/users', usersController.index);
app.get('/users/:id', usersController.show);

app.use(passUserToView)
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/foods',foodsController);
// server.js

app.get('/', (req, res) => {
  // Check if the user is signed in
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/foods`);
  } else {
    res.render('index.ejs');
  }
});


app.use('/users/:userId/foods', foodsController); // New!

app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});




app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});