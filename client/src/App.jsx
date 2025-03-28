import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login"
import Register from "./pages/Register"
import Mycontext from "./context/Mycontext";
import Mystate from "./context/Mystate";
import Home from "./pages/Home";

function App() {
  const context=useContext(Mycontext);
  console.log(context);
  
  //const {loading}=context;
  
  //if (loading) return(<div className='text-3xl text-center mt-40'> Loading....</div> );
  return (
    <Mystate>
      <Router>
        <Routes>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/home" element={<Home/>}/>

          <Route path="*" element={<Login/>}/>
        </Routes>
      </Router>
    </Mystate>
  )
}

export default App
