import React,{useContext} from 'react';
import {Link} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx";

const ProfilePage = () => {
    const { isAuth, user } = useContext(AuthContext);
    console.log("ProfilePage render - isAuth:", isAuth, "user:", user);

    if (!isAuth || !user) {
        console.log("Redirecting to login - isAuth:", isAuth, "user:", user);
        return (
        <>
            <p> Please log in to view your profile. </p>
            <p> Go to <Link to="/sign-in">Sign-in</Link></p>
        </>
        );
    }


    return (
        <>
            <h1>Profielpagina</h1>
            <section>
                <h2>Gegevens</h2>
                <p><strong>Gebruikersnaam:</strong> {user.username} </p>
                <p><strong>Email:</strong>{user.email}</p>
            </section>
            <section>
                <h2>Strikt geheime profiel-content</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias cum debitis dolor dolore fuga id molestias qui quo unde?</p>
            </section>
            <p>Terug naar de <Link to="/">Homepagina</Link></p>
        </>
    );
};

export default ProfilePage;