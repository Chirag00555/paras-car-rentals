import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { Link } from "react-router-dom"

const Footer = () => {

    const insta = "https://www.instagram.com/jabalpur_selfdrive_cars?igsh=MXQxMjY4Nm1pODM0eA=="
  return (
    
       <motion.div 
       initial={{ opacity: 0, y: 30 }}
       whileInView={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6 }}  
       className='px-6 md:px-16 lg:px-24 xl:px-32 mt-30 text-sm text-gray-500'>
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }} 
            className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b'>
<div>
  {/* Logo */}
  <motion.img
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    src={assets.logoNew}
    alt="logo"
    className="h-8 md:h-9"
  />

  {/* Description */}
  <motion.p
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="max-w-80 mt-3 text-gray-600"
  >
    Premium car rental service with a wide selection of luxury and everyday
    vehicles for all your driving needs.
  </motion.p>

  {/* Social + Contact Icons */}
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.5 }}
    className="flex items-center gap-4 mt-6"
  >
    {/* Instagram */}
    <a
      href={insta}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
    >
      <img
        src={assets.instagram_logo}
        alt="Instagram"
        className="w-5 h-5 hover:scale-110 transition"
      />
    </a>

    {/* Email */}
    <a
      href="mailto:Parasbhurrak1234@mail.com"
      aria-label="Email"
    >
      <img
        src={assets.gmail_logo}
        alt="Email"
        className="w-5 h-5 hover:scale-110 transition"
      />
    </a>

    {/* Call */}
    <a
      href="tel:+918871930783"
      aria-label="Call"
    >
      <img
        src={assets.call}
        alt="Phone"
        className="w-5 h-5 hover:scale-110 transition"
      />
    </a>
 
  </motion.div>
</div>



                <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='flex flex-wrap justify-between w-1/2 gap-8'>


                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Quick Links</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="/">Home</a></li>
                        <li><a href="/cars">Browse Cars</a></li>
                        <li><a href="/inquiry">Query</a></li>
                        <li><a href="/about-us">About us</a></li>
                    </ul>
                </div>

                
                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="/inquiry">Help Center</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        
                    </ul>
                </div>

                <div>
                <h2 className="text-base font-medium text-gray-800 uppercase">
                    Contact
                </h2>

                <ul className="mt-3 flex flex-col gap-1.5 text-gray-600">
                    <li>Sainik Colony, Madan Mahal</li>
                    <li>Jabalpur, 482002</li>

                    {/* Phone */}
                    <li>
                    <a
                        href="tel:+918871930783"
                        className="hover:text-primary transition"
                    >
                        +91 8871930783
                    </a>
                    </li>

                    {/* Email */}
                    <li>
                    <a
                        href="mailto:Parasbhurrak1234@mail.com"
                        className="hover:text-primary transition"
                    >
                        Parasbhurrak1234@mail.com
                    </a>
                    </li>
                </ul>
                </div>



                </motion.div>

                

            </motion.div>
            
            <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
            <p>
                © {new Date().getFullYear()} Paras Rentals. All rights reserved. · Developed with ❤️ by{" "}
                <a
                    href="https://github.com/chirag00555"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-600"
                >
                    Chirag Jain
                </a>
            </p>

                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li>
                    <li>|</li>
                    <li><a href="#">Terms</a></li>
                    <li>|</li>
                    <Link to="/sitemap" className="hover:text-primary">Sitemap</Link>

                </ul>
            </motion.div>
        </motion.div>
    
  )
}

export default Footer
