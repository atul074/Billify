
import Mycontext from './Mycontext';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function Mystate({children}) {
   
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setisAuthenticated] = useState(false);
    const [userdetail, setuserdetail] = useState({});
    const [token, settoken] = useState();
    const [allProducts, setAllProducts] = useState(null); // cached data
    const [allTemplates, setAllTemplates] = useState(null);
    const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);

    //notification ka part
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
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
            setInitialAuthCheckDone(true);
            setLoading(false);
            return res;
        } catch (error) {
        alert("Invalid Credentials / Account does not exist");
        throw error;
        }
      };

      useEffect(() => {
        if (initialAuthCheckDone) return;
      
        const user = localStorage.getItem("authToken");
        const userdata1 = localStorage.getItem("userDTO");
      console.log(user);
      
        if (user && userdata1) {
          setisAuthenticated(true);
          settoken(user);
          setuserdetail(JSON.parse(userdata1));
        }
        setInitialAuthCheckDone(true);
      }, [initialAuthCheckDone]);


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
    if (!isAuthenticated || !token) return;
  
    const socket = new SockJS('http://localhost:8087/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.debug('[WS]', str),
  
      onConnect: () => {
        console.log('WebSocket connected');
 
        const panelOpenRef = { current: isNotificationPanelOpen };

        stompClient.current.subscribe(
          `/topic/notifications`,
          (message) => {
            try {
              console.log("subscribe",message.body);
              
              const notification = JSON.parse(message.body);
              setUnreadCount(prev => prev +1);
              // Show alert for new notifications
              if (!panelOpenRef.current) {
                showNewNotificationAlert(notification);
              }
            } catch (error) {
              console.error('Failed to process notification:', error);
            }
          },
          { id: 'notifications-sub' }
        );
  
        if (isNotificationPanelOpen) {
          fetchNotifications();
        }
      },
  
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers.message);
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      }
    });

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    stompClient.current.activate();
  
    return () => {
      if (stompClient.current?.active) {
        stompClient.current.deactivate();
      }
    };
  }, [isAuthenticated, token, isNotificationPanelOpen ]);
  
  // Calculate unread count from notifications array
  const updateUnreadCount = (notifications) => {
    const count = notifications.filter(n => !n.readStatus).length;
    setUnreadCount(count);
    return count;
  };

  // Toggle notification panel with auto-refresh
  const toggleNotificationPanel = async () => {
    const willOpen = !isNotificationPanelOpen;
    setIsNotificationPanelOpen(willOpen);
    console.log("toggle notifi panel");
    
    if (willOpen) {
      try {
        await fetchNotifications();
      } catch (error) {
        console.error("Failed to refresh notifications:", error);
      }
    }
  };

  //get unread count from server
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
  
  //fetch motification
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:8087/api/notifications', {
        headers: getHeader(),
        params: { _: Date.now() } // Prevent caching
      });
      
      const sortedNotifications = res.data.notifications.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setNotifications(prev => {
        // Only update if notifications actually changed
        if (JSON.stringify(prev) !== JSON.stringify(sortedNotifications)) {
          return sortedNotifications;
        }
        return prev;
      });
      updateUnreadCount(sortedNotifications);
      return sortedNotifications;
    } catch (error) {
      console.error("Notification fetch failed:", error);
      throw error;
    }
  };

  // mark single notification as read
  const markNotificationAsRead = async (id) => {
    const previousState = notifications;
    
    // Optimistic update
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, readStatus: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  
    try {
      await axios.post(
        `http://localhost:8087/api/notifications/${id}/read`, 
        {}, 
        { headers: getHeader() }
      );
    } catch (error) {
      // Rollback on failure
      setNotifications(previousState);
      updateUnreadCount(previousState);
      console.error("Failed to mark as read:", error);
    }
  };
  
  // mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    const previousState = notifications;
    
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, readStatus: true })));
    setUnreadCount(0);
  
    try {
      await axios.post(
        'http://localhost:8087/api/notifications/mark-all-read', 
        {}, 
        { headers: getHeader() }
      );
    } catch (error) {
      // Rollback on failure
      setNotifications(previousState);
      updateUnreadCount(previousState);
      console.error("Failed to mark all as read:", error);
    }
  };
  
 
  const showNewNotificationAlert = (notification) => {
   
    console.log("New notification:", notification.message);
   
  };
  
 
  


  return (
    <Mycontext.Provider value={
        {
            loading, isAuthenticated,   userdetail, token, allTemplates,
            notifications,unreadCount, isNotificationPanelOpen,

            setuserdetail, settoken,  setisAuthenticated, setLoading,
            registerUser, loginUser, logoutUser,
            addProduct, updateProduct, getAllProducts, getProductById,deleteProduct,
            purchaseProduct,sellProduct,
            getAllTransactions, getTransactionById,
            getAllTemplates, uploadTemplate, deleteTemplate, renameTemplate, setDefaultTemplate,  getDefaultTemplate,

            fetchNotifications, fetchUnreadCount, markNotificationAsRead, markAllNotificationsAsRead,
            setIsNotificationPanelOpen,toggleNotificationPanel
         

        }}>
       {children}
    </Mycontext.Provider>
  )
}

export default Mystate