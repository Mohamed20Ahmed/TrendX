const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const { sendSuccessResponse } = require("../utils/responseHandler");

const addUser = asyncHandler(async (req, res) => {
  const name = req.body.name;

  const user = await userModel.create({ name });
  sendSuccessResponse(res, { user, message: "user created successfully" }, 201);
});

module.exports = { addUser };
