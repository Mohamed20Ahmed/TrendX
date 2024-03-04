const { check } = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');



exports.addToWishlistValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,

]

exports.getwishListValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,
  ];

exports.deleteFromWishListValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,
  ];