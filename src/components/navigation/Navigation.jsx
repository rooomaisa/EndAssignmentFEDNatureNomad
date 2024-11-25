import React, {useContext} from 'react';
import {Link, NavLink, useNavigate, useLocation} from "react-router-dom";
import styles from './Navigation.module.css'
import {AuthContext} from "../../context/AuthContext.jsx";
import logo from "/forest.svg";
import Button from "../button/Button.jsx";

function Navigation() {
    const navigate = useNavigate();
    const { isAuth, logout } = useContext(AuthContext);
    const location = useLocation();
    const isHomepage = location.pathname === "/";


    return (
        <nav className={`${styles.nav} ${isHomepage ? styles['nav-overlay'] : ''}`}>
            <Link to="/">
          <span className={styles['logo-container']}>
            <img src={logo} alt="logo" className={styles.logo}/>
            <h3 className={styles.title}>
              NatureNomad
            </h3>
          </span>
            </Link>

            {isAuth ? (
                <div className={styles['auth-links']}>
                    <ul>
                        <li>
                            <NavLink to="/search"
                                     className={({isActive}) => isActive ? styles['active-link'] : styles['default-link']}>
                                Search
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/myfavourites"
                                     className={({isActive}) => isActive ? styles['active-link'] : styles['default-link']}>
                                My Favourites
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile"
                                     className={({isActive}) => isActive ? styles['active-link'] : styles['default-link']}>
                                My Profile
                            </NavLink>
                        </li>
                    </ul>
                    <Button onClick={logout} className={styles['logout-btn']}
                            text= "Log out"
                    />
                </div>
            ) : (
                <div className={styles['guest-links']}>
                    <Button onClick={() => navigate('/sign-in')} className={styles['login-btn']}
                        text="Login"
                    />
                    <Button  onClick={() => navigate('/sign-up')} className={styles['signup-btn']}
                             text="Sign-up"
                    />
                </div>
            )}
        </nav>


    );
}

export default Navigation;