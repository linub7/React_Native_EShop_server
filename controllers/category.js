const User = require('../models/User');
const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { isValidObjectId } = require('mongoose');

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
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({});

  return res.json({
    success: true,
    data: categories,
  });
});

// @desc    Get Single Category
// @route   GET /api/v1/categories/:categoryId
// @access  Public
exports.getSingleCategory = asyncHandler(async (req, res, next) => {
  const {
    params: { categoryId },
  } = req;

  if (!isValidObjectId(categoryId)) {
    return next(new ErrorResponse('Please provide a valid category Id', 400));
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new ErrorResponse('Category not found', 400));
  }

  return res.json({
    success: true,
    data: category,
  });
});

// @desc    Update Category
// @route   PUT /api/v1/update-category/:categoryId
// @access  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const {
    params: { categoryId },
    body: { name, icon, color },
  } = req;

  if (!isValidObjectId(categoryId)) {
    return next(new ErrorResponse('Please provide a valid category Id', 400));
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { name, icon, color },
    { new: true, runValidators: true }
  );

  return res.json({
    success: true,
    data: updatedCategory,
  });
});

// @desc    Delete Category
// @route   PUT /api/v1/delete-category/:categoryId
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const {
    params: { categoryId },
  } = req;

  if (!isValidObjectId(categoryId)) {
    return next(new ErrorResponse('Please provide a valid category Id', 400));
  }

  await Category.findByIdAndRemove(categoryId);

  return res.json({
    success: true,
    message: 'Category deleted successfully',
  });
});
