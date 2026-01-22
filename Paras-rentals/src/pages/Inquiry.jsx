import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import { motion } from 'motion/react'

const Inquiry = () => {
  const { user } = useAppContext()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { name, phone, email, message } = formData

    if (!name || !phone || !email || !message) {
      toast.error('Please fill all fields')
      return
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )

      const data = await res.json()

      if (res.ok && data.success) {
        toast.success('Inquiry submitted successfully')
        setFormData((prev) => ({
          ...prev,
          phone: '',
          message: ''
        }))
      } else {
        toast.error(data.message || 'Failed to submit inquiry')
      }
    } catch (error) {
      toast.error('Server error. Please try again later')
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="flex flex-col mt-10 items-center text-sm text-slate-800"
    >
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xs bg-indigo-200 text-indigo-600 font-medium px-3 py-1 rounded-full"
      >
        Contact Us
      </motion.p>

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold py-4 text-center"
      >
        Let’s Get In Touch.
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-md:text-sm text-gray-500 pb-10 text-center"
      >
        Or just reach out manually to us at{' '}
        <a
          href="#"
          className="text-indigo-600 hover:underline"
        >
          parasrentels69@gmail.com
        </a>
      </motion.p>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-96 w-full px-4"
      >
        {/* Name */}
        <label className="font-medium">Full Name</label>
        <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="h-full px-2 w-full outline-none bg-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Phone */}
        <label className="font-medium">Contact number</label>
        <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="h-full px-2 w-full outline-none bg-transparent"
            placeholder="Enter your Contact number"
            required
          />
        </div>

        {/* Email */}
        <label className="font-medium mt-4">Email Address</label>
        <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="h-full px-2 w-full outline-none bg-transparent"
            placeholder="Enter your email address"
            required
          />
        </div>

        {/* Message */}
        <label className="font-medium mt-4">Message</label>
        <textarea
          rows="4"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full mt-2 p-2 bg-transparent border border-slate-300 rounded-lg resize-none outline-none focus:ring-2 focus-within:ring-indigo-400 transition-all"
          placeholder="Enter your message"
          required
        ></textarea>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="flex items-center justify-center gap-1 mt-5 bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 w-full rounded-full transition"
        >
          Submit Form
        </motion.button>
      </motion.div>
    </motion.form>
  )
}

export default Inquiry
