const User = require('../models/User');
const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Add Category
// @route   POST /api/v1/add-category
// @access  Private
exports.addCategory = asyncHandler(async (req, res, next) => {
  const {
    body: { name, color, icon },
  } = req;

  if (!name) {
    return next(new ErrorResponse('Please provide a name', 400));
  }

  const existedCategory = await Category.findOne({ name, color });

  if (existedCategory) {
    return next(new ErrorResponse('Category exited already!', 400));
  }

  const newCategory = new Category({ name, color, icon });

  await newCategory.save();

  res.status(200).json({
    success: true,
    category: newCategory,
  });
});

// @desc    Get Categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {});

// @desc    Get Single Category
// @route   GET /api/v1/categories/:categoryId
// @access  Public
exports.getSingleCategory = asyncHandler(async (req, res, next) => {});

// @desc    Update Category
// @route   PUT /api/v1/update-category
// @access  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {});

// @desc    Delete Category
// @route   PUT /api/v1/delete-category/:categoryId
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {});
