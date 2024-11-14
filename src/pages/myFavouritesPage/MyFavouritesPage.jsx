import React, {useContext, useEffect} from 'react';
import { SavedParksContext } from '../../context/SavedParksContext';
import MyFavoriteParkTile from "../../components/myFavoriteParkTile/MyFavoriteParkTile.jsx";
import './MyFavouritesPage.css'

function MyFavouritesPage() {
    // const {savedParks,fetchSavedParks, fetchFullParkDetails, fullParkDetails } = useContext(SavedParksContext);
    const { fetchSavedParks, fetchFullParkDetails, fullParkDetails } = useContext(SavedParksContext);

    useEffect(() => {
        console.log('Component mounted. Fetching saved parks...');

        async function fetchData() {
            await fetchSavedParks(); // Fetch saved parks by park codes
            // console.log("Saved parks fetched:", savedParks);
            await fetchFullParkDetails(); // Fetch full details for each park
            console.log("Full park details fetched:", fullParkDetails);
        }
        fetchData();
    }, []);

    if (!fullParkDetails || fullParkDetails.length === 0) {
        return <div>No saved parks yet. Please save some parks!</div>;
    }


    return (
        <div>
            <h1>My favourites</h1>
            <div className={`park-list`}>
                {fullParkDetails.length > 0 ? (
                    fullParkDetails.map((park, index) => {
                        console.log("Rendering park in list:", park);
                        return <MyFavoriteParkTile key={index} park={park}/>;
                    })
                ) : (
                    <p> No parks saved yes Start exploring and add some! </p>
                )}
            </div>
        </div>
    );
}

export default MyFavouritesPage;