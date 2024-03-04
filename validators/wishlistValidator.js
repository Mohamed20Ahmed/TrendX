const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const addToWishlistValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),

  validatorMiddleware,
];

const getwishListValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),

  validatorMiddleware,
];

const deleteFromWishListValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),

  validatorMiddleware,
];

module.exports = {
  addToWishlistValidator,
  getwishListValidator,
  deleteFromWishListValidator,
};
