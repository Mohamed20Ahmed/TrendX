const asyncHandler = require("express-async-handler");
const uuid = require("uuid");

const {getCategoryDB}=require("../database/categoryDB")

const {
    getProductByIdDB,
    deleteProductDB,
    updateProductDB,
    createProductDB,
    getAllProductsDB,
    getProductDB,
} = require("../database/productDB");

const {getUsersByRoleDB,getUserDB}=require("../database/userDB")

const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const { sendSuccessResponse } = require("../utils/responseHandler");
const { addFileStorage } = require("../firebase/storage");
const ApiError = require("../utils/apiError");




const uploadProductImages = uploadMixOfImages([
    {
      name: 'imageCover',
      maxCount: 1,
    },
    {
      name: 'images',
      maxCount: 5,
    },
  ]);
  
 
const imageStorage = asyncHandler(async (req, res, next) => {

  if(req.files){

  if (req.files.imageCover) {
    const fileName = `product-${uuid.v4()}-${Date.now()}.jpeg`;
    const data = {
      fileName,
      buffer: req.files.imageCover[0].buffer,
      mimetype: "image/jpeg",
      folderName: "Products",
    };
    

    // Save image into our storage
    req.body.imageCover = await addFileStorage(data);

  }

if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        let imageName = `product-${uuid.v4()}-${Date.now()}-${index + 1}.jpeg`;

        const data = {
            imageName,
            buffer: img.buffer,
            mimetype: "image/jpeg",
            folderName: "Products",
          };
      
          // Save image into our storage
           imageName = await addFileStorage(data);
        // Save image into our db
        req.body.images.push(imageName);
      })
    );

     } 
  }
  next();
});


const getProduct_S = asyncHandler(async (req, res, next) => {
  const productExcludedFields = "-__v";

  // get specific Product

  if (req.query.productId) {
    const product = await getProductByIdDB(
      req.query.productId,
      productExcludedFields
    );

    if (!product) {
      return next(new ApiError("Product not found", 404));
    }

    return sendSuccessResponse(res, { product }, 200);
  }

  // get all  Products

  req.query.fields = req.query.fields || productExcludedFields;

  const products = await getAllProductsDB(req);

  const response = { products };

  sendSuccessResponse(res, response, 200);
});

const getShop_S = asyncHandler(async (req, res, next) => {
  const sellerIncludedFields = "_id shopName shopAddress shopImage";
  // get specific seller

  if (req.query.shopName) {
    const shop = await getUserDB(
      { shopName: req.query.shopName, role: "seller" },
      sellerIncludedFields
    );

    if (!shop) {
      return next(new ApiError("shop not found", 404));
    }

    return sendSuccessResponse(res, { shop }, 200);
  }

  // get all sellers
  req.query.fields =  sellerIncludedFields;

  const response = await getUsersByRoleDB("seller", req);

  sendSuccessResponse(res, response, 200);
});

const createProduct = asyncHandler(async (req, res, next) => {
  const sellerId = req.user._id;
  // const categoryId = req.body.categoryId;

  const { title, price, description, images, imageCover,colors , category } = req.body;
  const product = await getProductDB({seller:sellerId,  title});


  if(product){
    return next(new ApiError("product title is already exist", 400));
  }
  const categoryName = await getCategoryDB ({name:category});

  if (!categoryName){
    return next(new ApiError(`No category found : ${category}`, 400));
  }

  
  await createProductDB({
    seller:sellerId,
    title,
    price,
    description,
    images,
    imageCover,
    colors,
    category : categoryName._id
  });
  const response = { message: "product created successfully" };

  sendSuccessResponse(res, response, 201);
});


  
const updateProduct = asyncHandler(async (req, res, next) => {
    const sellerId = req.user._id;
    const productId = req.params.productId; // corrected variable name
    const oldProduct = await getProductDB({_id:productId,seller:sellerId});

    if (!oldProduct) {
        return next(new ApiError("Product not exists"));
    }
    const { title, price, description, images, imageCover,colors ,category } = req.body;

    if(title){
    const product = await getProductDB({seller:sellerId, title});
    if(product && product.title!== oldProduct.title ){
      return next(new ApiError("product title is already exist", 400));
    }
    }
    
    // Assuming updateProductDB expects productId and an object containing updated fields
    await updateProductDB({_id:productId}, {
      title, 
      price, 
      description,
       images,
       imageCover,
       colors,
       category 
       
    });
    const response = { message: "Product updated successfully" };
    sendSuccessResponse(res, response, 200);
});



const deleteProduct = asyncHandler(async (req, res, next) => {
  
    const productId = req.params.productId;

    const product = await getProductByIdDB(productId);
    
        if (!product) {
          return next(new ApiError("Product not found", 404));
        };
  
    if (
      product.seller._id.toString() !== req.user._id.toString() && req.user.role !== "admin"
    ) {
      return next(new ApiError("You cannot delete this product"));
    }
  
    await deleteProductDB({ _id: product._id });  
    const response = { message: "product deleted successfully" };
    sendSuccessResponse(res, response, 200);
  });

module.exports = {
  getProduct_S,
  getShop_S,
  createProduct,
  uploadProductImages,
  imageStorage,
  updateProduct,
  deleteProduct,
};
