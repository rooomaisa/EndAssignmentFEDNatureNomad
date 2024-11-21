import React, { useEffect } from 'react';
// import { useNotification } from "../../context/NotificationContext.jsx";
import './Notification.css';
import notification from "./Notification.jsx";

function Notification({message, type}) {
    console.log("Notification Component Props - Message:", message, "Type:", type);


if (!message) return null;
    console.log('Notification Rendered:', message,type ); // Debugging

    return (
        <div className={`notification notification--${type}`}>
            {message}
        </div>
    );
}

export default Notification;
