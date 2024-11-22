
import React from "react";

function Button({ text, onClick, className, type  = "button", disabled = false }) {
    return (
        <button
            type={type}
            className={`btn ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default Button;
