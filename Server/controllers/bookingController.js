    import Booking from "../models/Booking.js"

    // fucntion to check availaibility of car for a given data

    import Car from "../models/Car.js";

    const checkAvailaibility = async (car, pickupDate, returnDate)=>{
        const bookings = await Booking.find({
            car, 
            pickupDate: {$lte: returnDate},
            returnDate: {$gte: pickupDate}
        })
        return bookings.length === 0;
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
    export const createBooking = async (req, res)=>{
        try {
            const {_id} = req.user;
            const {car, pickupDate, returnDate, phone} = req.body;

            const isAvailable = await checkAvailaibility(car, pickupDate, returnDate)
            if(!isAvailable){
                return res.json({success: false, message: "Car is not Available"})
            }

            const carData = await Car.findById(car)

            //calculate price 

            const picked = new Date(pickupDate);
            const returned = new Date(returnDate);
            const noOfDays = Math.ceil((returned - picked)/ (1000*60*60*24))
            const price = carData.pricePerDay * noOfDays;

            await Booking.create({car, owner: carData.owner, user: _id, pickupDate, returnDate, phone, price})

            res.json({success: true, message: "Booking Created"})
        } catch (error) {
            console.log(error.message);
            res.json({success: false, message: error.message})
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

            const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1})

            res.json({success: true, bookings})

        } catch (error) {
            console.log(error.message);
            res.json({success: false, message: error.message})
        }
    }


    //API to change booking status

    export const ChangeBookingStatus = async (req, res)=>{
        try {
            const {_id} = req.user;
            const {bookingId, status} = req.body

            const booking = await Booking.findById(bookingId)
            if(booking.owner.toString() !== _id.toString()){
                return res.json({success: false, message: "Unauthorized"})
            }

            booking.status = status;
            await booking.save()

            res.json({success: true, message: "Status updated"})
            
        } catch (error) {
            console.log(error.message);
            res.json({success: false, message: error.message})
        }
    }

