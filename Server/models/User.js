import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["owner", "user"],
        default: "user",
    },

    image: {
        type: String,
        default: "",
    },

    // ✅ EMAIL OTP VERIFICATION
    isVerified: {
        type: Boolean,
        default: false,
    },

    emailOtp: {
        type: String,
    },

    emailOtpExpire: {
        type: Date,
    },

}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;
