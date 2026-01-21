import React, { useState } from 'react'
import Navbar from './components/navbar'
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
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyOtp from "./components/VerifyOtp";
import Inquiry from './pages/Inquiry'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'


const App = () => {

  const {showLogin, showOtp, otpEmail} = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')
  return (
    <>
    <Toaster />
      {showLogin && <Login/>}
      {showOtp && <VerifyOtp email={otpEmail} />}
      {!isOwnerPath && <Navbar />}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/car-details/:id' element={<CarDetails/>}/>
        <Route path='/cars' element={<Cars/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/inquiry" element={<Inquiry />} />
        <Route path='/owner' element={<Layout />}>
          <Route index element={<Dashboard/>}/>
          <Route path='add-car' element={<AddCar/>}/>
          <Route path='manage-cars' element={<ManageCars/>}/>
          <Route path='manage-bookings' element={<ManageBookings/>}/>

        </Route>
      
      </Routes>
      {!isOwnerPath && <Footer />}
      
    </>
  )
}

export default App
