import React, { useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheckCircle, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import Mycontext from '../context/Mycontext';

const NotificationDropdown = () => {
  const {
    notifications,
    unreadCount,
    isNotificationPanelOpen,
    toggleNotificationPanel,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    fetchNotifications
  } = useContext(Mycontext);

  // Auto-refresh notifications when panel opens
  useEffect(() => {
    if (isNotificationPanelOpen) {
      fetchNotifications().catch(err => 
        console.error("Failed to refresh notifications:", err)
      );
    }
  }, [isNotificationPanelOpen, fetchNotifications]);

  const handleNotificationClick = async (notification) => {
    if (!notification.readStatus) {
      await markNotificationAsRead(notification.id);
    }
    
  };

  return (
    <div className="relative">
      <motion.button
        onClick={toggleNotificationPanel}
        className="p-2 rounded-full relative hover:bg-gray-700/50 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <motion.span 
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isNotificationPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700"
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-white">Notifications</h3>
              {notifications.length > 0 && (
                <button 
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-teal-400 hover:text-teal-300 flex items-center"
                >
                  <FiCheckCircle className="mr-1" size={14} />
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No notifications</div>
              ) : (
                notifications.map(notification => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer ${
                      !notification.readStatus ? 'bg-gray-700/30' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-white">{notification.message}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-400">
                          <FiClock className="mr-1" size={12} />
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      {!notification.readStatus && (
                        <span className="h-2 w-2 rounded-full bg-teal-400"></span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;