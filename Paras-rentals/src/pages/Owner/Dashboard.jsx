import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext()

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0
  })

  const dashboardCards = [
    { title: 'Total cars', value: data.totalCars, icon: assets.carIconColored },
    {
      title: 'Total Bookings',
      value: data.totalBookings,
      icon: assets.listIconColored
    },
    {
      title: 'Pending',
      value: data.pendingBookings,
      icon: assets.cautionIconColored
    },
    {
      title: 'Confirmed',
      value: data.completedBookings,
      icon: assets.listIconColored
    }
  ]

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/owner/dashboard')
      if (data.success) {
        setData(data.DashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData()
    }
  }, [isOwner])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="px-4 pt-10 md:px-10 flex-1"
    >
      {/* Title */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Title
          title="Admin Dashboard"
          subTitle="Monitor overall platform peformance including total cars, bookingsm revenue and recent activities"
        />
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 w-full"
      >
        {dashboardCards.map((card, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor bg-white"
          >
            <div>
              <h1 className="text-xs text-gray-500">{card.title}</h1>
              <p className="text-lg font-semibold">{card.value}</p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <img src={card.icon} alt="" className="h-4 w-4" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom section */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8 w-full">
        {/* Recent Bookings */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 md:p-6 border border-borderColor rounded-md w-full md:max-w-lg bg-white"
        >
          <h1 className="text-lg font-medium">Recent Bookings</h1>
          <p className="text-gray-500">Latest customer bookings</p>

          {data.recentBookings.map((booking, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="mt-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <img
                    src={assets.listIconColored}
                    alt=""
                    className="h-5 w-5"
                  />
                </div>
                <div>
                  <p>
                    {booking.car.brand} {booking.car.model}
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.createdAt.split('T')[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-medium">
                <p className="text-sm text-gray-500">
                  {currency}
                  {booking.price}
                </p>
                <p
                  className={`px-3 py-0.5 rounded-full text-sm font-medium capitalize ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-600'
                      : booking.status === 'cancelled'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {booking.status}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Revenue */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="p-4 md:p-6 border border-borderColor rounded-md w-full md:max-w-xs bg-white"
        >
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500">Revenue for current month</p>
          <p className="text-3xl mt-6 font-semibold text-primary">
            {currency} {data.monthlyRevenue}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard
