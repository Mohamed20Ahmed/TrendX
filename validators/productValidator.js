const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');


exports.createProductValidator = [
  
  check('title')
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars')
    .notEmpty()
    .withMessage('Product required'),
  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 40 })
    .withMessage('Too long description'),
  check('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isFloat({min:0,max: 200000})
    .withMessage('Product price must be a number between 0->200000'),  
    check('imageCover').notEmpty().withMessage('Product imageCover is required'),
  check('images')
    .optional()
    .isArray()
    .withMessage('images should be array of string'),
  validatorMiddleware,
];

exports.getProductValidator = [
  check('productId').optional().isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check('productId').isMongoId().withMessage('Invalid ID formate'),
  check('title')
  .optional()
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars')
    .notEmpty()
    .withMessage('Product required'),
  check('description')
   .optional()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 40 })
    .withMessage('Too long description'),
  check('price')
  .optional()
    .notEmpty()
    .withMessage('Product price is required')
    .isFloat({min:0,max: 200000})
    .withMessage('Product price must be a number between 0->200000'),  
    check('imageCover')
    .optional()
    .notEmpty()
    .withMessage('Product imageCover is required'),
  check('images')
    .optional()
    .isArray()
    .withMessage('images should be array of string'),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check('productId').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];