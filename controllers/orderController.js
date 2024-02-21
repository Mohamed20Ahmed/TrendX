const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const {
  getProductByIdDB,
  productBulkWriteDB,
} = require("../database/productDB");
const { getCartByIdDB, deleteCartByIdDB } = require("../database/cartDB");
const {
  getOrderByIdDB,
  getAllOrdersDB,
  createOrderDB,
} = require("../database/orderDB");
const { sendSuccessResponse } = require("../utils/responseHandler");
const Cart = require("../models/cartModel");

const createCashOrder = asyncHandler(async (req, res, next) => {
  const shippingPrice = 0;
  const cart = await getCartByIdDB(req.params.cartId);
  const user = req.user;
  if (!cart || cart.customer.toString() !== user._id.toString()) {
    return next(new ApiError("cart not found", 404));
  }

  const product = await getProductByIdDB(cart.cartItems[0].product);
  const seller = product.sellerId.toString();
  console.log(seller);
  const cartPrice = cart.totalCartPrice;
  const totalOrderPrice = cartPrice + shippingPrice;
  const order = await createOrderDB({
    seller,
    customer: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productBulkWriteDB(bulkOption, {});

    await deleteCartByIdDB(req.params.cartId);
  }

  return sendSuccessResponse(res, { order }, 201);
});

const getOrder_S = asyncHandler(async (req, res, next) => {
  const orderExcludedFields = "-__v";
  const user = req.user;
  console.log(req.query.orderId);

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
  order.changeStatusTime = Date.now();
  const updatedOrder = await order.save();

  sendSuccessResponse(res, updatedOrder, 201);
});

module.exports = {
  getOrder_S,
  createCashOrder,
  updateOrderStatus,
};
