import express from 'express'
import cartController from '../controllers/cartController.js'
import userAuth from '../middleware/userAuth.js';

const { addToCart, updateCart, getUserCart } = cartController;

const cartRouter = express.Router();

cartRouter.post('/get', userAuth, getUserCart);
cartRouter.post('/add', userAuth, addToCart);
cartRouter.post('/update', userAuth, updateCart);

export default cartRouter;