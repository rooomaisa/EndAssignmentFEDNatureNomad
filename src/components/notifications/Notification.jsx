import React, { useEffect } from 'react';
import './Notification.css';

function Notification({ message, type = 'success', onClose, duration = 3000 }) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer); // Clear timeout on unmount
    }, [onClose, duration]);

    return (
        <div className={`notification notification--${type}`}>
            <p>{message}</p>
        </div>
    );
}

export default Notification;
