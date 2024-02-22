const ApiError = require("../utils/apiError");
const { sendSuccessResponse } = require("../utils/responseHandler");

const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const orderRoute = require("./orderRoute");
const reviewRoute = require("./reviewRoute");

const mountRoutes = (app) => {
  app.use("/auth", authRoute);
  app.use("/users", userRoute);
  app.use("/orders", orderRoute);
  // app.use("/chat", chatRoute);
  app.use("/reviews", reviewRoute);

  app.get("/", (req, res) => {
    sendSuccessResponse(res, { message: "Hello form server side!" }, 200);
  });

  app.all("*", (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
};

module.exports = mountRoutes;
