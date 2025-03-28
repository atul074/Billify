import React, { useState,useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mycontext from "../context/Mycontext";
function Register(){

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");

    const context=useContext(Mycontext);
    const {registerUser}=context;
    const navigate = useNavigate();

    const handleRegister = async (e) => {
     console.log("handle register");
     e.preventDefault();
     try {
       const registerData = { username:name, email:email, password:password, phoneNo:phoneNumber,address:address };
       //console.log(registerUser);
       
       await registerUser(registerData);
       setMessage("Registration Successfull");
       
     } catch (error) {
       setMessage("Registration Unsuccessfull")
       console.log(error);
     }
     
    };
  


    return(
    <>
        <div className="w-[500px] mx-auto mt-32 p-6 border border-gray-200 rounded-lg shadow-lg text-lg bg-white">
      <h2 className="text-center text-2xl font-bold mb-6">Register</h2>
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}
      <form onSubmit={handleRegister} className="flex flex-col">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className="mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          className="w-full p-3 bg-teal-600 text-white rounded-md hover:bg-teal-800 transition"
        >
          Register
        </button>
      </form>
      <p className="text-center mt-4 font-medium">
        Already have an account? <a href="/login" className="text-teal-600 font-bold hover:underline">Login</a>
      </p>
    </div>
    </>
    );
}

export default Register;