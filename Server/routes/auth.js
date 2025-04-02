import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendOtpVerify, sentResetOtp, verifyEmail } from '../controllers/auth.js';
import userAuth from '../middlewares/userAuth.js';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/sent-verify-otp', userAuth, sendOtpVerify);
router.post('/verify-account', userAuth, verifyEmail);
router.post('/is-auth', userAuth, isAuthenticated);
router.post('/sent-reset-otp', sentResetOtp);
router.post('/reset-password', resetPassword);

export default router;