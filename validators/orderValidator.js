const { body, param } = require("express-validator");

const validatorMiddleware = require("../middlewares/validatorMiddleware");

const updateOrderStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Please enter status")
    .isIn(["pending", "accepted", "delivered", "canceled"])
    .withMessage(
      "Status must be one of: pending, accepted, delivered, canceled"
    ),

  validatorMiddleware,
];
const validateCartId = [
  param("cartId").isMongoId().withMessage("Invalid cart id format"),

  validatorMiddleware,
];
module.exports = { updateOrderStatusValidator, validateCartId };
