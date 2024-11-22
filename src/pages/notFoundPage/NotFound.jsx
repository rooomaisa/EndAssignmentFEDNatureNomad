import React from 'react';
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
    return (
        <div className="page-wrapper not-found-page">
            <h1>Oops! Page Not Found</h1>
            <p>The page you are looking for does not exist or has been moved.</p>
            <Link to="/" className="btn btn--primary">Go Back Home</Link>
        </div>
    );
}

export default NotFound;