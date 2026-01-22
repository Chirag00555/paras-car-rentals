import React from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const Login = () => {

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    setShowLogin,
    axios,
    setToken,
    navigate,
    setOtpEmail,
    setShowOtp,
    setShowForgotPassword,
    setAuthModalReason,
  } = useAppContext()

  const [state, setState] = React.useState("login")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const { data } = await axios.post(
        `/api/user/${state}`,
        state === "register"
          ? { name, email, password }
          : { email, password }
      )

      if (!data.success) {
        toast.error(data.message)
        return
      }

      if (state === "register") {
        toast.success("OTP sent to your email")
        sessionStorage.setItem("tempPassword", password)
        setShowLogin(false)
        setOtpEmail(email)
        setShowOtp(true)
        return
      }

      if (state === "login") {
        setToken(data.token)
        localStorage.setItem("token", data.token)
        setShowLogin(false)
        setAuthModalReason(null)
        navigate("/")
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        setShowLogin(false)
        setAuthModalReason("dismissed")
      }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50"
    >

      <motion.form
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 p-8 py-12 w-80 sm:w-88 bg-white border border-gray-200 rounded-lg shadow-xl text-gray-500"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </motion.div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        {state === "login" && (
          <p
            onClick={() => {
              setShowLogin(false)
              setAuthModalReason(null)
              setShowForgotPassword(true)
            }}
            className="text-sm text-primary cursor-pointer text-right"
          >
            Forgot password?
          </p>
        )}

        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded-md text-white transition-all
            ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-blue-800"}
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {state === "register" ? "Creating..." : "Logging in..."}
            </span>
          ) : (
            state === "register" ? "Create Account" : "Login"
          )}
        </motion.button>

      </motion.form>
    </motion.div>
  )
}

export default Login
