import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    // Function to trigger a notification
    const triggerNotification = (message, type = "success") => {
        console.log("Triggering notification:", message, type);
        setNotification({ message, type });

        // Clear the notification after 3 seconds
        setTimeout(() => {
            console.log("Clearing notification");
            setNotification({message: "", type: "" });
        }, 3000);
    };

    return (
        <NotificationContext.Provider value={{ notification, triggerNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

// Custom hook to use the NotificationContext
// export const useNotification = () => useContext(NotificationContext);
export function useNotification() {
    return useContext(NotificationContext);
}
