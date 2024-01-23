const router = require("express").Router();

const {
  uploadShopImage,
  resizeImage,
  addUser,
} = require("../controllers/userController");
const { addUserValidator } = require("../validators/userValidator");

router.route("/").post(uploadShopImage, resizeImage, addUser);

module.exports = router;
