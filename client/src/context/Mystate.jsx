import { useNavigate } from 'react-router-dom';
import Mycontext from './Mycontext';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function Mystate({children}) {
   // const navigate= useNavigate();
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setisAuthenticated] = useState(false);
    const [userdetail, setuserdetail] = useState({});
    const [token, settoken] = useState();
    const [allProducts, setAllProducts] = useState(null); // cached data
    const [allTemplates, setAllTemplates] = useState(null);

    //notification ka part
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const stompClient = useRef(null);
    

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
        });
        setAllProducts(null);
        getAllProducts();
        return response.data;
    }

    const sellProduct=async(body) =>{
        const response = await axios.post(`http://localhost:8087/api/transactions/sell`, body, {
            headers: getHeader()
        });
        setAllProducts(null);
        getAllProducts();
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
      console.log(res);
      
      return res;
    } catch (error) {
      alert("Error fetching default template");
      throw error;
    }
  };


  //notification ka code 

  useEffect(() => {
    if (isAuthenticated && token) {
      // Initialize WebSocket connection with proper headers
      const socket = new SockJS('http://localhost:8087/ws');
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}` // Add auth token to headers
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => console.debug('STOMP:', str), // Better debugging
        onConnect: () => {
          console.log('WebSocket connected');
          
          // Subscribe with proper error handling
          try {
            stompClient.current.subscribe(
              `/user/queue/notifications`,
              (message) => {
                try {
                  const notification = JSON.parse(message.body);
                  setNotifications(prev => [notification, ...prev]);
                  setUnreadCount(prev => prev + 1);
                } catch (parseError) {
                  console.error('Error parsing notification:', parseError);
                }
              },
              { id: 'notifications-sub' } // Add subscription ID
            );
  
            stompClient.current.subscribe(
              `/user/queue/notifications-update`,
              (message) => {
                try {
                  const update = JSON.parse(message.body);
                  if (update.type === 'all_read') {
                    setNotifications(prev => 
                      prev.map(n => ({ ...n, readStatus: true }))
                    );
                    setUnreadCount(0);
                  }
                } catch (parseError) {
                  console.error('Error parsing update:', parseError);
                }
              },
              { id: 'updates-sub' }
            );
          } catch (subError) {
            console.error('Subscription error:', subError);
          }
  
          fetchNotifications().catch(err => 
            console.error('Error fetching notifications:', err)
          );
        },
        onStompError: (frame) => {
          console.error('STOMP protocol error:', frame.headers.message);
        },
        onWebSocketError: (event) => {
          console.error('WebSocket error:', event);
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected');
        }
      });
  
      stompClient.current.activate();
  
      return () => {
        if (stompClient.current?.active) {
          // Properly unsubscribe before deactivating
          stompClient.current.unsubscribe('notifications-sub');
          stompClient.current.unsubscribe('updates-sub');
          stompClient.current.deactivate().then(() => {
            console.log('STOMP client deactivated');
          });
        }
      };
    }
  }, [isAuthenticated, token]);
  
  // Add these notification functions
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:8087/api/notifications', {
        headers: getHeader()
      });
      setNotifications(res.data.notifications);
      
      // Calculate initial unread count
      const unread = res.data.notifications.filter(n => !n.readStatus).length;
      setUnreadCount(unread);
      return res.data.notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  };
  
  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('http://localhost:8087/api/notifications/unread-count', {
        headers: getHeader()
      });
      setUnreadCount(res.data.count);
      return res.data.count;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  };
  
  const markNotificationAsRead = async (id) => {
    try {
      await axios.post(`http://localhost:8087/api/notifications/${id}/read`, {}, {
        headers: getHeader()
      });
      // Optimistic update
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, readStatus: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  };
  
  const markAllNotificationsAsRead = async () => {
    try {
      await axios.post('http://localhost:8087/api/notifications/mark-all-read', {}, {
        headers: getHeader()
      });
      // Optimistic update
      setNotifications(prev => 
        prev.map(n => ({ ...n, readStatus: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
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

            notifications,
            unreadCount,
            fetchNotifications,
            fetchUnreadCount,
            markNotificationAsRead,
            markAllNotificationsAsRead,
         

        }}>
       {children}
    </Mycontext.Provider>
  )
}

export default Mystate