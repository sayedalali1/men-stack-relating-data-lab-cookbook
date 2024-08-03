const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  }, 
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main', 'dessert', 'drink']
  }
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  foods: [foodSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;