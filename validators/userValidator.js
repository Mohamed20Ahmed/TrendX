const { body } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../middlewares/validatorMiddleware");

const updateCustomerValidator = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Please enter your name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  body("email")
    .optional()
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("phoneNumber")
    .optional()
    .notEmpty()
    .withMessage("Please enter your phone number")
    .isMobilePhone("ar-EG")
    .withMessage("Please enter valid egyptian phone number"),

  body("address")
    .optional()
    .notEmpty()
    .withMessage("Please enter your address"),

  validatorMiddleware,
];

const updateSellerValidator = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Please enter your name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  body("email")
    .optional()
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("phoneNumber")
    .optional()
    .notEmpty()
    .withMessage("Please enter your phone number")
    .isMobilePhone("ar-EG")
    .withMessage("Please enter valid egyptian phone number"),

  body("address")
    .optional()
    .notEmpty()
    .withMessage("Please enter your address"),

  body("shopName")
    .optional()
    .notEmpty()
    .withMessage("Please enter your shop name"),

  validatorMiddleware,
];

const updateAdminValidator = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Please enter your name")
    .custom((value, { req }) => {
      console.log(value);
      req.body.slug = slugify(value);
      return true;
    }),

  body("email")
    .optional()
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("phoneNumber")
    .optional()
    .notEmpty()
    .withMessage("Please enter your phone number")
    .isMobilePhone("ar-EG")
    .withMessage("Please enter valid egyptian phone number"),

  validatorMiddleware,
];

const updateStatusValidator = [
  body("active")
    .notEmpty()
    .withMessage("Please enter value")
    .isBoolean()
    .custom((value) => typeof value === "boolean")
    .withMessage("active must be boolean (true or false)"),

  validatorMiddleware,
];

const changePasswordValidator = [
  body("oldPassword").notEmpty().withMessage("Please enter old password"),

  body("newPassword")
    .notEmpty()
    .withMessage("Please enter new password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),

  validatorMiddleware,
];

module.exports = {
  updateCustomerValidator,
  updateSellerValidator,
  updateAdminValidator,
  updateStatusValidator,
  changePasswordValidator,
};
