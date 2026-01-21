    import Booking from "../models/Booking.js"
    import sendEmail from "../utils/sendEmail.js";
import {
  ownerBookingRequestTemplate,
  customerBookingRequestTemplate,
  bookingConfirmedTemplate,
  bookingDeclinedTemplate,
  bookingCancelledTemplate,
  bookingCompletedTemplate
} from "../utils/emailTemplates.js";


    // fucntion to check availaibility of car for a given data

    import Car from "../models/Car.js";

    // const checkAvailaibility = async (car, pickupDateTime, returnDateTime) => {
    //     const bookings = await Booking.find({
    //         car,
    //         pickupDateTime: { $lte: returnDateTime },
    //         returnDateTime: { $gte: pickupDateTime }
    //     })

    //     return bookings.length === 0
    // }

const checkAvailability = async (
  car,
  pickupDateTime,
  returnDateTime,
  excludeBookingId = null
) => {
  const ONE_HOUR = 60 * 60 * 1000

  const pickup = new Date(pickupDateTime)
  const drop = new Date(returnDateTime)

  const query = {
    car,
    status: 'confirmed', // ✅ only confirmed blocks
    pickupDateTime: { $lt: drop },
    returnDateTime: {
      $gt: new Date(pickup.getTime() - ONE_HOUR)
    }
  }

  // ✅ THIS IS THE MISSING PART
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId }
  }

  const booking = await Booking.findOne(query)

  return !booking
}






    //API to check availability of cars for the given Date and location 

        export const checkAvailaibilityOfCar = async (req, res) => {
        try {
            const { location, pickupDate, returnDate } = req.body

            if (!pickupDate || !returnDate) {
            return res.json({
                success: false,
                message: 'Pickup and return date-time required'
            })
            }

            const cars = await Car.find({
            location,
            isAvailable: true
            })

            const availableCars = []

            for (const car of cars) {
            const isAvailable = await checkAvailability(
                car._id,
                pickupDate,
                returnDate
            )

            if (isAvailable) {
                availableCars.push(car)
            }
            }

            res.json({
            success: true,
            availableCars
            })

        } catch (error) {
            console.log(error)
            res.json({
            success: false,
            message: error.message
            })
        }
        }



    // API to create booking 
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user

    let {
      car,
      pickupDateTime,
      returnDateTime,
      phone,
      pickupService,
      dropService,
      pickupLocation,
      dropLocation
    } = req.body

    pickupService = pickupService === true || pickupService === "true"
    dropService = dropService === true || dropService === "true"

    const carId = typeof car === "object" ? car._id : car

    const carData = await Car.findById(carId)
    if (!carData) {
      return res.json({ success: false, message: "Car not found" })
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.json({ success: false, message: "Valid phone number required" })
    }

    if (pickupService && !pickupLocation) {
      return res.json({ success: false, message: "Pickup location required" })
    }

    if (dropService && !dropLocation) {
      return res.json({ success: false, message: "Drop location required" })
    }

    const pickup = new Date(pickupDateTime)
    const drop = new Date(returnDateTime)

    if (isNaN(pickup.getTime()) || isNaN(drop.getTime())) {
      return res.json({ success: false, message: "Invalid date/time provided" })
    }

    const now = new Date()
    if (pickup <= now) {
      return res.json({ success: false, message: "Pickup time must be in the future" })
    }

    if (drop <= pickup) {
      return res.json({
        success: false,
        message: "Return time must be after pickup time"
      })
    }

    const isRestrictedTime = (date) => {
      const h = date.getHours()
      const m = date.getMinutes()
      return (h === 23 && m >= 30) || (h >= 0 && h < 7)
    }

    if (isRestrictedTime(pickup)) {
      return res.json({
        success: false,
        message: "Car cannot be picked up between 11:30 PM and 7:00 AM"
      })
    }

    if (isRestrictedTime(drop)) {
      return res.json({
        success: false,
        message: "Car cannot be returned between 11:30 PM and 7:00 AM"
      })
    }

    const diffMs = drop - pickup
    const oneHourMs = 60 * 60 * 1000

    if (diffMs < oneHourMs) {
      return res.json({
        success: false,
        message: "Minimum booking duration is 1 hour"
      })
    }

    // 🔒 🔥 FINAL & MOST IMPORTANT CHECK 🔥 🔒
    const isAvailable = await checkAvailability(
      carId,
      pickupDateTime,
      returnDateTime
    )

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Car is not available for the selected time slot"
      })
    }

    // ---- pricing (unchanged) ----
    const totalHours = Math.ceil(diffMs / (1000 * 60 * 60))
    let price = 0

    if (totalHours <= 12) {
      price = 1800
    } else {
      const fullDays = Math.floor(totalHours / 24)
      const remaining = totalHours % 24

      price += fullDays * 3000

      if (remaining > 0 && remaining <= 12) {
        price += 1800
      } else if (remaining > 12) {
        price += 3000
      }
    }

    if (pickupService) price += 400
    if (dropService) price += 400

    const booking = await Booking.create({
      car: carId,
      user: _id,
      pickupDateTime,
      returnDateTime,
      phone,
      pickupService,
      dropService,
      pickupLocation,
      dropLocation,
      price,
      status: 'pending'
    })

        // 📧 EMAIL NOTIFICATIONS (NON-BREAKING ADDITION)
    try {
      const bookingData = {
        customerName: req.user.name,
        phone,
        carName: carData.name,
        pickupDateTime,
        returnDateTime
      };

      // Email to OWNER
      await sendEmail({
        email: process.env.EMAIL_USER,
        subject: "New Booking Request – Action Required",
        message: ownerBookingRequestTemplate(bookingData)
      });

      // Email to CUSTOMER
      await sendEmail({
        email: req.user.email,
        subject: "Booking Request Received – Paras Rentals",
        message: customerBookingRequestTemplate(bookingData)
      });

    } catch (mailError) {
      console.error("Email error:", mailError.message);
    }


    res.json({ success: true, message: "Booking Created" })

  } catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
  }
}



    //API to list user bookings

    export const getUserBookings = async (req, res)=>{
        try {
            const {_id} = req.user;
            const bookings = await Booking.find({ user: _id}).populate("car").sort({createdAt: -1})

            res.json({success: true, bookings})

        } catch (error) {
            console.log(error.message);
            res.json({success: false, message: error.message})
        }
    }

    //API to get owner bookings

    export const getOwnerBookings = async (req, res)=>{
        try {
            if(req.user.role !== 'owner'){
                return res.json({success: false, message: "Not Authorized"})
            }

            const bookings = await Booking.find().populate('car user').select("-user.password").sort({createdAt: -1})

            res.json({success: true, bookings})

        } catch (error) {
            console.log(error.message);
            res.json({success: false, message: error.message})
        }
    }


    //API to change booking status

    // export const ChangeBookingStatus = async (req, res)=>{
    //     console.log("ROLE:", req.user.role)

    //     try {
    //         const {_id} = req.user;
    //         const {bookingId, status} = req.body

    //         const booking = await Booking.findById(bookingId)
    //         // if(booking.owner.toString() !== _id.toString()){
    //         //     return res.json({success: false, message: "Unauthorized"})
    //         // }
    //         if (req.user.role !== "owner") {
    //             return res.json({ success: false, message: "Unauthorized" })
    //         }


    //         booking.status = status;
    //         await booking.save()

    //         res.json({success: true, message: "Status updated"})
            
    //     } catch (error) {
    //         console.log(error.message);
    //         res.json({success: false, message: error.message})
    //     }
    // }

// export const changeBookingStatus = async (req, res) => {
//   console.log("STATUS RECEIVED FROM FRONTEND 👉", status);

//   try {
//     const { bookingId, status } = req.body

//     const booking = await Booking.findById(bookingId).populate("user", "name email").populate("car", "name");
//     if (!booking) {
//       return res.json({ success: false, message: 'Booking not found' })
//     }

//     if (status === 'confirmed') {
//       const isAvailable = await checkAvailability(
//         booking.car,
//         booking.pickupDateTime,
//         booking.returnDateTime
//       )

//       if (!isAvailable) {
//         return res.json({
//           success: false,
//           message: 'Car not available for this time slot'
//         })
//       }
//     }

//     booking.status = status
//     await booking.save()

//         // 📧 EMAIL NOTIFICATION (NON-BREAKING ADDITION)
//     try {
//       const bookingData = {
//         customerName: booking.user.name,
//         carName: booking.car.name,
//         pickupDateTime: booking.pickupDateTime,
//         returnDateTime: booking.returnDateTime
//       };

//       if (status === "confirmed") {
//         await sendEmail({
//           email: booking.user.email,
//           subject: "Booking Confirmed – Paras Rentals",
//           message: bookingConfirmedTemplate(bookingData)
//         });
//       }

//       if (status === "declined") {
//         await sendEmail({
//           email: booking.user.email,
//           subject: "Booking Request Declined – Paras Rentals",
//           message: bookingDeclinedTemplate(bookingData)
//         });
//       }

//     } catch (mailError) {
//       console.error("Booking status email error:", mailError.message);
//     }


//     res.json({ success: true, message: 'Booking status updated' })

//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

export const changeBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    const normalizedStatus = status.toLowerCase();

    const booking = await Booking.findById(bookingId)
      .populate("user", "name email")
      .populate("car", "name");

    if (!booking) {
      return res.json({ success: false, message: 'Booking not found' });
    }

    // Availability check only when confirming
    if (normalizedStatus === 'confirmed') {
      const isAvailable = await checkAvailability(
      booking.car._id,
      booking.pickupDateTime,
      booking.returnDateTime,
      booking._id
    )


      if (!isAvailable) {
        return res.json({
          success: false,
          message: 'Car not available for this time slot'
        });
      }
    }

    // ✅ SAVE STATUS AS-IS
    booking.status = normalizedStatus;
    await booking.save();

    // 📧 EMAIL NOTIFICATIONS (SAFE, NON-BLOCKING)
    try {
      const bookingData = {
        customerName: booking.user.name,
        carName: booking.car.name,
        pickupDateTime: booking.pickupDateTime,
        returnDateTime: booking.returnDateTime
      };

      if (normalizedStatus === "confirmed") {
        await sendEmail({
          email: booking.user.email,
          subject: "Booking Confirmed – Paras Rentals",
          message: bookingConfirmedTemplate(bookingData)
        });
      }

      if (normalizedStatus === "declined") {
        await sendEmail({
          email: booking.user.email,
          subject: "Booking Request Declined – Paras Rentals",
          message: bookingDeclinedTemplate(bookingData)
        });
      }

      if (normalizedStatus === "cancelled") {
        await sendEmail({
          email: booking.user.email,
          subject: "Booking Cancelled – Paras Rentals",
          message: bookingCancelledTemplate(bookingData)
        });
      }

      if (normalizedStatus === "completed") {
        await sendEmail({
          email: booking.user.email,
          subject: "Booking Completed – Paras Rentals",
          message: bookingCompletedTemplate(bookingData)
        });
      }

    } catch (mailError) {
      console.error("Booking status email error:", mailError);
    }

    res.json({ success: true, message: 'Booking status updated' });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};






export const getConfirmedBookingsForCar = async (req, res) => {
  try {
    const { carId } = req.params
    const ONE_HOUR = 60 * 60 * 1000
    const now = new Date()

    const bookings = await Booking.find({
      car: carId,
      status: 'confirmed'
    })
      .select('pickupDateTime returnDateTime')
      .sort({ pickupDateTime: 1 })

    // ✅ Filter only ACTIVE confirmed bookings
    const activeBookings = bookings.filter(b =>
      new Date(b.returnDateTime).getTime() + ONE_HOUR > now.getTime()
    )

    res.json({
      success: true,
      bookings: activeBookings
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

