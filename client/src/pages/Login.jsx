import React, { useState,useContext,useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import Mycontext from "../context/Mycontext";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const context=useContext(Mycontext);
  const {loginUser}=context;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = { email:email, password:password};
      const res = await loginUser(loginData);

      console.log(res)

      if (res?.status === 200) {
        // ApiService.saveToken(res.token)
        // ApiService.saveRole(res.role)
        setMessage("login Successfull")
        navigate("/home")
      }
    } catch (error) {
        setMessage("login Unsuccessfull")
      console.log(error);
    }
  };

  return (
    <div className="w-[500px] mx-auto mt-32 p-6 border border-gray-200 rounded-lg shadow-lg text-lg bg-white">
      <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}
      <form onSubmit={handleLogin} className="flex flex-col">
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
        <button
          type="submit"
          className="w-full p-3 bg-teal-600 text-white rounded-md hover:bg-teal-800 transition"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-4 font-medium">
        Don't have an account? <a href="/register" className="text-teal-600 font-bold hover:underline">Register</a>
      </p>
    </div>
  );
}

export default Login;
