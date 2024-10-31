import React, {useContext, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext.jsx";
import axios from "axios";
import './Sign-InPage.css';

function SignIn() {
    const {login} = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();


    async function handleSubmit (e) {
        e.preventDefault();
        login(username);
        console.log(username,password);

        setLoading(true);
        setError('');

        try {
            const response =
                await axios.post('https://api.datavortex.nl/naturenomad/users/authenticate', {
                    email: username,
                    password: password,
                });
            const token = response.data.jwt;
            console.log(response.data.jwt);
            login(token);
            navigate('/profile')

        } catch (e) {
            console.error(e);
            setError(`Something went wrong: ` + e.message);
        }
        finally {
            setLoading(false);
        }
    }


    return (
        <>
            <h1>Inloggen</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias cum debitis dolor dolore fuga id molestias qui quo unde?</p>

            <form onSubmit={handleSubmit}>
                <label htmlFor={`email-field`}>
                    Emailadres:
                    <input
                        type={`email`}
                        id={`email-field`}
                        name={`email`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                <label htmlFor={`password-field`}>
                    Password:
                    <input
                        type={`password`}
                        id={`password-field`}
                        name={`password`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>

                <button type={`submit`}>Inloggen</button>
            </form>

            <p>Heb je nog geen account? <Link to="/signup">Registreer</Link> je dan eerst.</p>
        </>
    );
}

export default SignIn;