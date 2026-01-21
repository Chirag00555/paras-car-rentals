    import Booking from "../models/Booking.js"

    // fucntion to check availaibility of car for a given data

    import Car from "../models/Car.js";

    const checkAvailaibility = async (car, pickupDateTime, returnDateTime) => {
        const bookings = await Booking.find({
            car,
            pickupDateTime: { $lte: returnDateTime },
            returnDateTime: { $gte: pickupDateTime }
        })

        return bookings.length === 0
    }


    //API to check availability of cars for the given Date and location 

    export const checkAvailaibilityOfCar = async (req, res)=> {
        try {
            const {location, pickupDate, returnDate} = req.body
            // fetch all available car for the given location
            const cars = await Car.find({location, isAvailable: true})

            // check car availability for the given date range using prmoise

            const availableCarsPromises = cars.map(async (car)=>{
                const isAvailable = await checkAvailaibility(car._id, pickupDate, returnDate)
                return {...car._doc, isAvailable: isAvailable}
            })

            let availableCars = await Promise.all(availableCarsPromises)
            availableCars = availableCars.filter(car => car.isAvailable === true)

            res.json({success: true, availableCars})

        } catch (error) {
            console.log(error.message);
            res.json({success: false, message: error.message})
        }
    }


    // API to create booking 
    export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user

        const {
        car,
        pickupDateTime,
        returnDateTime,
        phone,
        pickupService,
        dropService,
        pickupLocation,
        dropLocation
        } = req.body

        // normalize car id
        const carId = typeof car === "object" ? car._id : car

        // fetch car
        const carData = await Car.findById(carId)
        if (!carData) {
        return res.json({ success: false, message: "Car not found" })
        }

        // basic validations
        if (!phone || phone.length < 10) {
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

        if (drop <= pickup) {
        return res.json({ success: false, message: "Invalid return time" })
        }

        // ❌ return-time restriction (11:30 PM – 7 AM)
        const h = drop.getHours()
        const m = drop.getMinutes()

        const restricted =
        (h === 23 && m >= 30) ||
        (h >= 0 && h < 7)

        if (restricted) {
        return res.json({
            success: false,
            message: "Car cannot be returned between 11:30 PM and 7:00 AM"
        })
        }

        // ⏱ calculate hours
        const diffMs = drop - pickup
        const totalHours = Math.ceil(diffMs / (1000 * 60 * 60))

        // 💰 slab-based price
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

        // 🚚 pickup / drop charges
        if (pickupService) price += 400
        if (dropService) price += 400

        // save booking
        await Booking.create({
        car: carId,
        user: _id,
        pickupDateTime,
        returnDateTime,
        phone,
        pickupService,
        dropService,
        pickupLocation,
        dropLocation,
        price
        })

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

    export const ChangeBookingStatus = async (req, res)=>{
        console.log("ROLE:", req.user.role)

        try {
            const {_id} = req.user;
            const {bookingId, status} = req.body

            const booking = await Booking.findById(bookingId)
            // if(booking.owner.toString() !== _id.toString()){
            //     return res.json({success: false, message: "Unauthorized"})
            // }
            if (req.user.role !== "owner") {
                return res.json({ success: false, message: "Unauthorized" })
            }


            booking.status = status;
            await booking.save()

            res.json({success: true, message: "Status updated"})
            
        } catch (error) {
            console.log(error.message);
            res.json({success: false, message: error.message})
        }
    }

