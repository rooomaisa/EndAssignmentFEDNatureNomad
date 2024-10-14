import React from 'react';
import {NavLink} from "react-router-dom";
import './Navigation.css'

function Navigation() {
    return (
        <nav className={'main-navigation outer-content-container'}>
            <img src="/public/forest.svg" alt="Site Logo" className="main-navigation-logo-button"/>
            <div className={'inner-nav-container'}>
                <ul className={'main-navigation-links'}>
                    <li><NavLink to={'/'}
                                 className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>
                        Home</NavLink>
                    </li>
                    <li><NavLink to={'/search'}
                                 className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>
                        Search</NavLink></li>
                    <li><NavLink to={'/myfavourites'}
                                 className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>
                        My Favourites</NavLink></li>
                    <li><NavLink to={'/sign-in'}
                                 className={({isActive}) => isActive === true ? 'active-link' : 'default-link'}>
                        Sign in</NavLink></li>
                </ul>
            </div>
        </nav>
    );
}

export default Navigation;