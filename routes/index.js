const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const ApiError = require("../utils/apiError");
const { sendSuccessResponse } = require("../utils/responseHandler");

const mountRoutes = (app) => {
  app.use("/auth", authRoute);
  app.use("/users", userRoute);

  app.get("/", (req, res) => {
    sendSuccessResponse(res, { message: "Hello form server side!" }, 200);
  });

  app.all("*", (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
};

module.exports = mountRoutes;
