const asyncHandler = require("express-async-handler");

const { getUserDB, createUserDB } = require("../database/userDB");
const { hash, compare } = require("../utils/bcryptService");
const { jwtGenerator } = require("../utils/jwtService");
const { sendSuccessResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/apiError");

const createUser = async (data) => {
  const hashedpassword = await hash(data.password);

  const user = await createUserDB({ ...data, password: hashedpassword });

  const token = await jwtGenerator({
    email: user.email,
    id: user._id,
    role: user.role,
  });

  return token;
};

const registerAsCustomer = asyncHandler(async (req, res, next) => {
  const customer = {
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    role: "customer",
  };

  await uniqueFieldsExistence({
    email: customer.email,
    phoneNumber: customer.phoneNumber,
  });

  const token = await createUser(customer);

  const response = { token, message: "Customer created successfully" };

  sendSuccessResponse(res, response, 201);
});

const registerAsSeller = asyncHandler(async (req, res, next) => {
  const seller = {
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    creditCard: req.body.creditCard,
    shopName: req.body.shopName,
    shopImage: req.body.shopImage,
    role: "seller",
  };

  await uniqueFieldsExistence({
    email: seller.email,
    phoneNumber: seller.phoneNumber,
    shopName: seller.shopName,
  });

  const token = await createUser(seller);

  const response = { token, message: "Seller created successfully" };

  sendSuccessResponse(res, response, 201);
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await getUserDB({ email });

  if (!user || !(await compare(password, user.password))) {
    return next(new ApiError("Incorrect email or password", 400));
  }

  if (user.active === false) {
    return next(
      new ApiError("You are blocked from accessing this account", 400)
    );
  }

  const token = await jwtGenerator({
    email: user.email,
    id: user._id,
    role: user.role,
  });

  sendSuccessResponse(res, { token }, 200);
});

const uniqueFieldsExistence = async (fields) => {
  if (fields.email) {
    const emailExistence = await getUserDB({ email: fields.email });

    // check if email not exists in database
    if (emailExistence) {
      throw new ApiError("email already exists", 400);
    }
  }

  if (fields.phoneNumber) {
    const phoneNumberExistence = await getUserDB({
      phoneNumber: fields.phoneNumber,
    });

    // check if phoneNumber not exists in database
    if (phoneNumberExistence) {
      throw new ApiError("phoneNumber already exists", 400);
    }
  }

  if (fields.shopName) {
    const shopNameExistence = await getUserDB({ shopName: fields.shopName });
    // check if phoneNumber not exists in database
    if (shopNameExistence) {
      throw new ApiError("shopName already exists", 400);
    }
  }
};

module.exports = {
  registerAsCustomer,
  registerAsSeller,
  login,
};
