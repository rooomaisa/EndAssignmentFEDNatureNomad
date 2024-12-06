import React, {useContext, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext.jsx";
import axios from "axios";
import './Sign-InPage.css';
import Button from "../../components/button/Button.jsx";

function SignIn() {
    const {login} = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();


    async function handleSubmit (e) {
        e.preventDefault();
        // login(username);

        setLoading(true);
        setError('');

        try {
            const response =
                await axios.post('https://api.datavortex.nl/naturenomad/users/authenticate', {
                    username: username,
                    password: password,
                });
            const token = response.data.jwt;

            login(token);
            navigate("/profile")

        } catch (e) {
            console.error(e);
            setError(`Something went wrong: ` + e.message);
        }
        finally {
            setLoading(false);
        }
    }


    return (
        <div className="page-wrapper">
        <div className="outer-container">
            <div className="inner-container signin-page">
                <h1 className="signin-title">"Welcome Back, Explorer!"</h1>
                <p className="signin-description">
                    "Adventure awaits! Log in to continue your journey into the wild."
                </p>

                <form onSubmit={handleSubmit} className="signin-form">
                    <label htmlFor="username-field" className="signin-label">
                        Gebruikersnaam:
                        <input
                            type="text"
                            id="username-field"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="signin-input"
                        />
                    </label>

                    <label htmlFor="password-field" className="signin-label">
                        Wachtwoord:
                        <input
                            type="password"
                            id="password-field"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="signin-input"
                        />
                    </label>

                    <Button text="Login" type="submit" className="btn signin-button" />


                </form>

                <p className="signin-register-redirect">
                    Dont have a account yet? <Link to="/signup" className="signin-link">Register</Link> first.
                </p>
            </div>
        </div>
        </div>
    );
}

export default SignIn;