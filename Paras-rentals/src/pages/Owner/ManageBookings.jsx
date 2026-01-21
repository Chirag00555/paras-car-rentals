import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()
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
    fetchOwnerBookings()
  }, [])


  const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-600 border-green-300';
    case 'completed':
      return 'bg-green-200 text-green-700 border-green-400';
    case 'declined':
      return 'bg-red-100 text-red-600 border-red-300';
    case 'cancelled':
      return 'bg-red-200 text-red-700 border-red-400';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300';
  }
};


  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title
        title="Manage bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
      />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Date & Time</th>
              <th className='p-3 font-medium max-md:hidden'>Contact</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium'>Actions</th>
              

            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => {
              if (!booking.car) return null

            const pickup = new Date(booking.pickupDateTime)
            const drop = new Date(booking.returnDateTime)

            const pickupDateTimeFormatted = pickup.toLocaleString('en-IN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })

            const dropDateTimeFormatted = drop.toLocaleString('en-IN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })


              return (
                <tr key={index} className="border-t border-borderColor">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={booking.car.image}
                      alt=""
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <p>{booking.car.brand} {booking.car.model}</p>
                  </td>

                  <td className="p-3 max-md:hidden">
                    
                    <p>{pickupDateTimeFormatted}</p>
                    <p className="text-xs text-gray-400">to</p>
                    <p>{dropDateTimeFormatted}</p>

                  </td>

                  <td className="p-3 max-md:hidden">
                    {booking.phone || 'N/A'}
                  </td>

                  <td className="p-3">
                    {currency}{booking.price}
                  </td>

                 <td className="p-3">
  <select
    value={booking.status}
    onChange={e =>
      changeBookingStatus(booking._id, e.target.value)
    }
    className={`px-2 py-1.5 rounded-md outline-none border ${getStatusClass(
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




                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageBookings
