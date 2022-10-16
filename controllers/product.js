const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { isValidObjectId } = require('mongoose');
const {
  uploadImageToCloudinary,
  destroyImageFromCloudinary,
} = require('../utils/imageUpload');

// @desc    Add Product
// @route   POST /api/v1/add-product
// @access  Private
exports.addProduct = asyncHandler(async (req, res, next) => {
  const {
    body: {
      name,
      description,
      richDescription,
      brand,
      price,
      category,
      countInStock,
      isFeatured,
    },
  } = req;

  if (!isValidObjectId(category)) {
    return next(new ErrorResponse('Please provide a valid category', 400));
  }

  const existedCategory = await Category.findOne(category);
  if (!existedCategory) {
    return next(new ErrorResponse('Category not found', 400));
  }

  const existedProduct = await Product.findOne({ name });

  if (existedProduct) {
    return next(new ErrorResponse('Product existed already', 400));
  }

  if (price && price < 0) {
    return next(new ErrorResponse('Product provide a valid price amount', 400));
  }

  if (countInStock && countInStock < 0) {
    return next(
      new ErrorResponse('Product provide a valid countInStock amount', 400)
    );
  }

  if (!req.file) {
    return next(new ErrorResponse('Image field is required'));
  }

  const newProduct = new Product({
    name,
    description,
    richDescription,
    brand,
    price,
    category,
    countInStock,
    isFeatured,
  });

  const { url, public_id } = await uploadImageToCloudinary(req.file?.path);
  newProduct.image = { url, public_id };

  await newProduct.save();

  return res.status(201).json({
    success: true,
    data: newProduct,
  });
});

// @desc    Get products
// @route   GET /api/v1/products
// @access  Private
exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({})
    .populate('category', 'name')
    .select('name image -_id')
    .sort('-createdAt');

  return res.json({
    success: true,
    data: products,
  });
});

// @desc    Get products count
// @route   GET /api/v1/products-count
// @access  Private
exports.getProductsCount = asyncHandler(async (req, res, next) => {
  const productsCount = await Product.countDocuments();

  return res.json({
    success: true,
    data: productsCount,
  });
});

// @desc    Get featured products
// @route   GET /api/v1/products-featured?count
// @access  Private
exports.getProductsFeatured = asyncHandler(async (req, res, next) => {
  let {
    query: { count },
  } = req;

  count = count ? parseInt(count) : 5;
  const featuredProducts = await Product.find({ isFeatured: true })
    .populate('category', 'name')
    .limit(count);

  return res.json({
    success: true,
    data: featuredProducts,
  });
});

// @desc    Get specific category products
// @route   GET /api/v1/products-category?categories
// @access  Private
exports.getSpecificCategoriesProducts = asyncHandler(async (req, res, next) => {
  const {
    query: { categories },
  } = req;
  let filter = {};
  filter = { category: categories.split(',') };

  const products = await Product.find(filter)
    .populate('category', 'name')
    .sort('-createdAt');

  return res.json({
    success: true,
    data: products,
  });
});

// @desc    Get Single Product
// @route   GET /api/v1/products/:productId
// @access  Private
exports.getSingleProduct = asyncHandler(async (req, res, next) => {
  const {
    params: { productId },
  } = req;

  if (!isValidObjectId(productId)) {
    return next(new ErrorResponse('Please provide a valid product id', 400));
  }

  const product = await Product.findById(productId).populate(
    'category',
    'name'
  );

  if (!product) {
    return next(new ErrorResponse('Product not found', 400));
  }

  return res.json({
    success: true,
    data: product,
  });
});

// @desc    Update Product
// @route   PUT /api/v1/update-product/:productId
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const {
    body: {
      name,
      description,
      richDescription,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    },
    params: { productId },
  } = req;

  if (!isValidObjectId(productId)) {
    return next(new ErrorResponse('Please provide a valid product id', 400));
  }

  if (!isValidObjectId(category)) {
    return next(new ErrorResponse('Please provide a valid category', 400));
  }

  const existedCategory = await Category.findById(category);

  if (!existedCategory) {
    return next(new ErrorResponse('Please provide a valid category', 400));
  }

  const updatedCategory = await Product.findByIdAndUpdate(
    productId,
    {
      name,
      description,
      richDescription,
      brand,
      price,
      category: existedCategory._id,
      rating,
      numReviews,
      countInStock,
      isFeatured,
    },
    { new: true, runValidators: true }
  );

  return res.json({
    success: true,
    data: updatedCategory,
  });
});

// @desc    Update Product
// @route   PUT /api/v1/update-product-gallery-images/:productId
// @access  Private
exports.updateProductImages = asyncHandler(async (req, res, next) => {
  const {
    files,
    params: { productId },
  } = req;

  if (!isValidObjectId(productId)) {
    return next(new ErrorResponse('Please provide a valid product', 400));
  }

  let imagesPath = [];
  if (files) {
    files.map(async (file) => {
      const { url, public_id } = await uploadImageToCloudinary(file?.path);
      imagesPath.push({ url, public_id });
    });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      images: imagesPath,
    },
    { new: true, runValidators: true }
  );

  return res.json({
    success: true,
    data: updatedProduct,
  });
});

// @desc    Delete Product
// @route   PUT /api/v1/delete-product/:productId
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const {
    params: { productId },
  } = req;

  if (!isValidObjectId(productId)) {
    return next(new ErrorResponse('Please provide a valid product id', 400));
  }

  const product = await Product.findById(productId);

  if (product.image?.url) {
    const result = await destroyImageFromCloudinary(product.image?.public_id);
    if (result !== 'ok')
      return next(new ErrorResponse('Error deleting image', 500));
  }

  await product.remove();

  return res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});
