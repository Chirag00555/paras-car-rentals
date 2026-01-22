import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { motion } from 'motion/react'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isSaving, setIsSaving] = useState(false)
  const { user, axios, fetchUser } = useAppContext()
  const location = useLocation()
  const [image, setImage] = useState('')

  const updateImage = async () => {
    if (isSaving) return
    setIsSaving(true)

    try {
      const formData = new FormData()
      formData.append('image', image)

      const { data } = await axios.post('/api/owner/update-image', formData)

      if (data.success) {
        fetchUser()
        toast.success(data.message)
        setImage('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {/* Backdrop (mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}

      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: sidebarOpen || window.innerWidth >= 768 ? 0 : -300, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed md:static top-0 left-0 z-50 min-h-screen w-64 bg-white
        border-r border-borderColor flex flex-col items-center pt-8 text-sm"
      >
        {/* Close button (mobile) */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 md:hidden"
        >
          <img src={assets.close_icon} alt="close" className="h-5" />
        </button>

        {/* Profile */}
        <div className="group relative">
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : user?.image || null}
              alt="profile"
              className="h-24 w-24 rounded-full mx-auto object-cover
              ring-2 ring-primary/30 shadow-sm hover:scale-105 transition"
            />

            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />

            <div className="absolute hidden inset-0 bg-black/10 rounded-full group-hover:flex
              items-center justify-center cursor-pointer">
              <img src={assets.edit_icon} alt="icon" />
            </div>
          </label>
        </div>

        {image && (
          <button
            disabled={isSaving}
            onClick={updateImage}
            className={`mt-3 flex items-center gap-2 px-3 py-1 rounded-md transition
              ${
                isSaving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
          >
            {isSaving ? (
              <>
                <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              <>
                Save <img src={assets.check_icon} width={13} alt="icon" />
              </>
            )}
          </button>
        )}

        <p className="mt-4 text-base">{user?.name}</p>

        {/* Menu */}
        <div className="w-full mt-6">
          {ownerMenuLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`relative flex items-center gap-3 w-full py-3 pl-6 transition
                ${
                  link.path === location.pathname
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <img
                src={
                  link.path === location.pathname
                    ? link.coloredIcon
                    : link.icon
                }
                alt="icon"
              />
              <span>{link.name}</span>

              {link.path === location.pathname && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute right-0 w-1.5 h-8 bg-primary rounded-l"
                />
              )}
            </NavLink>
          ))}
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar
