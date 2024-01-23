const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const uuid = require("uuid");
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");

const userModel = require("../models/userModel");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { sendSuccessResponse } = require("../utils/responseHandler");

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

// Add user to database
const addUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, shopImage } = req.body;

  const user = await userModel.create({
    name,
    slug: slugify(name),
    email,
    password,
    role,
    shopImage,
  });
  sendSuccessResponse(res, { user, message: "user created successfully" }, 201);
});

module.exports = { uploadShopImage, resizeImage, addUser };
