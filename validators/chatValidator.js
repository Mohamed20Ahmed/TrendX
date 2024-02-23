const { body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validatorMiddleware");
const sendMessageValidator = [
  body("message").notEmpty().withMessage("Please enter message"),

  validatorMiddleware,
];
module.exports = {
  sendMessageValidator,
};
