const { sendSuccessResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/apiError");
const userRoute = require("./userRoute");

const mountRoutes = (app) => {
  app.use("/users", userRoute);

  app.get("/", (req, res) => {
    sendSuccessResponse(res, { message: "Hello form server side!" }, 200);
  });

  app.all("*", (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
};

module.exports = mountRoutes;
