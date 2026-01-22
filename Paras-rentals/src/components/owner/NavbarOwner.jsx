import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { motion } from 'motion/react'

const NavbarOwner = ({ setSidebarOpen }) => {
  const { user } = useAppContext()

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor bg-white sticky top-0 z-40"
    >
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden"
          aria-label="Open sidebar"
        >
          <img src={assets.menu_icon} alt="menu" className="h-6" />
        </button>

        <Link to="/">
          <img src={assets.logoNew} alt="logo" className="h-7" />
        </Link>
      </div>

      <p className="text-sm md:text-base">
        Welcome, {user?.name || 'Owner'}
      </p>
    </motion.div>
  )
}

export default NavbarOwner
