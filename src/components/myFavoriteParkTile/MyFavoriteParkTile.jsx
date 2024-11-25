import React, {useContext} from 'react';
import './MyFavoriteParkTile.css'
import { SavedParksContext } from '../../context/SavedParksContext';
import Button from "../button/Button.jsx";

const MyFavoriteParkTile = ({ park }) => {
    const {  deletePark } = useContext(SavedParksContext);

    return (
        <div className="park-tile">
            <img src={park.imageUrl} alt={`${park.fullName} image`} className="park-image"/>
            <div className="park-info">
                <h3 className="park-title">{park.fullName}</h3>
                <p className="park-description">{park.description}</p>
                {park.directionsUrl && (
                    <a href={park.directionsUrl} target="_blank" rel="noopener noreferrer" className="park-link">
                        Plan your visit
                    </a>
                )}
                <div className="fees">
                    <h4>Entrance Fees</h4>
                    <div className="fees-container">
                        {Array.isArray(park.entranceFees) && park.entranceFees.length > 0 ? (
                            <ul>
                                {park.entranceFees.map((fee, index) => (
                                    <li key={index}>
                                        <strong>{fee.title}</strong>: ${fee.cost} - {fee.description}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>This park is free to visit!</p>
                        )}
                    </div>
                </div>
                <Button className="remove-btn" onClick={() => deletePark(park.parkCode)}
                        text="Remove from Favorites"
                />
            </div>
        </div>
    );
};

export default MyFavoriteParkTile;