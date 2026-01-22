import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    axios,
    otpEmail,
    setShowResetPassword,
    setShowForgotPassword,
    setShowLogin,
  } = useAppContext();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { data } = await axios.post("/api/user/reset-password", {
        email: otpEmail,
        otp,
        newPassword: password,
      });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Password reset successfully");

      setShowResetPassword(false);
      setShowLogin(true);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={() => setShowResetPassword(false)}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submitHandler}
        className="flex flex-col gap-4 p-8 py-10 w-80 sm:w-88 bg-white rounded-lg shadow-xl"
      >
        <p className="text-2xl font-medium text-center">
          <span className="text-primary">Reset</span> Password
        </p>

        <div>
          <p>OTP</p>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>

        <div>
          <p>New Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>

        {/* 🔙 BACK TO FORGOT */}
        <p
          onClick={() => {
            setShowResetPassword(false);
            setShowForgotPassword(true);
          }}
          className="text-sm text-primary cursor-pointer text-center"
        >
          ← Back to Forgot Password
        </p>

        <button
          disabled={isSubmitting}
          className={`w-full py-2 rounded-md text-white
            ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-blue-800"
            }`}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
