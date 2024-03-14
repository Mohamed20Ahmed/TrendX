const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const addToCartValidator = [
  check("productId").isMongoId().withMessage("Invalid ID formate"),

  validatorMiddleware,
];


const deleteFromCartValidator = [
  check("productId").isMongoId().withMessage("Invalid ID formate"),

  validatorMiddleware,
];

module.exports = {
    addToCartValidator,
    deleteFromCartValidator,
};
