import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'
import toast from 'react-hot-toast'

const MyBookings = () => {

  const { axios, user, currency } = useAppContext()
  const [bookings, setBookings] = useState([])

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    user && fetchMyBookings()
  }, [user])

  // ✅ STATUS LABELS (USER FRIENDLY)
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Approval'
      case 'confirmed':
        return 'Confirmed'
      case 'completed':
        return 'Ride Completed'
      case 'cancelled':
        return 'Booking Cancelled'
      case 'declined':
        return 'Booking Declined'
      default:
        return status
    }
  }

  // ✅ STATUS COLORS (CONSISTENT WITH OWNER PANEL)
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400/15 text-yellow-600'
      case 'confirmed':
      case 'completed':
        return 'bg-green-400/15 text-green-600'
      case 'declined':
      case 'cancelled':
        return 'bg-red-400/15 text-red-600'
      default:
        return 'bg-gray-400/15 text-gray-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'
    >
      <Title
        title="My Bookings"
        subTitle="View and manage your all car bookings"
        align="left"
      />

      <div>
        {bookings.map((booking, index) => {

          const pickup = new Date(booking.pickupDateTime)
          const drop = new Date(booking.returnDateTime)

          const formatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }

          const pickupFormatted = pickup.toLocaleString('en-IN', formatOptions)
          const dropFormatted = drop.toLocaleString('en-IN', formatOptions)

          return (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'
            >

              {/* Car Info */}
              <div className='md:col-span-1'>
                <div className='rounded-md overflow-hidden mb-3'>
                  <img
                    src={booking?.car?.image}
                    alt="car"
                    className='w-full aspect-video object-cover'
                  />
                </div>
                <p className='text-lg font-medium'>
                  {booking?.car?.brand} {booking?.car?.model}
                </p>
                <p className='text-gray-500'>
                  {booking?.car?.year} • {booking?.car?.category} • {booking?.car?.location}
                </p>
              </div>

              {/* Booking Info */}
              <div className='md:col-span-2'>
                <div className='flex items-center gap-2'>
                  <p className='px-3 py-1.5 bg-light rounded'>
                    Booking #{index + 1}
                  </p>

                  <p
                    className={`px-3 py-1 text-xs rounded capitalize ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {getStatusLabel(booking.status)}
                  </p>
                </div>

                <div className='flex items-start gap-2 mt-3'>
                  <img
                    src={assets.calendar_icon_colored}
                    alt="calendar"
                    className='w-4 h-4 mt-1'
                  />
                  <div>
                    <p className='text-gray-500'>Rental Period</p>
                    <p>{pickupFormatted} to {dropFormatted}</p>
                  </div>
                </div>

                <div className='flex items-start gap-2 mt-3'>
                  <img
                    src={assets.location_icon_colored}
                    alt="location"
                    className='w-4 h-4 mt-1'
                  />
                  <div>
                    <p className='text-gray-500'>Pickup Location</p>
                    <p>{booking?.car?.location}</p>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              <div className='md:col-span-1 flex flex-col justify-between gap-6'>
                <div className='text-sm text-gray-500 text-right'>
                  <p>Total Price</p>
                  <h1 className='text-2xl font-semibold text-primary'>
                    {currency} {booking.price}
                  </h1>
                  <p>
                    Booked on{' '}
                    {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default MyBookings
