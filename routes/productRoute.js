import express from 'express';
import productController from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const {addProduct, productInfo, listProduct, removeProduct} = productController;
const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.fields([{name: 'image1', maxCount: 1}, {name: 'image2', maxCount: 1}, {name: 'image3', maxCount: 1}, {name: 'image4', maxCount: 1}]), addProduct)
productRouter.post('/list', adminAuth, listProduct)
productRouter.post('/remove', removeProduct)
productRouter.post('/single', productInfo)

export default productRouter