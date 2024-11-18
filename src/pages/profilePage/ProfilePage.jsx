import React,{useContext} from 'react';
import {Link} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx";
import './ProfilePage.css'

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
            <section className="outer-container profile-page">
                <div className="inner-container">
            <h1 className="profile-title">Your "InnerNature" profile page</h1>
            <section className="profile-detials">
                <h2>User information</h2>
                <p><strong>Gebruikersnaam:</strong> {user.username} </p>
                <p><strong>Email:</strong>{user.email}</p>
            </section>
            <section className="profile-content">
                <h2>Welcome to NatureNomad! </h2>
                <p>Adventure is calling, and you’re just a click away from answering it! Discover the beauty of national parks, create your ultimate bucket list, and start dreaming big. Whether you’re a trailblazer or a daydreamer, NatureNomad is here to help you turn your wildest adventures into reality. Pack your curiosity, and let’s explore the wonders of the great outdoors together!</p>
            </section>
            <p>Start exploring <Link to="/search">here</Link></p>
                </div>
            </section>
        </>
    );
};

export default ProfilePage;