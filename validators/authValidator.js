const { body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validatorMiddleware");

const registerAsCustomerValidator = [
  body("name").notEmpty().withMessage("Please enter your name"),

  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Please enter your phone number")
    .isMobilePhone("ar-EG")
    .withMessage("Please enter valid egyptian phone number"),

  body("address", "Please enter your address").notEmpty().isObject(),
  body("address.street", "street in address is required").notEmpty(),
  body("address.city", "city in address is required").notEmpty(),

  validatorMiddleware,
];

const registerAsSellerValidator = [
  body("name").notEmpty().withMessage("Please enter your name"),

  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Please enter your phone number")
    .isMobilePhone("ar-EG")
    .withMessage("Please enter valid egyptian phone number"),

  body("address", "Please enter your address").notEmpty().isObject(),
  body("address.street", "street in address is required").notEmpty(),
  body("address.city", "city in address is required").notEmpty(),

  body("shopName").notEmpty().withMessage("Please enter your shop name"),

  validatorMiddleware,
];

const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password").notEmpty().withMessage("Please enter your password"),

  validatorMiddleware,
];

const forgotPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  validatorMiddleware,
];

const verifyResetCodeValidator = [
  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("resetCode")
    .notEmpty()
    .withMessage("Please Reset Code")
    .isLength({ min: 6, max: 6 })
    .withMessage("Reset Code must be at 6 digits"),

  validatorMiddleware,
];

const resetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("newPassword")
    .notEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),

  validatorMiddleware,
];

module.exports = {
  registerAsCustomerValidator,
  registerAsSellerValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
};
