const asyncHandler = require("express-async-handler");

const {
  getReviewByIdDB,
  getReviewDB,
  getProductReviewsDB,
  createReviewDB,
  updateReviewDB,
  deleteReviewDB,
} = require("../database/reviewDB");
const { getProductByIdDB } = require("../database/productDB");
const { sendSuccessResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/apiError");

const getReview_S = asyncHandler(async (req, res, next) => {
  const reviewExcludedFields = "-__v";

  // get specific review

  if (req.query.reviewId) {
    const review = await getReviewByIdDB(
      req.query.reviewId,
      reviewExcludedFields
    );

    if (!review) {
      return next(new ApiError("review not found", 404));
    }

    return sendSuccessResponse(res, { review }, 200);
  }

  // get product reviews

  req.query.fields = req.query.fields || reviewExcludedFields;
  req.query.productId = req.query.productId || "*";

  const reviews = await getProductReviewsDB(req);

  const response = { reviews };

  sendSuccessResponse(res, response, 200);
});

const createReview = asyncHandler(async (req, res, next) => {
  const customerId = req.user._id;

  const { title, rating, productId } = req.body;

  const product = await getProductByIdDB(productId);

  if (!product) {
    return next(new ApiError("Product not found"));
  }

  const oldReview = await getReviewDB({
    customer: customerId,
    product: productId,
  });

  if (oldReview) {
    return next(new ApiError("The review has already been created"));
  }

  await createReviewDB({
    title,
    rating,
    customer: customerId,
    product: productId,
  });

  // calcutate newRating after new rate added
  let newRating =
    (product.ratingsAverage * product.ratingsQuantity + rating) /
    (product.ratingsQuantity + 1);

  newRating = parseFloat(newRating.toFixed(1));

  product.ratingsAverage = newRating;
  product.ratingsQuantity++;

  await product.save();

  const response = { message: "Review created successfully" };

  sendSuccessResponse(res, response, 201);
});

const updateReview = asyncHandler(async (req, res, next) => {
  const customerId = req.user._id;

  const reviewId = req.params.reviewId;

  const { title, rating } = req.body;

  const review = await getReviewByIdDB(reviewId);

  if (!review) {
    return next(new ApiError("Review not found"));
  }

  const product = await getProductByIdDB(review.product);

  if (!product) {
    return next(new ApiError("Product not found"));
  }

  if (review.customer._id.toString() !== customerId.toString()) {
    return next(new ApiError("You cannot update this review"));
  }

  await updateReviewDB({ _id: review._id }, { title, rating });

  if (rating) {
    // calcutate newRating after old rate updated
    let newRating =
      (product.ratingsAverage * product.ratingsQuantity -
        review.rating +
        rating) /
      product.ratingsQuantity;

    newRating = parseFloat(newRating.toFixed(1));

    product.ratingsAverage = newRating;

    await product.save();
  }

  const response = { message: "Review updated successfully" };

  sendSuccessResponse(res, response, 200);
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const reviewId = req.params.reviewId;

  const review = await getReviewByIdDB(reviewId);

  if (!review) {
    return next(new ApiError("Review not found"));
  }

  const product = await getProductByIdDB(review.product);

  if (!product) {
    return next(new ApiError("Product not found"));
  }

  if (
    review.customer._id.toString() !== user._id.toString() &&
    user.role !== "admin"
  ) {
    return next(new ApiError("You cannot delete this review"));
  }

  await deleteReviewDB({ _id: review._id });

  // calcutate newRating after old rate deleted
  let newRating =
    (product.ratingsAverage * product.ratingsQuantity - review.rating) /
    (product.ratingsQuantity - 1);

  newRating = parseFloat(newRating.toFixed(1));

  product.ratingsAverage = newRating;
  product.ratingsQuantity--;

  await product.save();

  const response = { message: "Review deleted successfully" };

  sendSuccessResponse(res, response, 200);
});

module.exports = {
  getReview_S,
  createReview,
  updateReview,
  deleteReview,
};
