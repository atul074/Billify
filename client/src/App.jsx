import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Login from "./pages/Login"
import Register from "./pages/Register"
import Mycontext from "./context/Mycontext";
import Mystate from "./context/Mystate";
import Home from "./pages/Home";
import Transaction from "./pages/Transaction";
import { CheckAuth } from "./context/CheckAuth";
import Product from "./pages/Product";
import AddEditProduct from "./pages/AddEditProduct";
import Profile from "./pages/Profile";
import Purchase from "./pages/Purchase";
import TransactionDetail from "./pages/TransactionDetail";
import TemplatePage from "./pages/TemplatePage";
import Sell from "./pages/SellWithInvoicePreview";

function App() {

  return (
    <Mystate>
      <Router>
      <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Routes>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/home" element={<CheckAuth><Home/></CheckAuth>}/>
          <Route path="/transaction" element={<CheckAuth><Transaction/></CheckAuth>}/>
          <Route path="/transaction/:transactionId" element={<CheckAuth><TransactionDetail/></CheckAuth>}/>
          <Route path="/product" element={<CheckAuth><Product/></CheckAuth>}/>
          <Route path="/add-product" element={<CheckAuth><AddEditProduct/></CheckAuth>}/>
          <Route path="/edit-product/:productId" element={<CheckAuth><AddEditProduct/></CheckAuth>}/>

          <Route path="/profile" element={<CheckAuth><Profile/></CheckAuth>}/>

          
          <Route path="/purchase" element={<CheckAuth><Purchase/></CheckAuth>}/>
          <Route path="/sell" element={<CheckAuth><Sell/></CheckAuth>}/>
          <Route path="/templates" element={<TemplatePage />} />

          <Route path="*" element={<Login/>}/>
        </Routes>
      </Router>
    </Mystate>
  )
}

export default App
