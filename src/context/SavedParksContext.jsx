import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from "axios";
import {AuthContext} from "./AuthContext.jsx";
import { useNotification } from "./NotificationContext";


export const SavedParksContext = createContext({});

function SavedParksProvider({ children }) {
    const { user } = useContext(AuthContext);
    const initialSavedParks = JSON.parse(localStorage.getItem('savedParks') || '[]');
    const [savedParks, setSavedParks] = useState(initialSavedParks);
    const [fullParkDetails, setFullParkDetails] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState('');
    const { triggerNotification } = useNotification();


    useEffect(() => {
        if (user) {
            fetchSavedParks();
        }
    }, [user]);



    async function savePark(newPark) {

        if (!newPark || !newPark.parkCode) {
            triggerNotification("Invalid park data provided.", "error");
            return;
        }

        if (!savedParks || savedParks.length === 0) {

            await fetchSavedParks();
        }

        const parkAlreadySaved = savedParks.some((park) => park.parkCode === newPark.parkCode);
        if (parkAlreadySaved) {
            triggerNotification("This park is already saved in your favorites", "warning");
            return;
        }

        const updatedParks = [...savedParks, { parkCode: newPark.parkCode }];
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

            setSavedParks(response.data.info)
            triggerNotification("Park saved successfully!", "success");

        } catch (e) {
            console.error(e);
            setError(`Something went wrong: ` + e.message);
            triggerNotification(`Something went wrong: ${e.message}`, "warning");
        } finally {
            setLoading(false);
        }
    }

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

            const savedParkCodes = response.data || [];
            setSavedParks(savedParkCodes);

        } catch (e) {
            console.error("Error fetching saved parks:", e);
            setError("Something went wrong while fetching saved parks.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchFullParkDetails() {
        try {
            const fullParkDetails = await Promise.all(
                savedParks.map(async (savedPark) => {

                    const response = await axios.get(
                        `https://developer.nps.gov/api/v1/parks?parkCode=${savedPark.parkCode}&api_key=${import.meta.env.VITE_API_KEY}`
                    );

                    const parkData = response.data.data[0];
                    const parkActivities = parkData.activities.map((activity) => activity.name);
                    const imageUrl = parkData.images[0]?.url || '';
                    const directionsUrl = parkData.directionsUrl || '';
                    const entranceFees = parkData.entranceFees || [];
                    const entrancePasses = parkData.entrancePasses || [];
                    const fullName = parkData.fullName || '';
                    const location = parkData.states || '';
                    const description = parkData.description || '';

                    return {
                        ...savedPark,
                        activities: parkActivities,
                        imageUrl,
                        directionsUrl,
                        entranceFees,
                        entrancePasses,
                        fullName,
                        location,
                        description,
                    };
                })
            );

            setFullParkDetails(fullParkDetails);
        } catch (e) {
            console.error("Error fetching full park details:", e);
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
        } catch (e) {
            console.error(e);
            setError(`Something went wrong: ` + e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (savedParks) {
            fetchFullParkDetails();
        }
    }, [savedParks]);




    return (
        <SavedParksContext.Provider value={{ savedParks, setSavedParks, savePark, deletePark, fetchSavedParks, fetchFullParkDetails, fullParkDetails  }}>
            {children}
            {notification && <div className={`notification`}>{notification}</div> }
        </SavedParksContext.Provider>
    );
}

export default SavedParksProvider;
