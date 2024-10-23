import React from 'react';
import {createContext, useState} from "react";
import {useNavigate} from "react-router-dom";

export const AuthContext = createContext ({});

function AuthContextProvider({children}) {
    const [isAuth, setIsAuth]= useState ({ isAuth:false, user:''});
    const navigate = useNavigate();

    function login(email){
        console.log(`logged in`);
        setIsAuth({ isAuth:true, user:email});
        navigate('/profile');
    }

    function logout() {
        console.log(`logged out`);
        setIsAuth({ isAuth:false, user:''});
        navigate(`/`);
    }

    const contextData = {
        isAuth: isAuth,
        user: isAuth.user,
        login: login,
        logout: logout,
    };


    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}


export default AuthContextProvider;