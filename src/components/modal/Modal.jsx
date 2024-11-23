import React from 'react';
import './Modal.css';
import Button from "../button/Button.jsx";

function Modal({ isOpen, onClose, title, children, footerButtons }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="modal-close" onClick={onClose}>X</button>

                {/* Title */}
                {title && <h2 className="modal-title">{title}</h2>}

                {/* Content */}
                <div className="modal-content">
                    {children}
                </div>

                {/* Footer Buttons */}
                {footerButtons && (
                    <div className="modal-footer">
                        {footerButtons.map((button, index) => (
                            <Button
                                key={index}
                                onClick={button.onClick}
                                className={button.className}
                                text={button.text}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
        // <div className="modal-overlay" onClick={onClose}>
        //     <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        //         <button className="modal-close" onClick={onClose}>X</button>
        //         {title && <h2 className="modal-title">{title}</h2>}
        //             {children}
        //         {footerButtons && (
        //             <div className="modal-footer">
        //                 {footerButtons.map((button, index) => (
        //                     <Button
        //                         key={index}
        //                         onClick={button.onClick}
        //                         className={button.className}
        //                         text={button.text}
        //                     />
        //                 ))}
        //             </div>
        //         )}
        //     </div>
        // </div>
    );
}

export default Modal;


// import React from 'react';
// import './Modal.css';
// import Button from "../button/Button.jsx";
//
// function Modal({ isOpen, onClose, children }) {
//     if (!isOpen) return null;
//
//     return (
//         <div className="modal-overlay" onClick={onClose}>
//             <div className="modal-container" onClick={(e) => e.stopPropagation()}>
//                 <Button className="modal-close" onClick={onClose} text="X"/>
//                 {children}
//             </div>
//         </div>
//     );
// }
//
// export default Modal;
