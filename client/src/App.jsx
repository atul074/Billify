import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login"
import Register from "./pages/Register"
import Mycontext from "./context/Mycontext";
import Mystate from "./context/Mystate";
import Home from "./pages/Home";
import Transaction from "./pages/Transaction";
import { CheckAuth } from "./context/CheckAuth";
import Product from "./pages/Product";
import AddEditProduct from "./pages/AddEditProduct";

function App() {
  // const context=useContext(Mycontext);
  // console.log(context);
  
  // const {loading}=context;
  
  //if (loading) return(<div className='text-3xl text-center mt-40'> Loading....</div> );
  return (
    <Mystate>
      <Router>
        <Routes>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/home" element={<CheckAuth><Home/></CheckAuth>}/>
          <Route path="/transaction" element={<CheckAuth><Transaction/></CheckAuth>}/>
          <Route path="/product" element={<CheckAuth><Product/></CheckAuth>}/>
          <Route path="/add-product" element={<CheckAuth><AddEditProduct/></CheckAuth>}/>

          <Route path="*" element={<Login/>}/>
        </Routes>
      </Router>
    </Mystate>
  )
}

export default App
