// import { useEffect } from "react";
// import { useAppContext } from "../context/AppContext";

// const AuthGuard = ({ children }) => {
//   const { token, setShowLogin, authModalReason, setAuthModalReason } = useAppContext();

//   useEffect(() => {
//     if (!token && !authModalReason) {
//       setAuthModalReason("protected-route");
//       setShowLogin(true);
//     }
//   }, [token, authModalReason, setShowLogin, setAuthModalReason]);

//   return children;
// };

// export default AuthGuard;


import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const AuthGuard = ({ children }) => {
  const {
    token,
    showLogin,
    setShowLogin,
    authModalReason,
    setAuthModalReason,
  } = useAppContext();

  useEffect(() => {
    if (!token && !showLogin && authModalReason !== "dismissed") {
      setAuthModalReason("protected-route");
      setShowLogin(true);
    }
  }, [token, showLogin, authModalReason, setShowLogin, setAuthModalReason]);

  return children;
};

export default AuthGuard;
