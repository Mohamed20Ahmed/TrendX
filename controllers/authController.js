const asyncHandler = require("express-async-handler");

const userModel = require("../models/userModel");
const { hash, compare } = require("../utils/bcryptService");
const { jwtGenerator } = require("../utils/jwtService");
const { sendSuccessResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/apiError");

const createUser = async (data) => {
  const userExistence = await userModel.findOne({ email: data.email });

  if (userExistence) {
    throw new ApiError("User already exists", 400);
  }

  const hashedpassword = await hash(data.password);

  const user = await userModel.create({ ...data, password: hashedpassword });

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

  const token = await createUser(seller);

  const response = { token, message: "Seller created successfully" };

  sendSuccessResponse(res, response, 201);
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email: email });

  if (!user || !(await compare(password, user.password))) {
    return next(new ApiError("Inncorrect email or password", 400));
  }

  const token = await jwtGenerator({
    email: user.email,
    id: user._id,
    role: user.role,
  });

  sendSuccessResponse(res, { token }, 200);
});

module.exports = {
  registerAsCustomer,
  registerAsSeller,
  login,
};
