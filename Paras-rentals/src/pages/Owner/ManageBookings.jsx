import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { assets } from '../../assets/assets'
import { Copy, Search } from 'lucide-react'

const ManageBookings = () => {
  const { currency, axios, token, isOwner, isAuthReady } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [searchId, setSearchId] = useState('')

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

  // 📋 COPY BOOKING ID
  const copyBookingId = (id) => {
    if (!id) return
    navigator.clipboard.writeText(id)
    toast.success('Booking ID copied')
  }

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

  // 🔍 FILTER BY BOOKING ID
  const filteredBookings = bookings.filter((booking) =>
    booking.bookingId
      ? booking.bookingId.toLowerCase().includes(searchId.toLowerCase())
      : searchId === ''
  )

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

      {/* 🔍 SEARCH BAR */}
      <div className="mt-6 mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by Booking ID (e.g. BK-ABC03DE6)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-borderColor rounded-md outline-none focus:ring-2 focus:ring-primary"
        />
        <button className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90">
          <Search size={16} />
          Search
        </button>
      </div>

      {/* Horizontal scroll container */}
      <div className="mt-4 w-full overflow-x-auto">
        <table className="min-w-[1050px] w-full border border-borderColor rounded-md border-collapse text-sm text-gray-600">
          <thead className="bg-gray-50">
            <tr>
              {/* BOOKING ID COLUMN */}
              <th className="sticky left-0 z-30 bg-gray-50 p-3 text-left w-[180px] border-r border-borderColor">
                Booking ID
              </th>

              <th className="p-3 text-left w-[220px]">Car</th>
              <th className="p-3 text-left">Date & Time</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((booking, index) => {
              if (!booking.car) return null

              const pickup = new Date(booking.pickupDateTime)
              const drop = new Date(booking.returnDateTime)

              return (
                <motion.tr
                  key={booking._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="border-t border-borderColor bg-white"
                >
                  {/* BOOKING ID */}
                  <td className="sticky left-0 z-20 bg-white p-3 border-r border-borderColor">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span>{booking.bookingId || 'N/A'}</span>
                      {booking.bookingId && (
                        <button
                          onClick={() => copyBookingId(booking.bookingId)}
                          className="hover:text-primary"
                          title="Copy Booking ID"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                    </div>
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
                        <button
                          onClick={() => copyBookingId(booking.bookingId)}
                          className="hover:text-primary"
                          title="Copy Booking ID"
                        >
                          <Copy size={14} />
                        </button>
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
