import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext()
  const [cars, setCars] = useState([])

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get('/api/owner/cars')
      if (data.success) {
        setCars(data.cars)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-car', { carId })
      if (data.success) {
        toast.success(data.message)
        fetchOwnerCars()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteCar = async (carId) => {
    const confirm = window.confirm('Are you sure you want to delete this car?')
    if (!confirm) return

    try {
      const { data } = await axios.post('/api/owner/delete-car', { carId })
      if (data.success) {
        toast.success(data.message)
        fetchOwnerCars()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    isOwner && fetchOwnerCars()
  }, [isOwner])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="px-4 pt-10 md:px-10 w-full"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Title
          title="Manage Cars"
          subTitle="View all listed cars update their details, or remove them from the booking platform."
        />
      </motion.div>

      {/* DESKTOP & TABLET TABLE VIEW */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden sm:block max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6 bg-white"
      >
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500 bg-gray-50">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {cars.map((car, index) => (
              <motion.tr
                key={car._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border-t border-borderColor"
              >
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={car.image}
                    alt=""
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      {car.seating_capacity} • {car.transmission}
                    </p>
                  </div>
                </td>

                <td className="p-3">{car.category}</td>

                <td className="p-3">
                  <div className="flex flex-col text-sm">
                    <span className="font-medium">
                      {currency}
                      {car.pricePerDay} / day
                    </span>
                    <span className="text-gray-500">
                      {currency}
                      {car.pricePer12Hours ?? '—'} / 12 hrs
                    </span>
                  </div>
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      car.isAvailable
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {car.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>

                <td className="p-3 flex items-center gap-3">
                  <img
                    onClick={() => toggleAvailability(car._id)}
                    src={
                      car.isAvailable
                        ? assets.eye_close_icon
                        : assets.eye_icon
                    }
                    alt=""
                    className="cursor-pointer"
                  />
                  <img
                    onClick={() => deleteCar(car._id)}
                    src={assets.delete_icon}
                    alt=""
                    className="cursor-pointer"
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* MOBILE CARD VIEW */}
      <div className="sm:hidden mt-6 space-y-4">
        {cars.map((car, index) => (
          <motion.div
            key={car._id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="border border-borderColor rounded-md p-4 bg-white"
          >
            <div className="flex items-center gap-3">
              <img
                src={car.image}
                alt=""
                className="h-14 w-14 rounded-md object-cover"
              />
              <div>
                <p className="font-medium">
                  {car.brand} {car.model}
                </p>
                <p className="text-xs text-gray-500">
                  {car.category} • {car.transmission}
                </p>
              </div>
            </div>

            <div className="mt-3 text-sm">
              <p className="font-medium">
                {currency}
                {car.pricePerDay} / day
              </p>
              <p className="text-gray-500">
                {currency}
                {car.pricePer12Hours ?? '—'} / 12 hrs
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  car.isAvailable
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {car.isAvailable ? 'Available' : 'Unavailable'}
              </span>

              <div className="flex items-center gap-4">
                <img
                  onClick={() => toggleAvailability(car._id)}
                  src={
                    car.isAvailable
                      ? assets.eye_close_icon
                      : assets.eye_icon
                  }
                  alt=""
                  className="cursor-pointer"
                />
                <img
                  onClick={() => deleteCar(car._id)}
                  src={assets.delete_icon}
                  alt=""
                  className="cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default ManageCars
