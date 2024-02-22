const router = require("express").Router();

const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
  uploadShopImage,
  resizeImage,
  getCustomer_S,
  getSeller_S,
  getUserAccount,
  updateStatus,
  deleteUser,
  updateSellerAccount,
  updateCustomerAccount,
  updateAdminAccount,
  changePassword,
} = require("../controllers/userController");
const {
  updateSellerValidator,
  updateCustomerValidator,
  updateAdminValidator,
  updateStatusValidator,
  changePasswordValidator,
} = require("../validators/userValidator");

router.use(protect);

// user routes

router.get(
  "/account",
  allowedTo("customer", "seller", "admin"),
  getUserAccount
);

router.patch(
  "/password",
  allowedTo("customer", "seller", "admin"),
  changePasswordValidator,
  changePassword
);

// customer routes

router.patch(
  "/customers/account",
  allowedTo("customer"),
  updateCustomerValidator,
  updateCustomerAccount
);

// seller routes

router.patch(
  "/sellers/account",
  allowedTo("seller"),
  uploadShopImage,
  resizeImage,
  updateSellerValidator,
  updateSellerAccount
);

//admin routes

router.patch(
  "/admins/account",
  allowedTo("admin"),
  updateAdminValidator,
  updateAdminAccount
);

router.get("/sellers", allowedTo("admin"), getSeller_S);

router.get("/customers", allowedTo("admin"), getCustomer_S);

router.patch(
  "/status/:email",
  allowedTo("admin"),
  updateStatusValidator,
  updateStatus
);

router.delete("/account/:email", allowedTo("admin"), deleteUser);

module.exports = router;
