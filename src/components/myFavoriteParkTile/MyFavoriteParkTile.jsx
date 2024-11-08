import React from 'react';
import './MyFavoriteParkTile.css'

const myFavoriteParkTile = ({ park }) => {
    return (
        <div className="park-tile">
            <h3>{park.fullName}</h3>
            <p>{park.location}</p>
            <p>{park.description}</p>
        </div>
    );
};

export default myFavoriteParkTile;