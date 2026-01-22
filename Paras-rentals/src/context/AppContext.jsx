import { Children, createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import {toast} from 'react-hot-toast'
import {useNavigate} from "react-router-dom"

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL


export const AppContext = createContext();

export const AppProvider = ({children}) => {

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY

    const [showOtp, setShowOtp] = useState(false);
    // const [otpEmail, setOtpEmail] = useState("");
    const [token, setToken] = useState(null)   
    const [user, setUser] = useState(null)   
    const [isOwner, setIsOwner] = useState(false)   
    const [showLogin, setShowLogin] = useState(false)   
    const [pickupDate, setPickupDate] = useState('')   
    const [returnDate, setReturnDate] = useState('')  
    const [phone, setPhone] = useState("")
    const [pickupService, setPickupService] = useState(false)
    const [dropService, setDropService] = useState(false)
    const [pickupLocation, setPickupLocation] = useState("")
    const [dropLocation, setDropLocation] = useState("")
    const [pickupTime, setPickupTime] = useState("")
    const [returnTime, setReturnTime] = useState("")
    const [pricePer12Hours, setPricePer12Hours] = useState("")
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [otpEmail, setOtpEmail] = useState("");
    const [authModalReason, setAuthModalReason] = useState(null);






    
    const [cars, setCars] = useState([])

    //function to check if user is logged in

    const fetchUser = async ()=>{
        try {
           const {data} = await axios.get('/api/user/data')
           if(data.success){
            setUser(data.user)
            setIsOwner(data.user.role === 'owner')
           }else{
            navigate('/')
           }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to fetch all the cars from the server

    const fetchCars = async () => {
        try {
            const {data} = await axios.get('/api/user/cars')
            data.success ? setCars(data.cars) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to logout from user

    const logout = ()=> {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization'] = ''
        toast.success("You have been logged out")
    }

    //useEffect to retrive the token from local Storage

// 1️⃣ Read token ONCE
useEffect(() => {
  const storedToken = localStorage.getItem("token");

  if (storedToken) {
    setToken(storedToken);
  } else {
    setIsAuthReady(true); // no login, auth resolved
  }
}, []);


// 2️⃣ Bootstrap auth when token is set
useEffect(() => {
  if (!token) return;

  axios.defaults.headers.common["Authorization"] = token;

  const initAuth = async () => {
    try {
      await fetchUser();   // sets user + isOwner
    } catch (err) {
      console.error("fetchUser failed:", err);
      setToken(null); // optional: force logout on bad token
      localStorage.removeItem("token");
    } finally {
      setIsAuthReady(true); // ✅ ALWAYS runs
    }
  };

  initAuth();
}, [token]);


// 3️⃣ Fetch public data AFTER auth ready (important)
useEffect(() => {
  if (!isAuthReady) return;
  fetchCars();
}, [isAuthReady]);


    const value = {
        navigate, currency, axios, user, setUser, token, setToken, isOwner, setIsOwner, fetchUser, showLogin, setShowLogin, logout, fetchCars, cars, setCars, pickupDate, setPickupDate, returnDate, setReturnDate, showOtp, setShowOtp, otpEmail, setOtpEmail, phone, setPhone, pickupService, setPickupService, dropService, setDropService, pickupLocation, setPickupLocation, dropLocation, setDropLocation, pickupTime, setPickupTime, returnTime, setReturnTime, pricePer12Hours, setPricePer12Hours, isAuthReady, setIsAuthReady, showResetPassword, setShowResetPassword, showForgotPassword, setShowForgotPassword, authModalReason, setAuthModalReason
    }

    return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
    )
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}