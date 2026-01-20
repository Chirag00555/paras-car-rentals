import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const { axios } = useAppContext();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/user/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (data.success) {
        toast.success("Password reset successful");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="max-w-sm mx-auto mt-20 p-6 border rounded"
    >
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border p-2 mb-3"
        required
      />

      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      <button className="w-full bg-primary text-white py-2 rounded">
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
