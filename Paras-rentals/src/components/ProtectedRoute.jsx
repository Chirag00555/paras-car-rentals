import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Loader from "./Loader"; // optional

const ProtectedRoute = ({ children }) => {
  const { token, isAuthReady } = useAppContext();

  // ⏳ wait until auth is restored
  if (!isAuthReady) {
    return <Loader />; // or null
  }

  // 🔐 not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
