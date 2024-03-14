const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const { sendSuccessResponse } = require("../utils/responseHandler");


const {
    getCartDB,
    getCartByIdDB,
    getAllCartDB,
    addToCartDB, 
    updateCartDB,
    deleteCartByIdDB  
} = require("../database/cartDB");


const {getProductByIdDB}= require("../database/productDB")

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  return totalPrice;
};





const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await getProductByIdDB(productId);

  // 1) Get Cart for logged user
  let cart = await getCartDB({ customer: req.user._id });

  if (!cart) {
    // create cart fot logged user with product
    cart  = await addToCartDB
    ({
        customer: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
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

  const response = { message: 'Product added to cart successfully',
  numOfCartItems: cart.cartItems.length,cart, };
  sendSuccessResponse(res, response, 200);
});



const getLoggedCustomerCart = asyncHandler(async (req, res, next) => {
  const cart = await getCartDB({ customer: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this customer  : ${req.user._id}`, 404)
    );
  }

  const response = { numOfCartItems: cart.cartItems.length, cart, };
  sendSuccessResponse(res, response, 200);
});


const removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await updateCartDB(
    { customer: req.user._id },
    {
      $pull: { cartItems: { product: req.params.productId } },
    },
    { new: true }
  );
  
  calcTotalCartPrice(cart);
  await cart.save();


  const response = { numOfCartItems: cart.cartItems.length, cart, };
  sendSuccessResponse(res, response, 200);
});


const clearCart = asyncHandler(async (req, res, next) => {
  await deleteCartByIdDB  
  ({ customer: req.user._id });
  sendSuccessResponse(res, 200);
  
});


const reduceCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await getCartDB
  ({ customer: req.user._id });
  if (!cart) {
    return next(new ApiError(`there is no cart for customer ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`there is no item for this id :${req.params.itemId}`, 404)
    );
  }

  calcTotalCartPrice(cart);

  await cart.save();

  const response = { numOfCartItems: cart.cartItems.length, cart, };
  sendSuccessResponse(res, response, 200);
});

module.exports={
    addProductToCart,
    getLoggedCustomerCart,
    removeSpecificCartItem,
    clearCart,
    reduceCartItemQuantity
}
