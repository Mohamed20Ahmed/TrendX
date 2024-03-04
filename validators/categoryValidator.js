const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');

exports.getCategoryValidator = [
  check('categoryId').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category  name required')
    .isLength({ min: 3 })
    .withMessage('Too short category name')
    .isLength({ max: 32 })
    .withMessage('Too long category name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

    check('image').optional(),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check('categoryId').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];

// exports.updateCategoryValidator = [
//   check('id').isMongoId().withMessage('Invalid category id format'),
//   body('name')
//     .optional()
//     .custom((val, { req }) => {
//       req.body.slug = slugify(val);
//       return true;
//     }),
//   validatorMiddleware,
// ];

