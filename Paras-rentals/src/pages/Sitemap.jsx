import { Link } from "react-router-dom"
import { motion } from "motion/react"

const Sitemap = () => {
  return (
    <div className="min-h-screen bg-light px-6 md:px-16 py-20">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-sm text-gray-500 mb-4"
        >
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Sitemap</span>
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-semibold text-gray-800 mb-12"
        >
          Sitemap
        </motion.h1>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          {/* Main Pages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition"
          >
            <h2 className="text-lg font-medium text-gray-800 mb-5 flex items-center gap-2">
              📄 Main Pages
            </h2>

            <ul className="space-y-3 text-gray-600">
              <li><Link className="hover:text-primary" to="/">Home</Link></li>
              <li><Link className="hover:text-primary" to="/about-us">About Us</Link></li>
              <li><Link className="hover:text-primary" to="/cars">Browse Cars</Link></li>
              <li><Link className="hover:text-primary" to="/inquiry">Query</Link></li>
            </ul>
          </motion.div>

          {/* Account */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition"
          >
            <h2 className="text-lg font-medium text-gray-800 mb-5 flex items-center gap-2">
              👤 Account
            </h2>

            <ul className="space-y-3 text-gray-600">
              <li><Link className="hover:text-primary" to="/my-bookings">My Bookings</Link></li>
              <li><Link className="hover:text-primary" to="/coupons">Coupons</Link></li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition"
          >
            <h2 className="text-lg font-medium text-gray-800 mb-5 flex items-center gap-2">
              ⚖️ Legal
            </h2>

            <ul className="space-y-3 text-gray-600">
              <li><Link className="hover:text-primary" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-primary" to="/terms">Terms & Conditions</Link></li>
            </ul>
          </motion.div>

        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-sm text-gray-500"
        >
          This sitemap helps you navigate Paras Self Drive Car Rental easily and quickly.
        </motion.div>

      </div>
    </div>
  )
}

export default Sitemap
