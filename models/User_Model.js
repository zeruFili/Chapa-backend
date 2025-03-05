const mongoose = require('mongoose');
const Joi = require('joi');

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  first_name: {
    type: String,
    required: true // Added field for first name
  },
  last_name: {
    type: String,
    required: true // Added field for last name
  },
  phone_number: {
    type: String,
    required: true // Added field for phone number
  },
});

// Define a static method for validating user input
userSchema.statics.validateUser = function(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    first_name: Joi.string().required(), // Added validation for first name
    last_name: Joi.string().required(), // Added validation for last name
    phone_number: Joi.string().required() // Added validation for phone number
  });

  return schema.validate(user);
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;