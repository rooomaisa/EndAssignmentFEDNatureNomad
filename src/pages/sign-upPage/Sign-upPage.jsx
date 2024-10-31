import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import './Sign-upPage.css'
import axios from "axios";

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
        <>
            <h1>Registreren</h1>
            <p>tekst over hoe geweldig de app is</p>

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

                <label htmlFor={`username-field`}>
                    Username:
                    <input
                        type={`text`}
                        id={`username-field`}
                        name={`username`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                <button
                    type="submit"
                    className="form-button"
                >
                    Sign-up
                </button>


            </form>
            <p>Heb je al een account? Je kunt je <Link to="/sign-in">hier</Link> inloggen.</p>
        </>

    );
}

export default SignUp;