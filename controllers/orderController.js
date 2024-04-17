const asyncHandler = require("express-async-handler");
const axios = require("axios");

const ApiError = require("../utils/apiError");
const { sendSuccessResponse } = require("../utils/responseHandler");
const Product = require("../models/productModel");
const {
  getProductByIdDB,
  productBulkWriteDB,
} = require("../database/productDB");
const { getCartByIdDB, deleteCartDB } = require("../database/cartDB");
const {
  getOrderByIdDB,
  getAllOrdersDB,
  createOrderDB,
  getOrdersDB,
} = require("../database/orderDB");
const Cart = require("../models/cartModel");

const createCashOrder = asyncHandler(async (req, res, next) => {
  const cart = await getCartByIdDB(req.params.cartId);

  const user = req.user;

  if (!cart || cart.customer.toString() !== user._id.toString()) {
    return next(new ApiError("cart not found", 404));
  }

  if (cart.seller.active === false) {
    return next(new ApiError("cannot proceed this order", 404));
  }

  const seller = cart.seller._id.toString();

  let shippingAddress = req.body.shippingAddress;

  if (!shippingAddress) {
    shippingAddress = { phone: user.phoneNumber, address: user.address };
  }

  const order = await createOrderDB({
    seller,
    customer: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: cart.totalCartPrice,
  });

  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { sold: +item.quantity } },
      },
    }));

    await productBulkWriteDB(bulkOption, {});

    await deleteCartDB({ _id: req.params.cartId });
  }

  return sendSuccessResponse(res, { order }, 201);
});

const getOrder_S = asyncHandler(async (req, res, next) => {
  const orderExcludedFields = "-__v";

  const user = req.user;

  // get specific order
  if (req.query.orderId) {
    const order = await getOrderByIdDB(req.query.orderId, orderExcludedFields);

    if (!order || order[user.role]._id.toString() !== user._id.toString()) {
      return next(new ApiError("order not found", 404));
    }

    return sendSuccessResponse(res, { order }, 200);
  }

  // get all orders
  if (user.role !== "admin") {
    req.query[user.role] = user._id;
  }

  req.query.fields = req.query.fields || orderExcludedFields;

  const response = await getAllOrdersDB(req);

  sendSuccessResponse(res, response, 200);
});

const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const orderExcludedFields = "-__v";

  const user = req.user;

  const order = await getOrderByIdDB(req.params.orderId, orderExcludedFields);

  if (!order || order[user.role]._id.toString() !== user._id.toString()) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.orderId}`,
        404
      )
    );
  }

  order.status = req.body.status;

  order.shippingPrice = req.body.shippingPrice;

  order.changeStatusTime = Date.now();

  const updatedOrder = await order.save();

  sendSuccessResponse(res, updatedOrder, 201);
});

const predictRevenue = asyncHandler(async (req, res, next) => {
  const endOfYear = new Date();
  const startOfYear = new Date();
  startOfYear.setMonth(endOfYear.getMonth() - 11);

  let features = {
    m1: 0,
    m2: 0,
    m3: 0,
    m4: 0,
    m5: 0,
    m6: 0,
    m7: 0,
    m8: 0,
    m9: 0,
    m10: 0,
    m11: 0,
    m12: 0,
  };

  const orders = await getOrdersDB({
    seller: req.user._id,
    status: "delivered",
  });
  let date = startOfYear;

  for (let i = 1; i <= 12; i++) {
    orders.map((order) => {
      if (
        order.updatedAt.getMonth() == date.getMonth() &&
        order.updatedAt.getYear() == date.getYear()
      ) {
        features[`m${i}`] += order.totalOrderPrice;
      }
    });
    date.setMonth(date.getMonth() + 1);
  }
  const salesRevenue = (await forwardSalesToModel(features)).data;

  const response = { salesRevenue };

  sendSuccessResponse(res, response, 200);
});

const forwardSalesToModel = async (data) => {
  try {
    const response = await axios.post("http://localhost:9000/revenue", data, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOrder_S,
  createCashOrder,
  updateOrderStatus,
  predictRevenue,
};
