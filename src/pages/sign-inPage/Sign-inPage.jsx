import React, {useContext, useState} from 'react';
import {Link} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx";
import './Sign-inPage.css'

function SignIn() {
    const {login} = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit (e) {
        e.preventDefault();
        login(email);
    }


    return (
        <>
            <h1>Inloggen</h1>
            <p>eventuele tekst</p>

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