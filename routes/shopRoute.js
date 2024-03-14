const router = require("express").Router({ mergeParams: true });
const { protect, allowedTo } = require("../middlewares/authMiddleware");

const {getShop_S}= require("../controllers/productController")


router.
route('/')
.get(getShop_S)

module.exports=router