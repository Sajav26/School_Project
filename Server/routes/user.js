import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import { getUser } from '../controllers/user.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUser);

export default userRouter;