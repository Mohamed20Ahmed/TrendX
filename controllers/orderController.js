const asyncHandler = require ( 'express-async-handler')
const apiError = require ('../utils/apiError')
const Product = require('../models/productModel');
const factory = require('./handlersFactory');
const userDB = require('../database/userDB')

const Cart = require ('../models/cartModel')
const Order = require('../models/orderModel')


createCashOrder = asyncHandler(async (req, res, next) =>  {
    const shoppingPrice = 0

    const cart = await Cart.findById(req.params.cartId)
    console.log(cart)
    if (!cart) {
        return next(new apiError('cart not found', 404))
    }
    const product = await Product.findById(cart.cartItems[0].product)
    const seller = product.sellerId.toString()
    console.log(seller)
    const cartPrice = cart.totalCartPrice
    const totalOrderPrice = cartPrice + shoppingPrice
    const order = await Order.create({
       seller,
        customer: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice
    })
    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
          updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
          },
        }));
        await Product.bulkWrite(bulkOption, {});
    
        //await Cart.findByIdAndDelete(req.params.cartId);
    }
    
      res.status(201).json({ status: 'Success', data: order });
      
});

filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'customer') req.filterObj = { customer: req.user._id };

  else if (req.user.role === 'seller') req.filterObj = { seller: req.user._id };
  next();
});

findAllOrders = factory.getAll(Order);

findSpecificOrder = factory.getOne(Order);


updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  order.status = req.body.status;
  order.changeStatusTime = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: 'success', data: updatedOrder });
});

module.exports  = {
  createCashOrder,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder,
  updateOrderStatus

}