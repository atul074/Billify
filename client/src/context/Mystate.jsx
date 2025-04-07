import { useNavigate } from 'react-router-dom';
import Mycontext from './Mycontext';
import { useEffect, useState } from 'react';
import axios from 'axios';
function Mystate({children}) {
   // const navigate= useNavigate();
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setisAuthenticated] = useState(false);
    const [userdetail, setuserdetail] = useState({});
    const [token, settoken] = useState();

    const getHeader=()=> {
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };

    const registerUser = async (credentials) =>  {
        //console.log("aa raha");
        try {
            setLoading(true);
           // console.log(credentials);
            
            const res=await axios.post('http://localhost:8087/register', credentials);
           // console.log(res);
            
            alert(`Registration successful! Please login with your credentials.`);
            setLoading(false);
           // navigate("/login");
           
      
        } catch (error) {
            
            alert("Registration failed. Please try again.");
            throw error;
        }
      };

      const loginUser=async(credentials) =>{
        try {
            setLoading(true);
            
            const res=await axios.post('http://localhost:8087/login', credentials);
            console.log(res);
            const { userDTO, token } = res.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('userDTO', JSON.stringify(userDTO));
            setuserdetail(userDTO);
            settoken(token);
            setisAuthenticated(true);
            setLoading(false);
            return res;
        } catch (error) {
        alert("Invalid Credentials / Account does not exist");
        throw error;
        }
      };


    const logoutUser=async()=>{
        localStorage.removeItem('authToken');
        localStorage.removeItem('userDTO');
        setisAuthenticated(false);
        settoken();
        setuserdetail({});
    };

    const addProduct=async(formData)=>{
        try {
            // for (let [key, value] of formData.entries()) {
            //     console.log(key, value);
            //   }
            
            const response = await axios.post(`http://localhost:8087/api/products/add`, formData, {
                headers: {
                    ...getHeader(),
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.data;
            
        } catch (error) {
            alert(error);
        }
    }

    const updateProduct=async(formData)=>{
        try {
            //console.log("formdata:" ,formData);
            
            const response = await axios.post(`http://localhost:8087/api/products/update`, formData, {
                headers: {
                    ...getHeader(),
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.data;
            
        } catch (error) {
            alert(error);
        }
    }



  return (
    <Mycontext.Provider value={
        {
            loading,
            isAuthenticated,
            userdetail,
            token,
            setuserdetail,
            settoken,
            setisAuthenticated,
            setLoading,
            registerUser,
           loginUser,
           logoutUser,
           addProduct,
           updateProduct,
            
        }}>
       {children}
    </Mycontext.Provider>
  )
}

export default Mystate