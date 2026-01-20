// import express from 'express';
// import { getCars, getUserData, loginUser, registerUser, verifyEmailOtp } from '../controllers/userController.js';
// import { protect } from '../middleware/auth.js';

// const userRouter = express.Router();

// userRouter.post('/register', registerUser)
// userRouter.post('/login', loginUser)
// userRouter.get('/data', protect, getUserData)
// userRouter.get('/cars', getCars)
// userRouter.post("/verify-email-otp", verifyEmailOtp);

// export default userRouter;

import express from 'express';
import { 
    getCars, 
    getUserData, 
    loginUser, 
    registerUser, 
    verifyEmailOtp,
    forgotPassword,
    resetPassword,
    resendOtp
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/verify-email-otp', verifyEmailOtp);

userRouter.get('/data', protect, getUserData);
userRouter.get('/cars', getCars);

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/resend-otp", resendOtp);

export default userRouter;
