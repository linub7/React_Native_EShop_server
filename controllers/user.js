const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { isValidObjectId } = require('mongoose');

// @desc    Get Users
// @route   GET /api/v1/users
// @access  Private
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({}).select('name email -password');

  return res.json({
    success: true,
    data: users,
  });
});

// @desc    Get Users Count
// @route   GET /api/v1/users-count
// @access  Private
exports.getUsersCount = asyncHandler(async (req, res, next) => {
  const count = await User.countDocuments();

  return res.json({
    success: true,
    data: count,
  });
});

// @desc    Get Single User
// @route   GET /api/v1/users/:userId
// @access  Public
exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const {
    params: { userId },
  } = req;

  if (!isValidObjectId(userId)) {
    return next(new ErrorResponse('Please provide a valid user Id', 400));
  }

  const user = await User.findById(userId).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 400));
  }

  return res.json({
    success: true,
    data: user,
  });

  if (!category) {
    return next(new ErrorResponse('Category not found', 400));
  }

  return res.json({
    success: true,
    data: category,
  });
});
