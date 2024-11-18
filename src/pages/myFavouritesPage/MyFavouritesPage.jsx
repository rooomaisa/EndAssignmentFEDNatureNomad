import React, {useContext, useEffect} from 'react';
import { SavedParksContext } from '../../context/SavedParksContext';
import MyFavoriteParkTile from "../../components/myFavoriteParkTile/MyFavoriteParkTile.jsx";
import './MyFavouritesPage.css'

function MyFavouritesPage() {
    const { fetchSavedParks, fetchFullParkDetails, fullParkDetails } = useContext(SavedParksContext);

    useEffect(() => {
        console.log('Component mounted. Fetching saved parks...');

        async function fetchData() {
            await fetchSavedParks();
            await fetchFullParkDetails();
            console.log("Full park details fetched:", fullParkDetails);
        }
        fetchData();
    }, []);

    if (!fullParkDetails || fullParkDetails.length === 0) {
        return <div>No saved parks yet. Please save some parks!</div>;
    }


    return (
        <section className="outer-container my-favourites-page">
            <div className="inner-container">
            <h1 className="text-center header-gradient">Wilderness Wishlist</h1>
            <div className="park-list">
                {fullParkDetails.length > 0 ? (
                    fullParkDetails.map((park, index) => {
                        console.log("Rendering park in list:", park);
                        return <MyFavoriteParkTile key={index} park={park}/>;
                    })
                ) : (
                    <p className="text-center"> No parks saved yes Start exploring and add some! </p>
                )}
            </div>
        </div>
        </section>
    );
}

export default MyFavouritesPage;