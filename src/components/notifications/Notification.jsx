import React, { useEffect } from 'react';
import { useNotification } from "../../context/NotificationContext.jsx";
import './Notification.css';

function Notification() {

const { notification } = useNotification();

if (!notification) return null;

    return (
        <div className={`notification notification--${notification.type}`}>
            {notification.message}
        </div>
    );
}

export default Notification;
