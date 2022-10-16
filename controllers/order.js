const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const OrderItem = require('../models/OrderItem');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { isValidObjectId } = require('mongoose');

// @desc    Add Order
// @route   POST /api/v1/add-order
// @access  Private
exports.addOrder = asyncHandler(async (req, res, next) => {
  const {
    body: {
      orderItems,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      totalPrice,
    },
    user: loggedUser,
  } = req;

  // Promise.all : we have 2 promise operation => create OrderItem, then use orderItemIds in order to create new order
  // we have to wait for OrderItem, and then create new Order! Promise.all force js to wait create OrderItem results
  const orderItemsIds = Promise.all(
    orderItems.map(async (orderItem) => {
      if (!isValidObjectId(orderItem.product)) {
        return next(new ErrorResponse('Please provide a valid product', 400));
      }

      if (orderItem.quantity <= 0) {
        return next(new ErrorResponse('Quantity must be greater than 0', 400));
      }

      const existedProduct = await Product.findById(orderItem.product);

      if (!existedProduct) {
        return next(new ErrorResponse('Product not found', 400));
      }

      let newOrderItem = await OrderItem.create({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      return newOrderItem._id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;
  console.log({ orderItemsIdsResolved });

  // then: create new orders
  const newOrders = await Order.create({
    orderItems: orderItemsIdsResolved,
    shippingAddress1,
    shippingAddress2,
    zip,
    city,
    country,
    phone,
    status,
    totalPrice,
    user: loggedUser._id,
  });

  return res.json({
    success: true,
    data: newOrders,
  });
});

// @desc    Get Orders
// @route   GET /api/v1/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res, next) => {
  const { user } = req;

  const userOrders = await Order.find({
    user: user._id,
  })
    .populate('orderItems.product', 'name price')
    .populate('user', 'name')
    .sort('-createdAt');

  return res.json({
    success: true,
    data: userOrders,
  });
});

// @desc    Get Orders
// @route   GET /api/v1/orders-admin
// @access  Private
exports.getAllOrdersForAdmin = asyncHandler(async (req, res, next) => {
  const allOrders = await Order.find({})
    .populate('orderItems.product', 'name price')
    .populate('user', 'name')
    .sort('-createdAt');

  return res.json({
    success: true,
    data: allOrders,
  });
});

// @desc    Get Single Order
// @route   GET /api/v1/orders/:orderId
// @access  Private
exports.getSingleOrder = asyncHandler(async (req, res, next) => {
  const {
    params: { orderId },
    user,
  } = req;

  if (!isValidObjectId(orderId)) {
    return next(new ErrorResponse('Please provide a valid order', 400));
  }

  const existedOrder = await Order.findOne({
    _id: orderId,
    user: user._id,
  }).populate('orderItems.product', 'name price');
  // or: populate({path: 'orderItems', populate: 'product'})

  if (!existedOrder) {
    return next(new ErrorResponse('Order not found', 400));
  }

  return res.json({
    success: true,
    data: existedOrder,
  });
});

// @desc    Update Order
// @route   PUT /api/v1/update-order/:OrderId
// @access  Private
exports.updateOrder = asyncHandler(async (req, res, next) => {});

// @desc    Delete Order
// @route   PUT /api/v1/delete-order/:OrderId
// @access  Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {});
