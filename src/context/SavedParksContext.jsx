import React, {createContext, useContext, useState} from 'react';
import {AuthContext} from "./AuthContext.jsx";
import axios from "axios";

export const SavedParksContext = createContext({});

function SavedParksProvider({ children }) {
    const {user} = useContext(AuthContext);
    const [savedParks, setSavedParks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState('');

    async function savePark(newPark) {

        const parkAlreadySaved = savedParks.some((park) => park.id === newPark.id);
        if (parkAlreadySaved){
            console.log("this park is already saved");
            setNotification( 'this park is already saved in your favorites ');
            setTimeout(() => setNotification(''), 3000);
            return;
        }


        const updatedParks = [...savedParks, newPark];
        setSavedParks(updatedParks);

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const username = user.username;
            if ( user?.username){

            const response =
                await axios.put(`https://novi.datavortex.nl/users/${username}`,
                    {info: updatedParks},
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                            "X-Api-Key": "naturenomad:Ic0HJDZjRv9QEebv4tta",
                        },
                    }
                );
            setSavedParks(response.data.info)
            console.log('park saves succesfully:', response.data);

            } else {
                console.error("User's username is missing from AuthContext.");
            }

        } catch (e) {
            console.error(e);
            setError(`Something went wrong: ` + e.message);
        } finally {
            setLoading(false);
        }
    }




    return (
        <SavedParksContext.Provider value={{ savedParks, setSavedParks, savePark }}>
            {children}
            {notification && <div className={`notification`}>{notification}</div> }
        </SavedParksContext.Provider>
    );
}

export default SavedParksProvider;
