import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }

    try{

        const exsitingUser = await User.findOne({ email });
        //* Check if user already exists
        if(exsitingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hasedPassword = await bcryptjs.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hasedPassword
        });
        
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie('token', token, {
            httpOnly: true,
            sercure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", 
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // * sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Our NextGen School",
            text:`${name} Join us in shaping the future of education with NextGen School!
             Hindu College welcomes you to a smart, innovative, and student-friendly platform designed for seamless learning and growth. 
             Stay connected, track progress, and experience the future of education with us. Enroll now and step into excellence!`
        }

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ success: true, message: "User registered successfully"});
    }catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({ success: false, message: "The email or password was incorrect!" });
    }

    try{
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ success: false, message: "Invaild email" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ success: false, message: "Invaild password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie('token', token, {
            httpOnly: true,
            sercure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", 
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ success: true, message: "User logged in successfully"});
    }catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const logout = async (req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            sercure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", 
        });

        return res.status(200).json({ success: true, message: "User logged out successfully" });
    }catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const sendOtpVerify = async (req, res) => {
    try{
        const {userId} = req.body;

        const user = await User.findById(userId);

        if(user. isAccountVerified){
            return res.status(400).json({ success: false, message: "User already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60* 60 * 1000;

        await user.save();

        const mailOptionsn = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Your OTP Verification Code",
            text: `Hello ${user.name},Your OTP code is: ${otp} Plwase verify your account within 24 hours.`
        }

        await transporter.sendMail(mailOptionsn);

        return res.status(200).json({ success: true, message: "Verification OTP sent successfully" });
    }catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;

    if(!userId || !otp) {
        return res.status(400).json({ success: false, message: "Missing Deatils Please check again" });
    }

    try{
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({ success: true, message: "Account verified successfully" });
    }catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const isAuthenticated = async (req, res) => {
    try{
        return res.status(200).json({ success: true, message: "User is authenticated" });
    }catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const sentResetOtp = async (req, res) => {
    const {email} = req.body;

    if(!email){
        return res.status(400).json({ success: false, message: "Please provide email" });
    }

    try{
        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptionsn = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Hello ${user.name}, Your OTP code is: ${otp} Please reset your password within 15 minutes.`
        }

        await transporter.sendMail(mailOptionsn);

        return res.status(200).json({ success: true, message: "Reset OTP sent successfully" });
    }catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const resetPassword = async (req, res) => {
    const {email, otp, newPassworsd} = req.body;

    if(!email || !otp || !newPassworsd){
        return res.status(400).json({ success: false, message: "Please provide all the details" });
    }

    try{
        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if(user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if(user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcryptjs.hash(newPassworsd, 10);

        
    }catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};