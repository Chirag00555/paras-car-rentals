import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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

    // ✅ EMAIL VERIFICATION
    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifyOtp: {
      type: String,
    },

    emailVerifyOtpExpire: {
      type: Date,
    },

    // ✅ FORGOT PASSWORD
    passwordResetOtp: {
      type: String,
    },

    passwordResetOtpExpire: {
      type: Date,
    },

  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
