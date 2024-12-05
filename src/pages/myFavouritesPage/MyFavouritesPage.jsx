import React, {useContext, useEffect} from 'react';
import { SavedParksContext } from '../../context/SavedParksContext';
import MyFavoriteParkTile from "../../components/myFavoriteParkTile/MyFavoriteParkTile.jsx";
import './MyFavouritesPage.css'

function MyFavouritesPage() {
    const { fetchSavedParks, fetchFullParkDetails, fullParkDetails } = useContext(SavedParksContext);

    useEffect(() => {
        async function fetchData() {
            await fetchSavedParks();
            await fetchFullParkDetails();
        }
        fetchData();
    }, []);



    return (
        <div className="page-wrapper">
        <section className="my-favourites-page outer-container">
            <div className="inner-container">
                {fullParkDetails.length === 0 ? (
                    <p className="empty-message">You don't have any favorite parks yet. Start exploring!</p>
                ) : (
                    <div className="park-list">
                        {fullParkDetails.map((park) => (
                            <MyFavoriteParkTile key={park.parkCode} park={park}/>
                        ))}
                    </div>
                )}
            </div>
        </section>
        </div>

    );
}

export default MyFavouritesPage;