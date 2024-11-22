import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import './Sign-upPage.css'
import axios from "axios";
import Button from "../../components/button/Button.jsx";

function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate= useNavigate();

    async function handleSubmit (e) {
        e.preventDefault();
        console.log(email, username, password);

        setLoading(true);
        setError('');

        try {
            await axios.post('https://api.datavortex.nl/naturenomad/users', {
                username: username,
                email: email,
                password: password,
                info: 'testinfo',
                "authorities": [
                    {
                        "authority": "USER"
                    }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': 'naturenomad:Ic0HJDZjRv9QEebv4tta'
                }
            });

            navigate ('/sign-in');
            console.log("User registered successfully");

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
            <div className="inner-container signup-page">
                <h1 className="signup-title">Sign-up</h1>
                <p className="signup-description">Discover how amazing NatureNomad is!</p>

                <form onSubmit={handleSubmit} className="signup-form">
                    <label htmlFor="email-field" className="signup-label">
                        Emailadres:
                        <input
                            type="email"
                            id="email-field"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="signup-input"
                        />
                    </label>

                    <label htmlFor="username-field" className="signup-label">
                        Gebruikersnaam:
                        <input
                            type="text"
                            id="username-field"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="signup-input"
                        />
                    </label>

                    <label htmlFor="password-field" className="signup-label">
                        Wachtwoord:
                        <input
                            type="password"
                            id="password-field"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="signup-input"
                        />
                    </label>

                    <Button text="Sign-up" type="submit" className="btn signup-button" />

                </form>

                <p className="signup-login-redirect">
                    Already have a account? Sign-in <Link to="/sign-in" className="signup-link">here</Link>
                </p>
            </div>
        </div>
        </div>
    );
}

export default SignUp;