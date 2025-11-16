import express from 'express';
import orderController from "../controllers/orderController.js";
import userAuth from '../middleware/userAuth.js'
import adminAuth from '../middleware/adminAuth.js';

const { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe } = orderController;

const orderRouter = express.Router();

// user routes
orderRouter.post('/cod', userAuth, placeOrder);
orderRouter.post('/stripe', userAuth, placeOrderStripe);
orderRouter.post('/razorpay', userAuth, placeOrderRazorpay);
orderRouter.post('/user', userAuth, userOrders);

// admin routes
orderRouter.post('/all', adminAuth, allOrders);
orderRouter.post('/update', adminAuth, updateStatus);

// verifying payment
orderRouter.post('/verifyStripe', userAuth, verifyStripe);

export default orderRouter;