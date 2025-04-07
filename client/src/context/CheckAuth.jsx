import { useContext,useEffect } from "react";
import { Navigate } from "react-router"
import Mycontext from "./Mycontext";

export const CheckAuth = ({children}) => {
    const context=useContext(Mycontext);
    const{setuserdetail,settoken,setisAuthenticated}=context;
    useEffect(() => {
        const user = localStorage.getItem("authToken");
        const userdata1 = localStorage.getItem("userDTO");
    
        if (user && userdata1) {
          setisAuthenticated(true);
          settoken(user);
          setuserdetail(JSON.parse(userdata1));
        }
      }, [setisAuthenticated, settoken, setuserdetail]);
    
      const user = localStorage.getItem("authToken");
    console.log(user);
   
    if (user ) {
      return children
    }
    else {
      return <Navigate to={'/login'}/>
    }
}