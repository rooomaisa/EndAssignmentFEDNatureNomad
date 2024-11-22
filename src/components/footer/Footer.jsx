import React from 'react';
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="outer-container footer">
            <div className="inner-container footer-content">

                <div className="footer-branding">
                    <h3>NatureNomad</h3>
                    <p>Built with ❤ for exploring nature's beauty.</p>
                </div>


                <nav className="footer-nav">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/search">Search</Link></li>
                        <li><Link to="/myfavourites">My Favourites</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                    </ul>
                </nav>


                <div className="footer-copyright">
                    <p>&copy; {new Date().getFullYear()} NatureNomad. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;