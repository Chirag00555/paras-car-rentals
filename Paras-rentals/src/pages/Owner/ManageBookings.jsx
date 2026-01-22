import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { assets } from '../../assets/assets'

const ManageBookings = () => {
  const { currency, axios, token, isOwner, isAuthReady } = useAppContext()
  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', {
        bookingId,
        status
      })
      if (data.success) {
        toast.success(data.message)
        fetchOwnerBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!isAuthReady || !token || !isOwner) return
    fetchOwnerBookings()
  }, [isAuthReady, token, isOwner])

  const copyPhone = (phone) => {
    navigator.clipboard.writeText(phone)
    toast.success('Number copied')
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-600'
      case 'completed':
        return 'bg-green-200 text-green-700'
      case 'declined':
        return 'bg-red-100 text-red-600'
      case 'cancelled':
        return 'bg-red-200 text-red-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="px-4 pt-10 md:px-10 w-full"
    >
      <Title
        title="Manage bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
      />

      {/* Horizontal scroll container */}
      <div className="mt-6 w-full overflow-x-auto">
        <table className="min-w-[950px] w-full border border-borderColor rounded-md border-collapse text-sm text-gray-600">
          <thead className="bg-gray-50">
            <tr>
              {/* FIXED SERIAL NUMBER COLUMN */}
              <th className="sticky left-0 z-30 bg-gray-50 p-3 text-left w-[80px] border-r border-borderColor">
                Sr. No.
              </th>

              {/* SCROLLABLE COLUMNS */}
              <th className="p-3 text-left w-[220px]">Car</th>
              <th className="p-3 text-left">Date & Time</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => {
              if (!booking.car) return null

              const pickup = new Date(booking.pickupDateTime)
              const drop = new Date(booking.returnDateTime)

              return (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="border-t border-borderColor bg-white"
                >
                  {/* FIXED SERIAL NUMBER */}
                  <td className="sticky left-0 z-20 bg-white p-3 border-r border-borderColor">
                    {index + 1}
                  </td>

                  {/* CAR */}
                  <td className="p-3">
                    <div className="flex items-center gap-3 w-[220px]">
                      <img
                        src={booking.car.image}
                        alt=""
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <p className="font-medium">
                        {booking.car.brand} {booking.car.model}
                      </p>
                    </div>
                  </td>

                  {/* DATE & TIME */}
                  <td className="p-3 whitespace-nowrap">
                    <p>{pickup.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400">to</p>
                    <p>{drop.toLocaleString('en-IN')}</p>
                  </td>

                  {/* CONTACT */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span>{booking.phone || 'N/A'}</span>
                      {booking.phone && (
                        <img
                          src={assets.copy_icon}
                          alt="copy"
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => copyPhone(booking.phone)}
                        />
                      )}
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="p-3 font-medium">
                    {currency}{booking.price}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        changeBookingStatus(booking._id, e.target.value)
                      }
                      className={`px-3 py-1.5 rounded-md outline-none ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="declined">Declined</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default ManageBookings
