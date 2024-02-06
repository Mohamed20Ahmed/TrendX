const asyncHandler = require("express-async-handler");
const uuid = require("uuid");
const sharp = require("sharp");

const { hash, compare } = require("../utils/bcryptService");
const userModel = require("../models/userModel");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { sendSuccessResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// Upload shop image
const uploadShopImage = uploadSingleImage("shopImage");

// Image processing
const resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `shop-${uuid.v4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/shops/${fileName}`);

    req.body.shopImage = fileName;
  }

  next();
});

const getCustomer_S = asyncHandler(async (req, res, next) => {
  const customerExcludedFields = "-password -__v";

  // get specific customer

  if (req.query.email) {
    const customer = await userModel
      .findOne({ email: req.query.email })
      .select(customerExcludedFields);

    if (!customer) {
      return next(new ApiError("customer not found", 404));
    }

    return sendSuccessResponse(res, { customer }, 200);
  }

  // get all customers

  req.query.fields = customerExcludedFields;

  // get count of customers to use it in pagination results
  const documentsCounts = await userModel
    .find({ role: "customer" })
    .countDocuments();

  // apply api features
  const apiFeatures = new ApiFeatures(
    userModel.find({ role: "customer" }),
    req.query
  )
    .paginate(documentsCounts)
    .filter()
    .search("users")
    .limitFields()
    .sort();

  // result from api features
  const { mongooseQuery, paginationResult } = apiFeatures;

  const customers = await mongooseQuery;

  const response = { paginationResult, customers };

  sendSuccessResponse(res, response, 200);
});

const getSeller_S = asyncHandler(async (req, res, next) => {
  const sellerExcludedFields = "-password -__v";

  // get specific seller

  if (req.query.email) {
    const seller = await userModel
      .findOne({ email: req.query.email })
      .select(sellerExcludedFields);

    if (!seller) {
      return next(new ApiError("seller not found", 404));
    }

    return sendSuccessResponse(res, { seller }, 200);
  }

  // get all sellers

  req.query.fields = sellerExcludedFields;

  // get count of sellers to use it in pagination results
  const documentsCounts = await userModel
    .find({ role: "seller" })
    .countDocuments();

  // apply api features
  const apiFeatures = new ApiFeatures(
    userModel.find({ role: "seller" }),
    req.query
  )
    .paginate(documentsCounts)
    .filter()
    .search("users")
    .limitFields()
    .sort();

  // result from api features
  const { mongooseQuery, paginationResult } = apiFeatures;

  const sellers = await mongooseQuery;

  const response = { paginationResult, sellers };

  sendSuccessResponse(res, response, 200);
});

const getUserAccount = asyncHandler(async (req, res, next) => {
  const excludedFields = "-password -__v";

  const user = await userModel.findById(req.user.id).select(excludedFields);

  if (!user) {
    return next(new ApiError("user not found"));
  }

  sendSuccessResponse(res, { user }, 200);
});

const updateStatus = asyncHandler(async (req, res, next) => {
  const email = req.params.email;
  const { active } = req.body;

  if (!email) {
    return next(new ApiError("user email is required"));
  }

  const user = await userModel.findOneAndUpdate({ email }, { active });

  if (!user) {
    return next(new ApiError("user not found"));
  }

  const response = { message: "user status updated" };

  sendSuccessResponse(res, response, 200);
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const email = req.params.email;

  if (!email) {
    return next(new ApiError("user email is required"));
  }

  const user = await userModel.findOneAndDelete({ email });

  if (!user) {
    return next(new ApiError("user not found"));
  }

  const response = { message: "user deleted successfully" };

  sendSuccessResponse(res, response, 204);
});

const updateCustomerAccount = asyncHandler(async (req, res, next) => {
  const { name, slug, email, phoneNumber, address } = req.body;

  if (email) {
    const emailExistence = await userModel.findOne({ email }).email;

    // check if email not exists in database
    if (emailExistence && emailExistence != req.user.email) {
      return next(new ApiError("email already exists", 400));
    }
  }

  // Update customer information
  const customer = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { name, slug, email, phoneNumber, address }
  );

  if (!customer) {
    return next(new ApiError("Customer not found"));
  }

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

  if (email) {
    const emailExistence = await userModel.findOne({ email }).email;

    // Check if email not exists in database
    if (emailExistence && emailExistence != req.user.email) {
      return next(new ApiError("email already exists", 400));
    }
  }

  // Update seller information
  const seller = await userModel.findOneAndUpdate(
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

  if (!seller) {
    return next(new ApiError("Seller not found"));
  }

  const response = { message: "Seller updated successfully" };

  sendSuccessResponse(res, response, 200);
});

const updateAdminAccount = asyncHandler(async (req, res, next) => {
  const { name, slug, email, phoneNumber } = req.body;

  if (email) {
    const emailExistence = await userModel.findOne({ email }).email;

    if (emailExistence && emailExistence != req.user.email) {
      return next(new ApiError("Email already exists", 400));
    }
  }

  const admin = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      name,
      slug,
      email,
      phoneNumber,
    }
  );

  if (!admin) {
    return next(new ApiError("Admin not found"));
  }

  const response = { message: "Admin updated successfully" };

  sendSuccessResponse(res, response, 200);
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!(await compare(oldPassword, req.user.password))) {
    return next(new ApiError("Incorrect password", 400));
  }

  const hashedPassword = await hash(newPassword);

  await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { password: hashedPassword }
  );

  sendSuccessResponse(res, "Password updated successfully", 200);
});

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
