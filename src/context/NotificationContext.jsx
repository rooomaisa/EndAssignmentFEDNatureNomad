import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);


    const triggerNotification = (message, type = "success") => {
        setNotification({ message, type });

        setTimeout(() => {
            setNotification({message: "", type: "" });
        }, 3000);
    };

    return (
        <NotificationContext.Provider value={{ notification, triggerNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};


export function useNotification() {
    return useContext(NotificationContext);
}
