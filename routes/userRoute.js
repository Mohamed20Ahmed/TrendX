const router = require("express").Router();
const { addUser } = require("../controllers/userController");
const { addUserValidator } = require("../validators/userValidator");

router.route("/").post(addUserValidator, addUser);

module.exports = router;
