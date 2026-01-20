import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";


// Generate JWT token

const generateToken = (userId)=>{
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}




export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ STRING OTP (NO PROMISE)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailOtp: crypto.createHash("sha256").update(otp).digest("hex"),
      emailOtpExpire: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    await sendEmail({
      email,
      subject: "Verify your email - Paras Rentals",
      message: `Your OTP is ${otp}`,
    });

    res.json({ success: true, message: "OTP sent to email" });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// Login user

export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: 'User not found'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: 'Invalid credentials'})
        }

        const token = generateToken(user._id.toString())
        // const token = jwt.sign(  
        //     { id: user._id.toString() },
        //     process.env.JWT_SECRET,
        //     { expiresIn: "7d" }
        // );

        res.json({success: true, token})

    } catch (error) {
        console.log(error.message);
        return res.json({success : false, message: error.message})
    }
}

// get user data

export const getUserData = async (req, res)=>{
    try {
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        return res.json({success : false, message: error.message})
    }
}

// Get all cars for the frontend

export const getCars = async (req, res)=>{
    try {
        const cars = await Car.find({isAvailable: true})
        return res.json({success : true, cars})
    } catch (error) {
        console.log(error.message);
        return res.json({success : false, message: error.message})
    }
}




export const verifyEmailOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.json({ success: false, message: "Email and OTP required" });
        }

        const hashedOtp = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        const user = await User.findOne({
            email,
            emailOtp: hashedOtp,
            emailOtpExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.emailOtp = undefined;
        user.emailOtpExpire = undefined;

        await user.save();

        return res.json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};


//Forget Password

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = generateOtp();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.emailOtp = hashedOtp;
    user.emailOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      html: `<h2>Your OTP is: ${otp}</h2>`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//reset password

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword || newPassword.length < 8) {
      return res.json({ success: false, message: "Invalid input" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      email,
      emailOtp: hashedOtp,
      emailOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.emailOtp = undefined;
    user.emailOtpExpire = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


//resend otp

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "Already verified" });
    }

    // ✅ STRING OTP (NO PROMISE)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.emailOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.emailOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      email,
      subject: "Your OTP - Paras Rentals",
      message: `Your OTP is ${otp}`,
    });

    res.json({ success: true, message: "OTP resent successfully" });

  } catch (error) {
    console.error("RESEND OTP ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
