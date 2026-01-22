import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

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
      const verifyRes = await axios.post("/api/user/verify-email-otp", {
        email,
        otp,
      });

      if (!verifyRes.data.success) {
        toast.error(verifyRes.data.message);
        return;
      }

      if (!password) {
        toast.success("Email verified. Please login.");
        setShowLogin(true);
        navigate("/");
        return;
      }

      const loginRes = await axios.post("/api/user/login", {
        email,
        password,
      });

      if (loginRes.data.success) {
        setToken(loginRes.data.token);
        localStorage.setItem("token", loginRes.data.token);
        sessionStorage.removeItem("tempPassword");

        setShowLogin(false);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center text-sm text-gray-600 bg-black/50"
    >
      <motion.form
        onSubmit={submitHandler}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col gap-4 p-8 py-10 w-80 sm:w-88 bg-white rounded-lg shadow-xl"
      >
        <h2 className="text-xl font-semibold text-center">
          <span className="text-primary">Verify</span> Email
        </h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-2 rounded outline-primary"
          required
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full bg-primary text-white py-2 rounded"
        >
          Verify OTP
        </motion.button>

        <motion.button
          type="button"
          disabled={!canResend}
          whileTap={canResend ? { scale: 0.95 } : {}}
          onClick={resendOtpHandler}
          className={`w-full mt-2 py-2 rounded transition-all ${
            canResend
              ? "bg-gray-700 text-white"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default VerifyEmail;
