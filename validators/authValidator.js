const { body } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../middlewares/validatorMiddleware");

const registerAsCustomerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Please enter your name")
    .custom((value, { req }) => {
      console.log(value);
      req.body.slug = slugify(value);
      return true;
    }),

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

  body("address").notEmpty().withMessage("Please enter your address"),

  validatorMiddleware,
];

const registerAsSellerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Please enter your name")
    .custom((value, { req }) => {
      console.log(value);
      req.body.slug = slugify(value);
      return true;
    }),

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

  body("address").notEmpty().withMessage("Please enter your address"),

  body("creditCard")
    .notEmpty()
    .withMessage("Please enter your credit card")
    .isCreditCard()
    .withMessage("Please enter a valid credit card number"),

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

module.exports = {
  registerAsCustomerValidator,
  registerAsSellerValidator,
  loginValidator,
};
