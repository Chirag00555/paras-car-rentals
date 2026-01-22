import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner } = useAppContext()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-borderColor text-gray-600 ${
        location.pathname === '/' ? 'bg-light' : 'bg-white'
      }`}
    >
      {/* Logo */}
      <Link to="/" onClick={() => setOpen(false)}>
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logoNew}
          className="h-12 w-auto"
          alt="logo"
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}
      </div>

      {/* Desktop Buttons */}
      <div className="hidden sm:flex items-center gap-4">
        {isOwner && (
          <button
            onClick={() => navigate('/owner')}
            className="px-6 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
          >
            Dashboard
          </button>
        )}
        <button
          onClick={() => (user ? logout() : setShowLogin(true))}
          className="px-6 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
        >
          {user ? 'Logout' : 'Login'}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="sm:hidden"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div
          className={`absolute top-full left-0 w-full z-50 flex flex-col gap-4 px-6 py-4 border-t border-borderColor ${
            location.pathname === '/' ? 'bg-light' : 'bg-white'
          }`}
        >
          {menuLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              onClick={() => setOpen(false)}
              className="py-2"
            >
              {link.name}
            </Link>
          ))}

          {isOwner && (
            <button
              onClick={() => {
                navigate('/owner')
                setOpen(false)
              }}
              className="w-full px-6 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
            >
              Dashboard
            </button>
          )}

          <button
            onClick={() => {
              user ? logout() : setShowLogin(true)
              setOpen(false)
            }}
            className="w-full px-6 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
          >
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default Navbar
