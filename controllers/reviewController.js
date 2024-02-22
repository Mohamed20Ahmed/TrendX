const asyncHandler = require("express-async-handler");

const {
  getReviewByIdDB,
  getReviewDB,
  getProductReviewsDB,
  createReviewDB,
  updateReviewDB,
  deleteReviewDB,
} = require("../database/reviewDB");
const { sendSuccessResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/apiError");

const getReview_S = asyncHandler(async (req, res, next) => {
  const reviewExcludedFields = "-__v";

  // get specific review

  if (req.query.reviewId) {
    const review = await getReviewByIdDB(reviewId, reviewExcludedFields);

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

  const { title, ratings, productId } = req.body;

  const oldReview = await getReviewDB({
    customer: customerId,
    product: productId,
  });

  if (oldReview) {
    return next(new ApiError("The review has already been created"));
  }

  await createReviewDB({
    title,
    ratings,
    customer: customerId,
    product: productId,
  });

  const response = { message: "Review created successfully" };

  sendSuccessResponse(res, response, 201);
});

const updateStatus = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  const { active } = req.body;

  if (!email) {
    return next(new ApiError("user email is required"));
  }

  const user = await updateUserDB({ email }, { active });

  if (!user) {
    return next(new ApiError("user not found"));
  }

  const response = { message: "user status updated" };

  sendSuccessResponse(res, response, 200);
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const email = req.params.email;

  if (!email) {
    return next(new ApiError("user email is required", 400));
  }

  const user = await deleteUserDB({ email });

  if (!user) {
    return next(new ApiError("user not found", 404));
  }

  const response = { message: "user deleted successfully" };

  sendSuccessResponse(res, response, 204);
});

const updateCustomerAccount = asyncHandler(async (req, res, next) => {
  const { name, slug, email, phoneNumber, address } = req.body;

  await uniqueFieldsExistence(
    { email: req.user.email, phoneNumber: req.user.phoneNumber },
    { email, phoneNumber }
  );

  // Update customer information
  await updateUserDB(
    { _id: req.user._id },
    { name, slug, email, phoneNumber, address }
  );

  const response = { message: "Customer updated successfully" };

  sendSuccessResponse(res, response, 200);
});

const updateSellerAccount = asyncHandler(async (req, res, next) => {
  const {
    name,
    slug,
    email,
    phoneNumber,
    address,
    creditCard,
    shopName,
    shopImage,
  } = req.body;

  await uniqueFieldsExistence(
    {
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      shopName: req.user.shopName,
    },
    { email, phoneNumber, shopName }
  );

  // Update seller information
  await updateUserDB(
    { _id: req.user._id },
    {
      name,
      slug,
      email,
      phoneNumber,
      address,
      creditCard,
      shopName,
      shopImage,
    }
  );

  const response = { message: "Seller updated successfully" };

  sendSuccessResponse(res, response, 200);
});

const updateAdminAccount = asyncHandler(async (req, res, next) => {
  const { name, slug, email, phoneNumber } = req.body;

  await uniqueFieldsExistence(
    { email: req.user.email, phoneNumber: req.user.phoneNumber },
    { email, phoneNumber }
  );

  await updateUserDB(
    { _id: req.user._id },
    {
      name,
      slug,
      email,
      phoneNumber,
    }
  );

  const response = { message: "Admin updated successfully" };

  sendSuccessResponse(res, response, 200);
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!(await compare(oldPassword, req.user.password))) {
    return next(new ApiError("Incorrect password", 400));
  }

  const hashedPassword = await hash(newPassword);

  await updateUserDB(
    { _id: req.user._id },
    { password: hashedPassword, passwordChangedAt: Date.now() }
  );

  sendSuccessResponse(res, "Password updated successfully", 200);
});

const uniqueFieldsExistence = async (userData, fields) => {
  if (fields.email) {
    const emailExistence = await getUserDB({ email: fields.email });

    // check if email not exists in database
    if (emailExistence && emailExistence.email != userData.email) {
      throw new ApiError("email already exists", 400);
    }
  }

  if (fields.phoneNumber) {
    const phoneNumberExistence = await getUserDB({
      phoneNumber: fields.phoneNumber,
    });

    // check if phoneNumber not exists in database
    if (
      phoneNumberExistence &&
      phoneNumberExistence.phoneNumber != userData.phoneNumber
    ) {
      throw new ApiError("phoneNumber already exists", 400);
    }
  }

  if (fields.shopName) {
    const shopNameExistence = await getUserDB({ shopName: fields.shopName });

    // check if phoneNumber not exists in database
    if (shopNameExistence && shopNameExistence.shopName != userData.shopName) {
      throw new ApiError("shopName already exists", 400);
    }
  }
};

module.exports = {
  uploadShopImage,
  resizeImage,
  getCustomer_S,
  getSeller_S,
  getUserAccount,
  updateStatus,
  deleteUser,
  updateSellerAccount,
  updateCustomerAccount,
  updateAdminAccount,
  changePassword,
};
