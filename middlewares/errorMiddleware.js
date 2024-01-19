const { sendErrorResponse } = require("../utils/responseHandler");

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  sendErrorResponse(res, err);
};

module.exports = errorMiddleware;
