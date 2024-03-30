const express = require('express');

const { protect, allowedTo } = require("../middlewares/authMiddleware");


const {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
} = require('../validators/categoryValidator');

const {
  getCategory_S,
  createCategory,
  deleteCategory,
  uploadCategoryImages,
  categoryStorage,
} = require('../controllers/categoryController');

// const subcategoriesRoute = require('./subCategoryRoute');

const router = express.Router();

// Nested route
// router.use('/:categoryId/subcategories', subcategoriesRoute);
router
.route('/')
.get(getCategoryValidator,getCategory_S);

  

router.use(protect);

router
  .route('/')
  .post(allowedTo("admin"),uploadCategoryImages,categoryStorage,  createCategoryValidator, createCategory);

router
  .route('/:categoryId')
  .delete(allowedTo("admin"), deleteCategoryValidator, deleteCategory);


module.exports = router;