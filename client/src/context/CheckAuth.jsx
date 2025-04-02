import { Navigate } from "react-router"

export const CheckAuth = ({children}) => {
    const user =(localStorage.getItem('authToken'))
    console.log(user);
    
    if (user ) {
      return children
    }
    else {
      return <Navigate to={'/login'}/>
    }
}