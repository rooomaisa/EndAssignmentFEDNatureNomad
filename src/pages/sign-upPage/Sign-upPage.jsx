import React, {useState} from 'react';
import {Link} from "react-router-dom";
import './Sign-upPage.css'

function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit (e) {
        e.preventDefault();
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


            </form>
            <p>Heb je al een account? Je kunt je <Link to="/sign-in">hier</Link> inloggen.</p>
        </>

    );
}

export default SignUp;