import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    axios,
    setShowForgotPassword,
    setShowResetPassword,
    setOtpEmail,
    setShowLogin,
  } = useAppContext();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { data } = await axios.post("/api/user/forgot-password", { email });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("OTP sent to your email");
      setOtpEmail(email);

      setShowForgotPassword(false);
      setShowResetPassword(true);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={() => setShowForgotPassword(false)}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submitHandler}
        className="flex flex-col gap-4 p-8 py-10 w-80 sm:w-88 bg-white rounded-lg shadow-xl"
      >
        <p className="text-2xl font-medium text-center">
          <span className="text-primary">Forgot</span> Password
        </p>

        <div>
          <p>Email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>

        {/* 🔙 BACK TO LOGIN */}
        <p
          onClick={() => {
            setShowForgotPassword(false);
            setShowLogin(true);
          }}
          className="text-sm text-primary cursor-pointer text-center"
        >
          ← Back to Login
        </p>

        <button
          disabled={isSubmitting}
          className={`w-full py-2 rounded-md text-white
            ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-blue-800"
            }`}
        >
          {isSubmitting ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
