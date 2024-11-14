import React, {useContext, useEffect} from 'react';
import { SavedParksContext } from '../../context/SavedParksContext';
import MyFavoriteParkTile from "../../components/myFavoriteParkTile/MyFavoriteParkTile.jsx";
import './MyFavouritesPage.css'

function MyFavouritesPage() {
    const {savedParks,fetchSavedParks } = useContext(SavedParksContext);

    useEffect(() => {
        console.log('Component mounted. Fetching saved parks...');
        fetchSavedParks(); // Ensure this is called
    }, []);


    if (!savedParks || savedParks.length === 0) {
        return <div>No saved parks yet. Please save some parks!</div>;
    }

    return (
        <div>
            <h1>My favourites</h1>
            <div className={`park-list`}>
                {savedParks.length > 0 ? (
                    savedParks.map((park, index) => (
                        <MyFavoriteParkTile key={index} park={park}/>
                    ))
                ) : (
                    <p> No parks saved yes Start exploring and add some! </p>
                )}
            </div>
        </div>
    );
}

export default MyFavouritesPage;