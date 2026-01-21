import React from 'react'
import Title from '../components/Title'
import { motion } from 'motion/react'

const Coupons = () => {
  return (
    <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-20 mb-50 text-sm max-w-7xl'>
      <Title title="Coming soon" subTitle="Browse our selection of premium vehicles available for your next adventure" align={"left"} />
    </motion.div>
  )
}

export default Coupons
