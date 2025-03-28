import { useContext,useEffect } from "react";
import Mycontext from "../context/Mycontext";
import Layout from "./Layout";

function Home(){
    const context=useContext(Mycontext);
    const {isAuthenticated,userdetail,token}=context;

    return(
        <div className="flex min-h-screen w-full ">
      <Layout/>
    <div className="ml-60">
        <h1> home page</h1>
        <div className=" pl-">
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
    </div>
  
        
    
    </div>
    );
}

export default Home;