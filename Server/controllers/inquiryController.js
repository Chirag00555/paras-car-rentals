
import Inquiry from "../models/Inquiry.js";

export const submitInquiry = async (req, res) => {
  try {
    const body = req.body;

    // Safety check (important)
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is empty"
      });
    }

    const { name, phone, email, message } = body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    await Inquiry.create({
      name,
      phone,
      email,
      message
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully"
    });

  } catch (error) {
    console.error("Inquiry Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

