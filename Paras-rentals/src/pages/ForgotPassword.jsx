// import React, { useState } from "react";
// import { useAppContext } from "../context/AppContext";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const { axios } = useAppContext();
//   const navigate = useNavigate();

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (!email) {
//       toast.error("Email is required");
//       return;
//     }

//     try {
//       const { data } = await axios.post(
//         "/api/user/forgot-password",
//         { email }
//       );

//       if (data.success) {
//         toast.success("OTP sent to your email");
//         navigate(`/reset-password?email=${email}`);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || error.message
//       );
//     }
//   };

//   return (
//     <form
//       onSubmit={submitHandler}
//       className="max-w-sm mx-auto mt-20 p-6 border rounded"
//     >
//       <h2 className="text-xl font-semibold mb-4">
//         Forgot Password
//       </h2>

//       <input
//         type="email"
//         placeholder="Enter your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="w-full border p-2 mb-4"
//         required
//       />

//       <button
//         type="submit"
//         className="w-full bg-primary text-white py-2 rounded"
//       >
//         Send OTP
//       </button>
//     </form>
//   );
// };

// export default ForgotPassword;
