const express = require('express');
const {
  createCashOrder, updateOrderStatus,
} = require('../controllers/orderController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);
router.route('/:cartId').post(authMiddleware.allowedTo('customer'), createCashOrder);
router.get(
  '/',
  authMiddleware.allowedTo('customer',"seller", 'admin'),
  filterOrderForLoggedUser,
  findAllOrders
);
router.get('/:id', findSpecificOrder);
router.patch(
    '/status/:id',
    authMiddleware.allowedTo('seller'),
    updateOrderStatus
  );

  
module.exports = router;