const asyncHandler = require("express-async-handler");
// const User = require('../models/wishlistModel');
const ApiError = require("../utils/apiError");
const { sendSuccessResponse } = require("../utils/responseHandler");

const {
  getWhishlistDB,
  getAllWishlistDB,
  addToWhishlistDB,
  deleteFromWishlistDB,
} = require("../database/wishlistDB");

const { getProductByIdDB } = require("../database/productDB");

const addProductToWishlist = asyncHandler(async (req, res, next) => {
  const customer = req.user._id;

  const wishlist = req.body.productId;

  const product = await getWhishlistDB({ customer, wishlist });
  if (product) {
    return next(new ApiError("product is already exist", 400));
  }
  await addToWhishlistDB({
    wishlist,
  });
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
  const productId = req.params.productId;

  const product = await getProductByIdDB(productId);

  if (!product) {
    return next(new ApiError("Product not found in wishlist", 404));
  }

  if (product.customer._id.toString() !== req.user._id.toString()) {
    return next(new ApiError("You cannot delete this product from wishlist"));
  }

  await deleteFromWishlistDB({ _id: product._id });
  const response = { message: "product deleted successfully from wishlist" };
  sendSuccessResponse(res, response, 200);
});

const getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});

module.exports = {
  getLoggedUserWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
};
