import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from "axios";
import {AuthContext} from "./AuthContext.jsx";

export const SavedParksContext = createContext({});

function SavedParksProvider({ children }) {
    const { user } = useContext(AuthContext);
    const initialSavedParks = JSON.parse(localStorage.getItem('savedParks') || '[]');
    const [savedParks, setSavedParks] = useState(initialSavedParks);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState('');

    async function fetchSavedParks() {
        if (!user) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await axios.get(
                `https://api.datavortex.nl/naturenomad/users/${user.username}/info`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            const fetchedParks = JSON.parse(response.data.info);
            setSavedParks(fetchedParks);
            localStorage.setItem('savedParks', JSON.stringify(fetchedParks));
        } catch (e) {
            console.error("Error fetching saved parks:", e);
            setError("Something went wrong while fetching saved parks.");
        } finally {
            setLoading(false);
        }
    }

    async function savePark(newPark) {

        const parkAlreadySaved = savedParks.some((park) => park.parkCode === newPark.parkCode);
        if (parkAlreadySaved) {
            console.log("This park is already saved");
            setNotification('This park is already saved in your favorites');
            setTimeout(() => setNotification(''), 3000);
            return;
        }

        const updatedParks = [...savedParks, newPark];
        setSavedParks(updatedParks);

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const parksDataString = JSON.stringify(updatedParks);


            console.log("Data to be sent to backend (info):", parksDataString);
            console.log("Using username:", user.username);


            const response = await axios.put(
                `https://api.datavortex.nl/naturenomad/users/${user.username}`,
                { info: parksDataString },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            setSavedParks(response.data.info)
            // const savedParksFromResponse = JSON.parse(response.data.info);
            // setSavedParks(savedParksFromResponse);
            console.log('Park saved successfully:', response.data);

        } catch (e) {
            console.error(e);
            setError(`Something went wrong: ` + e.message);
        } finally {
            setLoading(false);
        }
    }



    async function deletePark(parkCode) {
        const updatedParks = savedParks.filter((park) => park.parkCode !== parkCode);
        setSavedParks(updatedParks);

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const parksDataString = JSON.stringify(updatedParks);

            const response = await axios.put(
                `https://api.datavortex.nl/naturenomad/users/${user.username}`,
                { info: parksDataString },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSavedParks(JSON.parse(response.data.info));
            console.log('Park deleted successfully:', response.data);
        } catch (e) {
            console.error(e);
            setError(`Something went wrong: ` + e.message);
        } finally {
            setLoading(false);
        }
    }

    // useEffect(() => {
    //     if (user) {
    //         fetchSavedParks();
    //     }
    // }, [user]);




    return (
        <SavedParksContext.Provider value={{ savedParks, setSavedParks, savePark, deletePark,  }}>
            {children}
            {notification && <div className={`notification`}>{notification}</div> }
        </SavedParksContext.Provider>
    );
}

export default SavedParksProvider;
