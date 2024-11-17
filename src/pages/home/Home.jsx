import React from 'react';
import {Link} from "react-router-dom";
import './Home.css'


function Home() {
    return (
        <section className="outer-container home-page">
        <div className="inner-container">
            <h1 className = "home-title">Welcome to NatureNomad</h1>
            <h2 className="home-subtitle">"Find Your Perfect Wilderness Escape"</h2>
            <Link to={`/search`}>
            <button className="btn home-btn">Start your search</button>
            </Link>
        </div>
        </section>
    );
}

export default Home;