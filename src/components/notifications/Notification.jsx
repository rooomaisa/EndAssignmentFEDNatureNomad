import React from 'react';
import './Notification.css';


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
