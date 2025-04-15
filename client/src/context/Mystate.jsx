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
    const [allProducts, setAllProducts] = useState(null); // cached data
    const [allTemplates, setAllTemplates] = useState(null);

    

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
            setAllProducts(null);
            getAllProducts();
            return response.data;
            
        } catch (error) {
            alert(error);
        }
    }

    const updateProduct=async(formData)=>{
        try {
            for (let [key, value] of formData.entries()) {
                     console.log(key, value);
                  }
            
            const response = await axios.put(`http://localhost:8087/api/products/update`, formData, {
                headers: {
                    ...getHeader(),
                    "Content-Type": "multipart/form-data"
                }
            });
            setAllProducts(null);
            getAllProducts();
            return response.data;
            
        } catch (error) {
            alert(error);
        }
    }


    const getAllProducts = async () => {
        console.log(allProducts);
        
        try {
          if (allProducts) return allProducts; // ✅ return cached if already fetched
      
          const response = await axios.get(`http://localhost:8087/api/products/all`);
      
          setAllProducts(response.data); // cache it
          return response.data;
        } catch (error) {
          alert("Failed to fetch products");
          throw error;
        }
      };


    const getProductById=async (productId) => {
        const response = await axios.get(`http://localhost:8087/api/products/${productId}`, {
            headers: getHeader()
        });
        return response.data;
    }

    const deleteProduct=async (productId) => {
        const response = await axios.delete(`http://localhost:8087/api/products/delete/${productId}`, {
            headers: getHeader()
        });

        setAllProducts(null);
        getAllProducts();
        return response.data;
    }


    const purchaseProduct=async(body) =>{
        const response = await axios.post(`http://localhost:8087/api/transactions/purchase`, body, {
            headers: getHeader()
        })
        return response.data;
    }

    const sellProduct=async(body) =>{
        const response = await axios.post(`http://localhost:8087/api/transactions/sell`, body, {
            headers: getHeader()
        })
        return response.data;
    }


    const getAllTransactions=async() =>{
        const response = await axios.get(`http://localhost:8087/api/transactions/all`, {
            headers: getHeader()
        })
        return response.data;
    }

    const getTransactionById=async(transactionId) =>{
        const response = await axios.get(`http://localhost:8087/api/transactions/${transactionId}`, {
            headers: getHeader()
        })
        return response.data;
    }


    // Get all templates (cached)
const getAllTemplates = async () => {
    try {
      if (allTemplates) return allTemplates;
      const res = await axios.get("http://localhost:8087/api/templates", {
        headers: getHeader(),
      });
      setAllTemplates(res.data);
      return res.data;
    } catch (error) {
      alert("Error fetching templates");
      throw error;
    }
  };
  
  // Upload new template
  const uploadTemplate = async (formData) => {
    try {
      const res = await axios.post("http://localhost:8087/api/templates/upload", formData, {
        headers: {
          ...getHeader(),
          "Content-Type": "multipart/form-data"
        }
      });
      setAllTemplates(null);
      await getAllTemplates();
      return res.data;
    } catch (error) {
      alert("Error uploading template");
      throw error;
    }
  };
  
  // Delete template
  const deleteTemplate = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8087/api/templates/${id}`, {
        headers: getHeader()
      });
      setAllTemplates(prev => prev?.filter(template => template.id !== id));
      return res.data;
    } catch (error) {
      alert("Error deleting template");
      throw error;
    }
  };
  
  // Rename template
  const renameTemplate = async (id, newName) => {
    try {
      const res = await axios.put(`http://localhost:8087/api/templates/rename/${id}`, { newName }, {
        headers: getHeader()
      });
      setAllTemplates(null);
      await getAllTemplates();
      return res.data;
    } catch (error) {
      alert("Error renaming template");
      throw error;
    }
  };
  
  // Set default template
  const setDefaultTemplate = async (id) => {
    try {
      const res = await axios.post(`http://localhost:8087/api/templates/default/${id}`, {}, {
        headers: getHeader()
      });
      setAllTemplates(null);
      await getAllTemplates();
      return res.data;
    } catch (error) {
      alert("Error setting default template");
      throw error;
    }
  };

  const getDefaultTemplate = async () => {
    try {
      const res = await axios.get(`http://localhost:8087/api/templates/default`, {
        headers: getHeader(),
      });
      return res.data;
    } catch (error) {
      alert("Error fetching default template");
      throw error;
    }
  };

  const getHeader=()=> {
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    }
};
  


  return (
    <Mycontext.Provider value={
        {
            loading, isAuthenticated,   userdetail, token, allTemplates,
            setuserdetail, settoken,  setisAuthenticated, setLoading,
            registerUser, loginUser, logoutUser,
            addProduct, updateProduct, getAllProducts, getProductById,deleteProduct,
            purchaseProduct,sellProduct,
            getAllTransactions, getTransactionById,
            getAllTemplates, uploadTemplate, deleteTemplate, renameTemplate, setDefaultTemplate,  getDefaultTemplate,
         

        }}>
       {children}
    </Mycontext.Provider>
  )
}

export default Mystate