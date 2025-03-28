import { useContext,useEffect } from "react";
import Mycontext from "../context/Mycontext";

function Home(){
    const context=useContext(Mycontext);
    const {isAuthenticated,userdetail,token}=context;

    return(
    <>
        <h1> home page</h1>
        <div>
        <p className="text-lg font-medium">Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
      {userdetail && (
        <div className="mt-4">
          <p><strong>Name:</strong> {userdetail.username}</p>
          <p><strong>Email:</strong> {userdetail.email}</p>
          <p><strong>Phone:</strong> {userdetail.phoneNo}</p>
          <p><strong>Address:</strong> {userdetail.address}</p>
        </div>
      )}
      <p className="mt-4 text-sm break-words"><strong>Token:</strong> {token || "No token available"}</p>
    </div>
  
        
    </>
    );
}

export default Home;