import React, {useContext} from 'react';
import { SavedParksContext } from '../../context/SavedParksContext';
import MyFavoriteParkTile from "../../components/myFavoriteParkTile/MyFavoriteParkTile.jsx";

function MyFavouritesPage() {
    const {savedParks} = useContext(SavedParksContext);

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