import express from 'express';
import { isAuthenticated, login, logout, register, sendOtpVerify, verifyEmail } from '../controllers/auth.js';
import userAuth from '../middlewares/userAuth.js';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/sent-verify-otp', userAuth, sendOtpVerify);
router.post('/verify-account', userAuth, verifyEmail);
router.post('/is-auth', userAuth, isAuthenticated);

export default router;