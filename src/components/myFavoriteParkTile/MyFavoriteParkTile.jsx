import React, {useContext} from 'react';
import './MyFavoriteParkTile.css'
import { SavedParksContext } from '../../context/SavedParksContext';

const MyFavoriteParkTile = ({ park }) => {
    const {  deletePark } = useContext(SavedParksContext);

    console.log("Rendering park in tile:", park);

    return (
        <div className="park-tile">
            <h3>{park.fullName}</h3>
            {park.imageUrl && (
                <img src={park.imageUrl} alt={`${park.fullName} image`} width="100" height="75" />
            )}
            <p>Location: {park.location}</p>
            <p>{park.description}</p>


            {park.directionsUrl && (
                <a href={park.directionsUrl} target="_blank" rel="noopener noreferrer">
                    Plan your visit
                </a>
            )}


            {Array.isArray(park.entranceFees) && park.entranceFees.length > 0 ? (
                <div className="fees">
                    <h4>Entrance Fees</h4>
                    <ul>
                        {park.entranceFees.map((fee, index) => (
                            <li key={index}>
                                <strong>{fee.title}</strong>: ${fee.cost} - {fee.description}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="fees">
                    <h4>Entrance Fees</h4>
                    <p>This park is free to visit!</p>
                </div>
            )}


            {Array.isArray(park.entrancePasses) && park.entrancePasses.length > 0 ? (
                <div className="passes">
                    <h4>Entrance Passes</h4>
                    <ul>
                        {park.entrancePasses.map((pass, index) => (
                            <li key={index}>
                                <strong>{pass.title}</strong>: ${pass.cost} - {pass.description}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="passes">
                    <h4>Entrance Passes</h4>
                    <p>No passes available for this park.</p>
                </div>
            )}



            <button onClick={() => deletePark(park.parkCode)}>Remove from Favorites</button>
        </div>

    );
};

export default MyFavoriteParkTile;