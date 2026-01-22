import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets} from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import { JABALPUR_LOCATIONS } from '../assets/assets'


const CarDetails = () => {

    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [dropSuggestions, setDropSuggestions] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);


    // const fetchJabalpurPlaces = async (query, setSuggestions) => {
    //       if (query.length < 3) {
    //         setSuggestions([]);
    //         return;
    //     }

    //     const res = await fetch(
    //         `https://nominatim.openstreetmap.org/search?format=json&q=${query} jabalpur india&limit=5`
    //     );
    //     const data = await res.json();

    //     setSuggestions(
    //         data.filter(place =>
    //         place.display_name.toLowerCase().includes("jabalpur")
    //         )
    //     );
    // };

    const filterLocations = (query) => {
  if (!query) return [];

  return JABALPUR_LOCATIONS
    .filter(place =>
      place.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 6); // max 6 suggestions
};





    const {id} = useParams()
    const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate, phone, setPhone, pickupService, setPickupService, pickupLocation, setPickupLocation, dropService, setDropService, dropLocation, setDropLocation, pickupTime, setPickupTime, returnTime, setReturnTime} = useAppContext()

    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [blockedSlots, setBlockedSlots] = useState([])

    const currency = import.meta.env.VITE_CURRENCY

    const pickupCharge = pickupService ? 400 : 0
    const dropCharge = dropService ? 400 : 0

    const pickupDateTime =
    pickupDate && pickupTime
        ? new Date(`${pickupDate}T${pickupTime}`)
        : null

    const returnDateTime =
    returnDate && returnTime
        ? new Date(`${returnDate}T${returnTime}`)
        : null
    let totalHours = 0

    if (pickupDateTime && returnDateTime) {
    const diffMs = returnDateTime - pickupDateTime
    totalHours = Math.ceil(diffMs / (1000 * 60 * 60))
    }

    let basePrice = 0

    if (car && totalHours > 0) {
    if (totalHours <= 12) {
        basePrice = car.pricePer12Hours
    } else {
        const fullDays = Math.floor(totalHours / 24)
        const remainingHours = totalHours % 24

        basePrice = fullDays * car.pricePerDay

        if (remainingHours > 0 && remainingHours <= 12) {
        basePrice += car.pricePer12Hours
        } else if (remainingHours > 12) {
        basePrice += car.pricePerDay
        }
    }
    }



    const totalPrice = basePrice + pickupCharge + dropCharge

    



    const handleSubmit = async (e) => {
        e.preventDefault()

         if (isSubmitting) return; // 🛑 block double click
         setIsSubmitting(true);    // 🔒 lock button


        // 1️⃣ basic validation
        if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
            toast.error("Please select pickup and return date & time")
            return
        }

        // 2️⃣ return-time restriction (frontend UX)
        if (isInvalidReturnTime(returnTime)) {
            toast.error("Car cannot be returned between 11:30 PM and 7:00 AM")
            return
        }

        // 3️⃣ CREATE datetime strings (THIS IS THE KEY)
        const pickupDateTime = `${pickupDate}T${pickupTime}`
        const returnDateTime = `${returnDate}T${returnTime}`

        // 4️⃣ Logical time validation
        if (new Date(returnDateTime) <= new Date(pickupDateTime)) {
            toast.error("Return time must be after pickup time")
            return
        }


        try {
            const { data } = await axios.post('/api/bookings/create', {
            car: id,
            pickupDateTime,      // ✅ NEW
            returnDateTime,      // ✅ NEW
            phone,
            pickupService,
            dropService,
            pickupLocation,
            dropLocation,
            totalPrice
            })

            if (data.success) {
            toast.success(data.message)

            // optional: reset form
            setPickupDate("")
            setReturnDate("")
            setPickupTime("")
            setReturnTime("")
            setPhone("")
            setPickupService(false)
            setDropService(false)
            setPickupLocation("")
            setDropLocation("")

            navigate('/my-bookings')
            } else {
            toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }finally {
            setIsSubmitting(false); // 🔓 unlock button ALWAYS
        }
    }


    const isInvalidReturnTime = (time) => {
        const [h, m] = time.split(":").map(Number)

        return (
            (h === 23 && m >= 30) || // 11:30 PM onwards
            (h >= 0 && h < 7)        // midnight to 7 AM
        )
    }


    useEffect(()=>{
        setCar(cars.find(car => car._id === id))
    },[cars, id])

    useEffect(() => {
        setPickupDate("")
        setReturnDate("")
        setPhone("")
        setPickupService(false)
        setDropService(false)
        setPickupLocation("")
        setDropLocation("")
        setPickupTime("")
        setReturnTime("")
    }, [])


    const fetchBlockedSlots = async () => {
        try {
            const { data } = await axios.get(
            `/api/bookings/car/${car._id}/confirmed-bookings`
            )

            if (data.success) {
            setBlockedSlots(data.bookings)
            }
        } catch (error) {
            console.error(error)
        }
        }

        useEffect(() => {
            if (car?._id) {
                fetchBlockedSlots()
            }
        }, [car])

        const formatDateTime = (date) =>
            new Date(date).toLocaleString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
        })




  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <button onClick={()=> navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65'/>
      back to all cars
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='lg:col-span-2'>
            <motion.img 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}


            src={car.image} alt="" className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'/>
            <motion.div className='space-y-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div>
                    <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
                    <p className='text-gray-500 text-lg'>{car.category} • {car.year}</p>
                </div>
                <hr className='border-borderColor my-6'/>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                    {[
                        {icon: assets.users_icon, text: `${car.seating_capacity} Seats`},
                        {icon: assets.fuel_icon, text: car.fuel_type},
                        {icon: assets.car_icon, text: car.transmission},
                        {icon: assets.location_icon, text: car.location},
                    ].map(({icon, text})=>(
                        <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                            <img src={icon} alt="" className='h-5 mb-2'/>
                            {text}
                        </motion.div>
                    ))}
                </div>

                <div>
                    <h1 className='text-xl font-medium mb-3'>Description</h1>
                    <p className='text-gray-500'>{car.description}</p>
                </div>

                <div>
                    <h1 className='text-xl font-medium mb-3'>Features</h1>
                    <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        {
                            ["360 camera", "Bluetooth", "GPS", "Heated Seats", "Rear View mirror"].map((item)=> (
                                <li key={item} className='flex items-center text-gray-500'>
                                    <img src={assets.check_icon} alt="" className='h-4 mr-2'/>
                                    {item}
                                </li>
                            ))
                        }
                    </ul>

                </div>
            </motion.div>
        </motion.div>

                        
          
                        


        <motion.form 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        
        onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>

                        {/* 🔴 Confirmed Booked Slots */}
            {blockedSlots.length > 0 && (
                <div className="p-3 border border-red-200 rounded-md bg-red-50">
                <h3 className="text-xs font-semibold text-red-600 mb-2">
                    This car is already booked for
                </h3>

                <ul className="text-xs text-gray-700 space-y-1 max-h-32 overflow-y-auto">
                    {blockedSlots.map((slot, index) => (
                    <li key={index}>
                        • {formatDateTime(slot.pickupDateTime)} →{" "}
                        {formatDateTime(slot.returnDateTime)}
                    </li>
                    ))}
                </ul>

                <p className="text-[11px] text-gray-500 mt-1">
                    *Includes 1 hour buffer after each booking
                </p>
                </div>
            )}

            
            <div className="space-y-1">
                <p className='text-2xl font-semibold text-gray-800'>
                    {currency}{car.pricePerDay}
                    <span className='text-base text-gray-400 font-normal'> / day</span>
                </p>
                <p className="text-sm text-gray-500">
                    {currency}{car.pricePer12Hours} / 12 hrs
                </p>
                </div>


            <hr className='border-borderColor my-6' />

            <div className='flex flex-col gap-2'>
                <label htmlFor="pickup-date">Pickup date</label>
                <input value={pickupDate} onChange={(e)=>setPickupDate(e.target.value)} type="date" className='border border-borderColor px-3 py-2 rounded-lg' required id='pickup-date' min={new Date().toISOString().split('T')[0]}/>
            </div>

            <div className='flex flex-col gap-2'>
                <label>Pickup Time</label>
                <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}
                required
                />
            </div>            

            <div className='flex flex-col gap-2'>
                <label htmlFor="return-date">Return date</label>
                <input value={returnDate} onChange={(e)=>setReturnDate(e.target.value)}
                type="date" className='border border-borderColor px-3 py-2 rounded-lg' required id='return-date' min={pickupDate}/>
            </div>

            <div className='flex flex-col gap-2'>
                <label>Return Time</label>
                <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)}
                required
                />
            </div>   

            <div className='flex flex-col gap-2'>
                <label htmlFor="phone">Contact number</label>
                <input value={phone} onChange={(e)=>setPhone(e.target.value)}
                type="tel" className='border border-borderColor px-3 py-2 rounded-lg' placeholder='Enter Contact number' required id='phone' />
            </div>
{/* Pickup Service */}
<div className="flex flex-col gap-2 relative">
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={pickupService}
      onChange={() => {
        setPickupService(!pickupService);
        setPickupLocation("");
        setPickupSuggestions([]);
      }}
    />
    <span>Pickup Service (+ ₹400)</span>
  </label>

  {pickupService && (
    <>
      <input
        type="text"
        placeholder="Enter pickup location"
        value={pickupLocation}
        onChange={(e) => {
          setPickupLocation(e.target.value);
          setPickupSuggestions(filterLocations(e.target.value));
        }}
        className="border px-3 py-2 rounded-lg"
        required
      />

      {pickupSuggestions.length > 0 && (
        <ul className="absolute top-full left-0 z-20 bg-white border rounded-lg w-full max-h-40 overflow-y-auto">
          {pickupSuggestions.map((place, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                setPickupLocation(place);
                setPickupSuggestions([]);
              }}
            >
              📍 {place}
            </li>
          ))}
        </ul>
      )}
    </>
  )}
</div>


{/* Drop Service */}
<div className="flex flex-col gap-2 relative">
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={dropService}
      onChange={() => {
        setDropService(!dropService);
        setDropLocation("");
        setDropSuggestions([]);
      }}
    />
    <span>Drop Service (+ ₹400)</span>
  </label>

  {dropService && (
    <>
      <input
        type="text"
        placeholder="Enter drop location"
        value={dropLocation}
        onChange={(e) => {
          setDropLocation(e.target.value);
          setDropSuggestions(filterLocations(e.target.value));
        }}
        className="border px-3 py-2 rounded-lg"
        required
      />

      {dropSuggestions.length > 0 && (
        <ul className="absolute top-full left-0 z-20 bg-white border rounded-lg w-full max-h-40 overflow-y-auto">
          {dropSuggestions.map((place, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                setDropLocation(place);
                setDropSuggestions([]);
              }}
            >
              📍 {place}
            </li>
          ))}
        </ul>
      )}
    </>
  )}
</div>




            <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                <p className="text-lg font-semibold">
                    Total Fare: ₹{totalPrice}
                </p>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                <p>Base Fare: ₹{basePrice}</p>

                {pickupService && <p>Pickup Service: +₹400</p>}
                {dropService && <p>Drop Service: +₹400</p>}
                </div>

            </div>


            


                <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 font-medium text-white rounded-xl transition-all
                    ${isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dull cursor-pointer"
                    }`}
                >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Requesting...
                    </span>
                ) : (
                    "Request Booking"
                )}
                </button>


            <p className='text-center text-sm'>No credit required to reserve</p>
        </motion.form>

      </div>
    </div>
  ) : <Loader/>
}

export default CarDetails
