import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const AddCar = () => {
  const { axios, currency } = useAppContext()

  const [image, setImage] = useState(null)
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: '',
    pricePerDay: 0,
    pricePer12Hours: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: '',
    location: '',
    description: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('carData', JSON.stringify(car))

      const { data } = await axios.post('/api/owner/add-car', formData)

      if (data.success) {
        toast.success(data.message)
        setImage(null)
        setCar({
          brand: '',
          model: '',
          year: '',
          pricePerDay: 0,
          pricePer12Hours: 0,
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: '',
          location: '',
          description: ''
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const years = Array.from(
    { length: new Date().getFullYear() - 1900 },
    (_, i) => new Date().getFullYear() - i
  )

  const seatingOptions = Array.from({ length: 19 }, (_, i) => i + 2)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="px-4 py-10 md:px-10 flex-1"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Title
          title="Add new car"
          subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
        />
      </motion.div>

      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
      >
        {/* Image */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="car-image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt=""
              className="h-14 rounded cursor-pointer hover:scale-105 transition"
            />
            <input
              type="file"
              id="car-image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <p className="text-sm text-gray-500">
            Upload a picture of your car
          </p>
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label>Brand</label>
            <input
              type="text"
              placeholder="e.g. BMW, Mercedes..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.brand}
              onChange={(e) =>
                setCar({ ...car, brand: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col">
            <label>Model</label>
            <input
              type="text"
              placeholder="e.g X5, E-class..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.model}
              onChange={(e) =>
                setCar({ ...car, model: e.target.value })
              }
            />
          </div>
        </div>

        {/* Year / Prices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label>Year</label>
            <select
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.year}
              onChange={(e) =>
                setCar({ ...car, year: e.target.value })
              }
            >
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label>Daily Price ({currency})</label>
            <input
              type="number"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.pricePerDay}
              onChange={(e) =>
                setCar({ ...car, pricePerDay: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col">
            <label>Price for 12 hrs ({currency})</label>
            <input
              type="number"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.pricePer12Hours}
              onChange={(e) =>
                setCar({
                  ...car,
                  pricePer12Hours: e.target.value
                })
              }
            />
          </div>
        </div>

        {/* Transmission / Category / Fuel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label>Transmission</label>
            <select
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.transmission}
              onChange={(e) =>
                setCar({ ...car, transmission: e.target.value })
              }
            >
              <option value="">Select transmission</option>
              <option>Automatic</option>
              <option>Manual</option>
              <option>Semi-Automatic</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label>Category</label>
            <select
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.category}
              onChange={(e) =>
                setCar({ ...car, category: e.target.value })
              }
            >
              <option value="">Select category</option>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Sub Compact SUV</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label>Fuel Type</label>
            <select
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.fuel_type}
              onChange={(e) =>
                setCar({ ...car, fuel_type: e.target.value })
              }
            >
              <option value="">Select fuel</option>
              <option>Gas</option>
              <option>Diesel</option>
              <option>Petrol</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>
          </div>
        </div>

        {/* Seating & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label>Seating Capacity</label>
            <select
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.seating_capacity}
              onChange={(e) =>
                setCar({
                  ...car,
                  seating_capacity: e.target.value
                })
              }
            >
              <option value="">Select seats</option>
              {seatingOptions.map((s) => (
                <option key={s} value={s}>
                  {s} seats
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label>Location</label>
            <select
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.location}
              onChange={(e) =>
                setCar({ ...car, location: e.target.value })
              }
            >
              <option value="">Select location</option>
              <option>Jabalpur</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label>Description</label>
          <textarea
            rows={5}
            required
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.description}
            onChange={(e) =>
              setCar({ ...car, description: e.target.value })
            }
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max"
        >
          <img src={assets.tick_icon} alt="" />
          {isLoading ? 'Listing...' : 'List Your Car'}
        </motion.button>
      </motion.form>
    </motion.div>
  )
}

export default AddCar
