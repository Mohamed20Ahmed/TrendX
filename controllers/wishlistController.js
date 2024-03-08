const asyncHandler = require("express-async-handler");
// const User = require('../models/wishlistModel');
const ApiError = require("../utils/apiError");
const { sendSuccessResponse } = require("../utils/responseHandler");

const {
  getWishlistDB,
  getAllWishlistDB,
  addToWhishlistDB,
  deleteFromWishlistDB,
} = require("../database/wishlistDB");


const addProductToWishlist = asyncHandler(async (req, res, next) => {
  const customer = req.user._id;

  const product = req.body.productId;

  const wishlist = await getWishlistDB({ customer });

  if (!wishlist) {
    // create cart fot logged user with product
    await addToWhishlistDB({
      customer,
      wishlist:[{ product}]
  
    });
  }

  else {
  const productIndex = wishlist.wishlist.findIndex(
    (item) =>item.product._id.toString() === product 
  );

  if (productIndex > -1) {

    return next(new ApiError("product is already exist", 400));
  }
  else {
    // product not exist in cart,  push product to cartItems array
    wishlist.wishlist.push({ product });
  } await wishlist.save();} 

  
  const response = { message: "Product added successfully to your wishlist." };

  sendSuccessResponse(res, response, 200);
});

// const removeProductFromWishlist = asyncHandler(async (req, res, next) => {
//   // $pull => remove productId from wishlist array if productId exist
//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $pull: { wishlist: req.params.productId },
//     },
//     { new: true }
//   );

//   res.status(200).json({
//     status: 'success',
//     message: 'Product removed successfully from your wishlist.',
//     data: user.wishlist,
//   });
// });

const removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const product = req.params.productId;
  const customer = req.user._id;
  const wishlist = await getWishlistDB({ customer });
  if (!wishlist) {
    // create cart fot logged user with product
    return next(new ApiError("Product not found in wishlist", 404));

  }

  else {
  const productIndex = wishlist.wishlist.findIndex(
    (item) =>item.product._id.toString() === product 
  );

  if (productIndex > -1) {

    wishlist.wishlist.splice(productIndex, 1);
  }
  else {
    // product not exist in cart,  push product to cartItems array
    return next(new ApiError("product doesn't exist", 400));
  } await wishlist.save();}

  const response = { message: "product deleted successfully from wishlist" };
  sendSuccessResponse(res, response, 200);
});


const getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const customer = req.user._id;
  const wishlist = await getWishlistDB({customer});
  const response = { list:wishlist.wishlist};
  sendSuccessResponse(res, response, 200);


});

module.exports = {
  getLoggedUserWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
};
