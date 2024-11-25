import React from 'react';
import {createContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import validateToken from "../helpers/isTokenValid";
import Loading from "../components/loadingSpinner/LoadingSpinner.jsx";

export const AuthContext = createContext ({});

function AuthContextProvider({children}) {

    const [auth, setAuth]= useState ({
        isAuth:false,
        user: null,
        status: 'pending',
    });
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decoded = jwtDecode(token);
            void validateToken(token, setAuth, setError);
        } else {
            setAuth({
                isAuth: false,
                user: null,
                status: 'done',
            });
        }
    }, [setAuth, setError]);


    async function login(token) {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);

        setLoading(true);
        setError('');

        try {
            const response =
                await axios.get(`https://api.datavortex.nl/naturenomad/users/${decodedToken.sub}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "X-Api-Key": "naturenomad:Ic0HJDZjRv9QEebv4tta",
                    }
                });


            setAuth({
                isAuth: true,
                user: {
                    email: response.data.email,
                    username: response.data.username,
                    id: response.data.id,
                },
                status: 'done',
            });

        } catch (e) {
            console.error(e);
            setError(`Something went wrong: ` + e.message);
            setAuth({
                isAuth: false,
                user: null,
                status: 'done',
            })
        } finally {
            setLoading(false);
        }

        navigate('/profile');
    }

    function logout() {
        localStorage.clear();
        setAuth({
            isAuth: false,
            user: null,
            status: 'done',
        })

        navigate(`/`);
    }

    const contextData = {
        isAuth: auth.isAuth,
        user: auth.user,
        login: login,
        logout: logout,
    };


    return (
        <AuthContext.Provider value={contextData}>
            {auth.status === 'done' ? children : <Loading/> }
        </AuthContext.Provider>
    );
}


export default AuthContextProvider;