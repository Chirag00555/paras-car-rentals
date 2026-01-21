import Inquiry from "../models/Inquiry.js";

// GET all queries
export const getAllQueries = async (req, res) => {
  try {
    const queries = await Inquiry.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      queries
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// TOGGLE resolved
export const toggleQueryResolved = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolved } = req.body;

    await Inquiry.findByIdAndUpdate(id, { resolved });

    res.json({
      success: true,
      message: "Query status updated"
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};
