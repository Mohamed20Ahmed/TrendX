const router = require("express").Router();

const {
  registerAsCustomerValidator,
  registerAsSellerValidator,
  loginValidator,
} = require("../validators/authValidator");
const {
  registerAsCustomer,
  registerAsSeller,
  login,
} = require("../controllers/authController");
const {
  uploadShopImage,
  resizeImage,
} = require("../controllers/userController");

router.post(
  "/registerAsCustomer",
  registerAsCustomerValidator,
  registerAsCustomer
);

router.post(
  "/registerAsSeller",
  uploadShopImage,
  resizeImage,
  registerAsSellerValidator,
  registerAsSeller
);

router.post("/login", loginValidator, login);

module.exports = router;
