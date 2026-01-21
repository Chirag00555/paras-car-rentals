import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    resolved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
