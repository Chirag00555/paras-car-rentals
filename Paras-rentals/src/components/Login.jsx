import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const {setShowLogin, axios, setToken, navigate, setOtpEmail, setShowOtp, setShowForgotPassword} = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (event) => {
  event.preventDefault();

    if (isSubmitting) return;   // 🛑 block double click
  setIsSubmitting(true);  
  try {
    const { data } = await axios.post(
      `/api/user/${state}`,
      state === "register"
        ? { name, email, password }
        : { email, password }
    );

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    // ✅ REGISTER FLOW (OTP)
    if (state === "register") {
        toast.success("OTP sent to your email");
        sessionStorage.setItem("tempPassword", password);

        setShowLogin(false);
        setOtpEmail(email);
        setShowOtp(true);
        return;
    }

    // ✅ LOGIN FLOW
    if (state === "login") {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setShowLogin(false);
      navigate("/");
    }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
    setIsSubmitting(false);   // 🔓 unlock ALWAYS
  }
    };

    
  return (
    <div onClick={()=> setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'>
      <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} 
      className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-88 text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>

            {/* forget password */}

            {state === "login" && (
                    <p
                    onClick={() => {
                        setShowLogin(false);
                        setShowForgotPassword(true);
                    }}
                    className="text-sm text-primary cursor-pointer text-right"
                    >
                    Forgot password?
                    </p>


                )}


            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            )}
                            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 rounded-md transition-all text-white
                    ${isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-blue-800 cursor-pointer"
                    }`}
                >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {state === "register" ? "Creating..." : "Logging in..."}
                    </span>
                ) : (
                    state === "register" ? "Create Account" : "Login"
                )}
                </button>

        </form>
    </div>
  )
}

export default Login
