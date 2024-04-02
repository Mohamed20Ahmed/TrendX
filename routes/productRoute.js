const router = require("express").Router({ mergeParams: true });

const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../validators/productValidator");
const {
  getProduct_S,
  createProduct,
  imageStorage,
  uploadProductImages,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

//get all products for admin (admin)

// get only active seller's products for customers and users (all)

// get epecific products for all shops (seller)

router.use(protect);

router.route("/").get(allowedTo("admin"), getProductValidator, getProduct_S);

router
  .route("/")
  .post(
    allowedTo("seller"),
    uploadProductImages,
    imageStorage,
    createProductValidator,
    createProduct
  );

router
  .route("/:productId")
  .patch(
    allowedTo("seller"),
    uploadProductImages,
    imageStorage,
    updateProductValidator,
    updateProduct
  )
  .delete(allowedTo("seller", "admin"), deleteProductValidator, deleteProduct);

module.exports = router;
