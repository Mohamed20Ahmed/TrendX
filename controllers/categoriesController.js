const { v4: uuidv4 } = require('uuid');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const { sendSuccessResponse } = require("../utils/responseHandler");

const asyncHandler = require('express-async-handler');
// const sharp = require('sharp');
const ApiError = require("../utils/apiError");


const {
  getCategoryByIdDB,
  // updateCategoryDB,
  createCategoryDB,
  getAllCategoriesDB,
  getCategoryDB,
  deleteCategoryDB
} = require("../database/categoryDB");

const uploadCategoryImage = uploadSingleImage([
    {
      name: 'image',
    },
  ]);




// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {

  // if (req.file) {
  //   await sharp(req.file.buffer)
  //     .resize(600, 600)
  //     .toFormat('jpeg')
  //     .jpeg({ quality: 95 })
  //     .toFile(`uploads/categories/${filename}`);

  //   // Save image into our db
  //   req.body.image = filename;
  // }
  if(req.files){

    if (req.files.image) {
      const fileName = `category-${uuid.v4()}-${Date.now()}.jpeg`;
      const data = {
        fileName,
        buffer: req.files.image.buffer,
        mimetype: "image/jpeg",
        folderName: "categories",
      };
    

    // Save image into our storage
    req.body.imageCover = await addFileStorage(data);
  }
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
  
    const response = { categories };
  
    sendSuccessResponse(res, response, 200);
  });
  

  const createCategory = asyncHandler(async (req, res, next) => {
    const admin = req.user._id;

  const { name } = req.body;

  const category = await getCategoryDB({admin, name});

  if(category){
    return next(new ApiError("category  is already exist", 400));
  }
  await createCategoryDB({admin, name});

  const response = { message: "category created successfully" };

  sendSuccessResponse(res, response, 200);
  });


  

  const deleteCategory = asyncHandler(async (req, res, next) => {
    const categoryId = req.params.productId;

    const category = await getProductByIdDB(categoryId);
    
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
    deleteCategory,

}