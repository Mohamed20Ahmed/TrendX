const ApiError = require("../utils/apiError");
const { validationResult } = require("express-validator");

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError({ errors: errors.array() }, 400));
  }
  next();
};

module.exports = validatorMiddleware;
