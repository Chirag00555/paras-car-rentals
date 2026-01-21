import express from "express";
import { changeBookingStatus, checkAvailaibilityOfCar, createBooking, getOwnerBookings, getUserBookings, getConfirmedBookingsForCar } from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailaibilityOfCar)
bookingRouter.post('/create', protect, createBooking)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/owner', protect, getOwnerBookings)
bookingRouter.post('/change-status', protect, changeBookingStatus)
bookingRouter.get('/car/:carId/confirmed-bookings',getConfirmedBookingsForCar)


export default bookingRouter;

