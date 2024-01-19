const { body } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const addUserValidator = [
  body("name").notEmpty().withMessage("Please enter your name"),
  validatorMiddleware,
];

module.exports = { addUserValidator };
