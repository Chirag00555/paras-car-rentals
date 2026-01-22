import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const VerifyOtp = ({ email }) => {

  const [isVerifying, setIsVerifying] = useState(false);
const [isResending, setIsResending] = useState(false);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { axios, setToken, setShowOtp, setShowLogin } = useAppContext();
  const password = sessionStorage.getItem("tempPassword");

  // Timer
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

const resendOtpHandler = async () => {
  if (!canResend || isResending) return; // 🛑 safety check
  setIsResending(true);

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
    toast.error(err.response?.data?.message || err.message);
  } finally {
    setIsResending(false);
  }
};


  const submitHandler = async (e) => {
    e.preventDefault();

  if (isVerifying) return;   // 🛑 block double click
  setIsVerifying(true); 

    try {
      const verifyRes = await axios.post("/api/user/verify-email-otp", {
        email,
        otp,
      });

      if (!verifyRes.data.success) {
        toast.error(verifyRes.data.message);
        return;
      }

      // Auto login
      const loginRes = await axios.post("/api/user/login", {
        email,
        password,
      });

      if (loginRes.data.success) {
        setToken(loginRes.data.token);
        localStorage.setItem("token", loginRes.data.token);
        sessionStorage.removeItem("tempPassword");

        setShowOtp(false);
        setShowLogin(false);
        toast.success("Account verified & logged in");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }finally {
    setIsVerifying(false); // 🔓 always unlock
  }
  };

  return (
  <div
    className="fixed inset-0 z-100 bg-black/50 flex items-center justify-center"
    onClick={() => setShowOtp(false)}
  >
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={submitHandler}
      className="bg-white w-80 sm:w-96 p-6 rounded-xl shadow-xl border border-gray-200 flex flex-col gap-4"
    >
      <h2 className="text-xl font-semibold text-center text-gray-800">
        Verify OTP
      </h2>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6-digit OTP"
        className="border border-gray-300 rounded-md p-2 outline-primary"
        required
      />

<button
  type="submit"
  disabled={isVerifying}
  className={`py-2 rounded-md text-white transition-all
    ${isVerifying
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-primary hover:bg-blue-800"
    }`}
>
  {isVerifying ? (
    <span className="flex items-center justify-center gap-2">
      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      Verifying...
    </span>
  ) : (
    "Verify OTP"
  )}
</button>


     <button
  type="button"
  disabled={!canResend || isResending}
  onClick={resendOtpHandler}
  className={`py-2 rounded-md text-sm transition-all
    ${canResend && !isResending
      ? "bg-gray-700 text-white hover:bg-gray-800"
      : "bg-gray-200 text-gray-500 cursor-not-allowed"
    }`}
>
  {isResending
    ? "Resending..."
    : canResend
    ? "Resend OTP"
    : `Resend OTP in ${timer}s`}
</button>

    </form>
  </div>
);

};

export default VerifyOtp;
