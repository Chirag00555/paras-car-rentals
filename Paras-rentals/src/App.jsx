import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route,Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'
import Layout from './pages/Owner/Layout'
import Dashboard from './pages/Owner/Dashboard'
import AddCar from './pages/Owner/AddCar'
import ManageCars from './pages/Owner/ManageCars'
import ManageBookings from './pages/Owner/ManageBookings'
import Login from './components/Login'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import VerifyOtp from "./components/VerifyOtp";
import Inquiry from './pages/Inquiry'
import Coupons from './pages/Coupons'
import ManageQueries from './pages/Owner/ManageQueries'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import AuthGuard from "./components/AuthGuard";
import { AnimatePresence } from "motion/react";



// import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {

  const {showLogin, showOtp, showForgotPassword, showResetPassword, otpEmail} = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')
  return (
    <>
    <Toaster />
    <AnimatePresence>
      {showLogin && <Login />}
      {showForgotPassword && <ForgotPassword />}
      {showResetPassword && <ResetPassword />}
      {showOtp && <VerifyOtp email={otpEmail} />}      
    </AnimatePresence>
      
      {!isOwnerPath && <Navbar />}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/car-details/:id' element={<CarDetails/>}/>
        <Route path='/cars' element={<Cars/>}/>
        
        <Route path="/my-bookings"
          element={
            
              <MyBookings />
            
          }
        />

        <Route path="/coupons"
          element={
            
              <Coupons />
            
          }
        />

        {/* <Route path='/about-us' element={<AboutUs/>}/> */}

        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/inquiry" element={<Inquiry />} />
        <Route path='/owner' element={<Layout />}>
        <Route index element={<Dashboard/>}/>
        <Route path='add-car' element={<AddCar/>}/>
        <Route path='manage-cars' element={<ManageCars/>}/>
        <Route path='manage-bookings' element={<ManageBookings/>}/>
        <Route path='manage-Queries' element={<ManageQueries/>}/>

        </Route>
      
      </Routes>
      {!isOwnerPath && <Footer />}
      
    </>
  )
}

export default App
