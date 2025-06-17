const User = require('../models/User_Model');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, first_name, last_name, phone_number } = req.body;
  console.log('Received data:', {
    email,
    password,
    first_name,
    last_name,
    phone_number,
  });


  if ( !email || !password || !first_name || !last_name || !phone_number ) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    
    email,
    password: hashedPassword,
   
    first_name,
    last_name,
    phone_number
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      first_name: user.first_name, // Updated to include first_name
      last_name: user.last_name,     // Updated to include last_name
      email: user.email,
      
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User creation failed");
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;


  // Check for user email
  const user = await User.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.json({
        _id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role : user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// Generate JWT
const generateToken = (id) => {
  const secret = process.env.SECRET_KEY; // Replace with your own secret key
  return jwt.sign({ id }, secret, { expiresIn: '1h' }); // Adjust expiresIn as per your requirements
};

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Check if user exists
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.remove();

  res.status(200).json({ message: "User deleted" });
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, password, first_name, last_name, phone_number } = req.body;
  const userId = req.user._id;

  // Check if user exists
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update user fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (first_name) user.first_name = first_name;
  if (last_name) user.last_name = last_name;
  if (phone_number) user.phone_number = phone_number;
  if (password) {
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
  }

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
  });
});

// Get user profile
const getMyProfile = (req, res) => {
  res.json(req.user);
};

 const checkAuth = async (req, res) => {
  try {
      const user = req.user; // Use req.user from token verification
      if (!user) {
          return res.status(400).json({ success: false, message: "User not found" });
      }

      res.status(200).json({ success: true, user });
  } catch (error) {
      console.log("Error in checkAuth ", error);
      res.status(400).json({ success: false, message: error.message });
  }
};

// Get all users
// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve users", error: error.message });
  }
});

module.exports = {
  checkAuth,
  registerUser,
  loginUser,
  getMyProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers
};