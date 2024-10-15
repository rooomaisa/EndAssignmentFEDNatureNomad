import React from 'react';
import {Link} from "react-router-dom";
import './Home.css'


function Home() {
    return (
        <section className={'page-container'}>
        <div className={`inner-content-container__home-content`}>
            <h1>Welcome to NatureNomad</h1>
            <h2>"Find Your Perfect Wilderness Escape"</h2>
            <Link to={`/search`}>
            <button className={`homepage-btn btn`}>Start your search</button>
            </Link>
        </div>
        </section>
    );
}

export default Home;