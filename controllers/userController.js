const asyncHandler = require("express-async-handler");
const uuid = require("uuid");
const sharp = require("sharp");

const {
  getUserByIdDB,
  getUserDB,
  getUsersByRoleDB,
  updateUserDB,
  deleteUserDB,
} = require("../database/userDB");
const { hash, compare } = require("../utils/bcryptService");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { sendSuccessResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/apiError");

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
    const customer = await getUserDB(
      { email: req.query.email, role: "customer" },
      customerExcludedFields
    );

    if (!customer) {
      return next(new ApiError("customer not found", 404));
    }

    return sendSuccessResponse(res, { customer }, 200);
  }

  // get all customers

  req.query.fields = req.query.fields || customerExcludedFields;

  const response = await getUsersByRoleDB("customer", req);

  sendSuccessResponse(res, response, 200);
});

const getSeller_S = asyncHandler(async (req, res, next) => {
  const sellerExcludedFields = "-password -__v";

  // get specific seller

  if (req.query.email) {
    const seller = await getUserDB(
      { email: req.query.email, role: "seller" },
      sellerExcludedFields
    );

    if (!seller) {
      return next(new ApiError("seller not found", 404));
    }

    return sendSuccessResponse(res, { seller }, 200);
  }

  // get all sellers
  req.query.fields = req.query.fields || sellerExcludedFields;

  const response = await getUsersByRoleDB("seller", req);

  sendSuccessResponse(res, response, 200);
});

const getUserAccount = asyncHandler(async (req, res, next) => {
  const excludedFields = "-password -__v";

  const user = await getUserByIdDB(req.user.id, excludedFields);

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
  const { name, email, phoneNumber, address } = req.body;

  await uniqueFieldsExistence(
    { email: req.user.email, phoneNumber: req.user.phoneNumber },
    { email, phoneNumber }
  );

  // Update customer information
  await updateUserDB(
    { _id: req.user._id },
    { name, email, phoneNumber, address }
  );

  const response = { message: "Customer updated successfully" };

  sendSuccessResponse(res, response, 200);
});

const updateSellerAccount = asyncHandler(async (req, res, next) => {
  const { name, email, phoneNumber, address, shopName, shopImage } = req.body;

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
      email,
      phoneNumber,
      address,
      shopName,
      shopImage,
    }
  );

  const response = { message: "Seller updated successfully" };

  sendSuccessResponse(res, response, 200);
});

const updateAdminAccount = asyncHandler(async (req, res, next) => {
  const { name, email, phoneNumber } = req.body;

  await uniqueFieldsExistence(
    { email: req.user.email, phoneNumber: req.user.phoneNumber },
    { email, phoneNumber }
  );

  await updateUserDB(
    { _id: req.user._id },
    {
      name,
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
