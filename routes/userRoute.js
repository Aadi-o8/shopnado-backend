import express from 'express';
import userController from '../controllers/userController.js'
import adminAuth from '../middleware/adminAuth.js';

const {loginUser, signUpUser, adminLogin} = userController;

const userRouter = express.Router();

userRouter.post('/register', signUpUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

export default userRouter;