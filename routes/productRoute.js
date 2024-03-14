const router = require("express").Router({ mergeParams: true });
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../validators/productValidator');

const { protect, allowedTo } = require("../middlewares/authMiddleware");



const {
  getProduct_S,
  createProduct,
  imageStorage,
  uploadProductImages,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// const router = express.Router();

router.
route('/')
.get(getProductValidator,getProduct_S)



router.use(protect);
router
.route('/')
.post(allowedTo("seller"),uploadProductImages, imageStorage, createProductValidator, createProduct);

router
.route('/:productId')
.patch(allowedTo("seller"),uploadProductImages, imageStorage,updateProductValidator, updateProduct)
.delete(allowedTo("seller", "admin"),deleteProductValidator, deleteProduct);

 

module.exports = router;