import React from "react"
import { motion } from "motion/react"
import { assets } from "../../assets/assets"

const About = () => {
  return (
    <div className="bg-light min-h-screen flex items-center justify-center px-6 md:px-16 py-20">
      
      {/* Floating Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white max-w-6xl w-full rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-stretch">
          
          {/* IMAGE — Top on Mobile, Left on Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 bg-[#F8FAFC] flex flex-col items-center justify-center p-8 order-1"
          >
            <img
              src={assets.paras_founder}
              alt="Paras Bhurrak"
              className="w-120 h-120 object-cover rounded-xl shadow-lg"
            />

            <p className="mt-4 text-lg font-medium text-gray-800">
              Paras Bhurrak
            </p>

            <p className="text-sm text-gray-500 text-center">
              Founder, Paras Self Drive Car Rental
            </p>
          </motion.div>

          {/* CONTENT — Bottom on Mobile, Right on Desktop */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 p-10 md:p-14 flex flex-col justify-center order-2"
          >
            <p className="text-primary font-medium mb-2">
              About Us
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
              Paras Self Drive Car Rental
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4">
              Paras Self Drive Car Rental was founded with a simple belief —
              every journey deserves freedom, comfort, and complete control.
              We aim to make self-drive car rentals easy, transparent, and reliable
              for everyone.
            </p>

            <p className="text-gray-600 leading-relaxed mb-4">
              From city commutes to long road trips, our carefully maintained fleet
              ensures safety, comfort, and peace of mind at every mile.
              We focus on honest pricing, seamless booking, and customer-first service.
            </p>

            <p className="text-gray-600 leading-relaxed">
              At Paras Rentals, we don’t just rent cars —
              we help you create memorable journeys.
            </p>

            <div className="flex items-center gap-4 mt-6">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-500">
                Drive with freedom. Drive with Paras.
              </span>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  )
}

export default About
