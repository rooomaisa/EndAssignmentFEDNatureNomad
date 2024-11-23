import React from "react";
import "./LoadingSpinner.css"

function Loading({ size = 40, color = "var(--color-primary)", message = "" }) {
    return (
        <div className="loading-spinner">
            <div
                className="spinner-circle"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    borderColor: `${color} transparent transparent transparent`,
                }}
            ></div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
}

export default Loading;
