import express from "express";
import { protect } from "../middleware/auth.js";
import isOwner from "../middleware/isOwner.js";
import {
  addCar,
  updateUserImage,
  deleteCar,
  getDashboardData,
  getOwnerCars,
  toggleCarAvailaibility,
} from "../controllers/ownerController.js";

import {
  getAllQueries,
  toggleQueryResolved
} from "../controllers/ownerInquiryController.js";




import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

// ownerRouter.post(
//   "/add-car",
//   protect,
//   isOwner,
//   upload.fields([
//     { name: "mainImage", maxCount: 1 },
//     { name: "images", maxCount: 5 },
//   ]),
//   addCar
// );

ownerRouter.post("/update-image", upload.single('image'), protect,  updateUserImage)

// ownerRouter.put(
//   "/update-car/:id",
//   protect,
//   isOwner,
//   upload.fields([
//     { name: "mainImage", maxCount: 1 },
//     { name: "images", maxCount: 5 },
//   ]),
//   updateCar
// );
ownerRouter.post("/add-car", upload.single('image'), protect,  addCar)
ownerRouter.get("/cars", protect, isOwner, getOwnerCars);
ownerRouter.post("/toggle-car", protect, isOwner, toggleCarAvailaibility);
ownerRouter.post("/delete-car", protect, isOwner, deleteCar);
ownerRouter.get("/dashboard", protect, isOwner, getDashboardData);

ownerRouter.get("/queries", protect, getAllQueries);
ownerRouter.patch("/queries/:id", protect, toggleQueryResolved);

export default ownerRouter;
