const uuid = require("uuid");
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const { sendSuccessResponse } = require("../utils/responseHandler");
const { addFileStorage } = require("../firebase/storage");


const asyncHandler = require("express-async-handler");
// const sharp = require('sharp');
const ApiError = require("../utils/apiError");

const {
  getCategoryByIdDB,
  // updateCategoryDB,
  createCategoryDB,
  getAllCategoriesDB,
  getCategoryDB,
  deleteCategoryDB,
} = require("../database/categoryDB");

// Upload Category image
const uploadCategoryImage = uploadSingleImage("image");

// Image storage
const imageStorage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuid.v4()}-${Date.now()}.jpeg`;

  if (req.file) {
    const data = {
      fileName,
      buffer: req.file.buffer,
      mimetype: "image/jpeg",
      folderName: "Categories",
    };

    // Save image into our storage
    req.body.image = await addFileStorage(data);
  }

  next();
});



const getCategory_S = asyncHandler(async (req, res, next) => {
  const categoryExcludedFields = "-__v";

  // get specific Product

  if (req.query.categoryId) {
    const category = await getCategoryByIdDB(
      req.query.categoryId,
      categoryExcludedFields
    );

    if (!category) {
      return next(new ApiError("category not found", 404));
    }

    return sendSuccessResponse(res, { category }, 200);
  }

  // get all  categories

  req.query.fields = req.query.fields || categoryExcludedFields;

  const categories = await getAllCategoriesDB(req);

  const response = { ...categories };

  sendSuccessResponse(res, response, 200);
});

  const createCategory = asyncHandler(async (req, res, next) => {

  const { name,image } = req.body;

  const category = await getCategoryDB({ name });

  if (category) {
    return next(new ApiError("category  is already exist", 400));
  }
  await createCategoryDB({
    name,
    image});

  const response = { message: "category created successfully" };

  sendSuccessResponse(res, response, 200);
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.categoryId;

    const category = await getCategoryByIdDB(categoryId);
    
        if (!category) {
          return next(new ApiError("category not found", 404));
        };
  
    if (req.user.role !== "admin") {
      return next(new ApiError("You cannot delete this categoory"));
    }
  
    await deleteCategoryDB({ _id: category._id });  
    const response = { message: "category deleted successfully" };
    sendSuccessResponse(res, response, 200);
  });
  
  module.exports={
    getCategory_S,
    createCategory,
    uploadCategoryImage,
    imageStorage,
    deleteCategory,
  }
