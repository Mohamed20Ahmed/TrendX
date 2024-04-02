const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const { sendSuccessResponse } = require("../utils/responseHandler");
const {
  getCartDB,
  getCartByIdDB,
  getAllCartDB,
  addToCartDB,
  deleteCartDB,
} = require("../database/cartDB");
const { getProductByIdDB } = require("../database/productDB");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;

  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });

  cart.totalCartPrice = totalPrice;

  return totalPrice;
};

const getCustomerCart_S = asyncHandler(async (req, res, next) => {
  if (req.query.cartId) {
    const cart = await getCartByIdDB(req.query.cartId);

    if (!cart) {
      return next(
        new ApiError(`There is no cart for this id  : ${req.query.cartId}`, 404)
      );
    }

    const response = { numOfCartItems: cart.cartItems.length, cart };

    return sendSuccessResponse(res, response, 200);
  }

  req.query.customerId = req.user._id;

  const carts = await getAllCartDB(req);

  const response = { ...carts };

  sendSuccessResponse(res, response, 200);
});

const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await getProductByIdDB(productId);

  if (!product) {
    return next(new ApiError("product not exists", 404));
  }

  if (product.colors.indexOf(color) == -1) {
    return next(new ApiError("select from available colors", 404));
  }

  // 1) Get Cart for logged user
  let cart = await getCartDB({
    customer: req.user._id,
    seller: product.seller,
  });

  if (!cart) {
    // create cart fot logged user with product
    cart = await addToCartDB({
      customer: req.user._id,
      seller: product.seller,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product._id.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart,  push product to cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  // Calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();

  const newCart = await getCartByIdDB(cart._id);

  const response = {
    message: "Product added to cart successfully",
    numOfCartItems: cart.cartItems.length,
    cart: newCart,
  };

  sendSuccessResponse(res, response, 200);
});

const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { cartId, itemId, type } = req.body;

  const cart = await getCartDB({ customer: req.user._id, _id: cartId });

  if (!cart) {
    return next(new ApiError(`There is no cart for this id  : ${cartId}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];

    type == "-" ? cartItem.quantity-- : cartItem.quantity++;

    if (cartItem.quantity == 0) {
      cart.cartItems.splice(itemIndex, 1);
    } else {
      cart.cartItems[itemIndex] = cartItem;
    }
  } else {
    return next(new ApiError(`there is no item for this id :${itemId}`, 404));
  }

  if (cart.cartItems.length == 0) {
    await deleteCartDB({ _id: cartId });

    const response = { message: "cart deleted" };

    return sendSuccessResponse(res, response, 200);
  }

  calcTotalCartPrice(cart);
  await cart.save();

  const newCart = await getCartByIdDB(cart._id);

  const response = { numOfCartItems: cart.cartItems.length, cart: newCart };

  sendSuccessResponse(res, response, 200);
});

const removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const { cartId, itemId } = req.body;

  const cart = await getCartDB({ customer: req.user._id, _id: cartId });

  if (!cart) {
    return next(new ApiError(`There is no cart for this id  : ${cartId}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex > -1) {
    cart.cartItems.splice(itemIndex, 1);
  } else {
    return next(new ApiError(`there is no item for this id :${itemId}`, 404));
  }

  if (cart.cartItems.length == 0) {
    await deleteCartDB({ _id: cartId });

    const response = { message: "cart deleted" };

    return sendSuccessResponse(res, response, 200);
  }

  calcTotalCartPrice(cart);
  await cart.save();

  const newCart = await getCartByIdDB(cartId);

  const response = { numOfCartItems: cart.cartItems.length, cart: newCart };

  sendSuccessResponse(res, response, 200);
});

const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await deleteCartDB({
    customer: req.user._id,
    _id: req.params.cartId,
  });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this id  : ${req.params.cartId}`, 404)
    );
  }

  const response = { message: "cart deleted successfully" };

  sendSuccessResponse(res, response, 200);
});

module.exports = {
  addProductToCart,
  getCustomerCart_S,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
};
