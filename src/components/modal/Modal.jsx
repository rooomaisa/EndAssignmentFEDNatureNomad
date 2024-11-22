
import React from 'react';
import './Modal.css';
import Button from "../button/Button.jsx";

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <Button className="modal-close" onClick={onClose} text="X"/>
                {children}
            </div>
        </div>
    );
}

export default Modal;
