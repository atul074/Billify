import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Mycontext from "./Mycontext";

export const CheckAuth = ({ children }) => {
  const [authStatus, setAuthStatus] = useState('checking'); // 'checking', 'authenticated', 'unauthenticated'
  const context = useContext(Mycontext);

  useEffect(() => {
    // Only run the auth check once when component mounts
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userDTO");
      console.log(userData);
      
      if (token && userData) {
        // Only update context if values are different
        if (!context.isAuthenticated || context.token !== token) {
          context.setisAuthenticated(true);
          context.settoken(token);
          context.setuserdetail(JSON.parse(userData));
        }
        setAuthStatus('authenticated');
      } else {
        setAuthStatus('unauthenticated');
      }
    };

    checkAuth();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (authStatus === 'checking') {
    return <div>Loading...</div>;
  }

  if (authStatus === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  // Only render children if we're sure the user is authenticated
  // and context has been properly updated
  return context.isAuthenticated ? children : <div>Loading...</div>;
};