import React, {useContext} from 'react';
import {Link, NavLink, useNavigate} from "react-router-dom";
import styles from './Navigation.module.css'
import {AuthContext} from "../../context/AuthContext.jsx";
import logo from "/forest.svg";

function Navigation() {
    const navigate = useNavigate();
    const { isAuth, logout } = useContext(AuthContext);
    console.log("Authenticatie status:", isAuth);


    return (
        <nav className={styles.nav}>
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
                                My profile
                            </NavLink>
                        </li>
                    </ul>
                    <button type="button" onClick={logout} className={styles['logout-btn']}>
                        Log out
                    </button>
                </div>
            ) : (
                <div className={styles['guest-links']}>
                    <button type="button" onClick={() => navigate('/sign-in')} className={styles['login-btn']}>
                        Log in
                    </button>
                    <button type="button" onClick={() => navigate('/sign-up')} className={styles['signup-btn']}>
                        Registreren
                    </button>
                </div>
            )}
        </nav>












        // <nav className={'main-navigation outer-content-container'}>
        //
        //   {/*  <Link to="/">*/}
        //   {/*<span className="logo-container">*/}
        //   {/*  <img src={logo} alt="logo"/>*/}
        //   {/*  <h3>*/}
        //   {/*    Banana Security*/}
        //   {/*  </h3>*/}
        //   {/*</span>*/}
        //   {/*  </Link>*/}
        //
        //     {/*die home link moet eigenlijk in dat logo komen!!!  */}
        //
        //     {/*<li><NavLink to={'/'}*/}
        //     {/*             className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>*/}
        //     {/*    Home</NavLink>*/}
        //     {/*</li>*/}
        //
        //
        //     <img src="/forest.svg" alt="Site Logo" className="main-navigation-logo-button"/>
        //     <div className={'inner-nav-container'}>
        //         <ul className={'main-navigation-links'}>
        //
        //
        //
        //             {isAuth ? (
        //                 <div>
        //                 <ul>
        //             <li><NavLink to={'/search'}
        //                          className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>
        //                 Search</NavLink></li>
        //             <li><NavLink to={'/myfavourites'}
        //                          className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>
        //                 My Favourites</NavLink></li>
        //             {/*<li><NavLink to={'/sign-in'}*/}
        //             {/*             className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>*/}
        //             {/*    Sign in</NavLink></li>*/}
        //
        //                 {/*<span> Welcome, {user} ! </span>*/}
        //                 <button
        //                     type="button"
        //                     onClick={logout}
        //
        //                 >
        //                     Log uit
        //                 </button>
        //             </ul>
        //             </div>
        //
        //         ):(
        //             <div>
        //                 <button
        //                     type="button"
        //                     onClick={() => navigate('/signin')}
        //                 >
        //                     Log in
        //                 </button>
        //                 <button
        //                     type="button"
        //                     onClick={() => navigate('/signup')}
        //                 >
        //                     Registreren
        //                 </button>
        //             </div>
        //         )}
        //     </div>
        // </nav>
    );
}

export default Navigation;