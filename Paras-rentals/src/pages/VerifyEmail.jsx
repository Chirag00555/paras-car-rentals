import React, { useState, useEffect  } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const password = sessionStorage.getItem("tempPassword");


  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);


  const { axios, setToken, setShowLogin } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
  if (timer === 0) {
    setCanResend(true);
    return;
  }

  const interval = setInterval(() => {
    setTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [timer]);


    const resendOtpHandler = async () => {
  try {
    const { data } = await axios.post("/api/user/resend-otp", { email });

    if (data.success) {
      toast.success("OTP resent");
      setTimer(60);
      setCanResend(false);
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  }
};


  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // 1. Verify OTP
      const verifyRes = await axios.post("/api/user/verify-email-otp", {
        email,
        otp,
      });

      if (!verifyRes.data.success) {
        toast.error(verifyRes.data.message);
        return;
      }

      // If password missing (page refresh case)
      
     if (!password) {
        toast.success("Email verified. Please login.");
        setShowLogin(true);   // 🔹 open login modal
        navigate("/");        // 🔹 stay on home
        return;
     }


      // 2. Auto login
      const loginRes = await axios.post("/api/user/login", {
        email,
        password,
      });

      if (loginRes.data.success) {
        setToken(loginRes.data.token);
        localStorage.setItem("token", loginRes.data.token);
        sessionStorage.removeItem("tempPassword");

        setShowLogin(false);   // 🔴 THIS WAS MISSING
        toast.success("Account verified & logged in");
        navigate("/");
    } else {
        toast.error(loginRes.data.message);
      }

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
  setShowLogin(false);
}, []);


  return (
    <form
      onSubmit={submitHandler}
      className="max-w-sm mx-auto mt-20 p-6 border rounded"
    >
      <h2 className="text-xl font-semibold mb-4">Verify Email</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      <button className="w-full bg-primary text-white py-2 rounded">
        Verify OTP
      </button>

        <button
            type="button"
            disabled={!canResend}
            onClick={resendOtpHandler}
            className={`w-full mt-3 py-2 rounded ${
                canResend ? "bg-gray-700 text-white" : "bg-gray-300 cursor-not-allowed"
            }`}
            >
            {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
        </button>

    </form>
  );
};

export default VerifyEmail;
