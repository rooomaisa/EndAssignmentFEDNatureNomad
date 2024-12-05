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

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            // Fetch current parks from backend
            const response = await axios.get(
                `https://api.datavortex.nl/naturenomad/users/${user.username}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Parse backend data
            const backendParks = response.data.info ? response.data.info.split(',') : [];

            // Check if the park is already saved
            if (backendParks.includes(newPark.parkCode)) {
                triggerNotification("This park is already saved in your favorites", "warning");
                return;
            }

            // Add the new park to the backend data
            const updatedParks = [...backendParks, newPark.parkCode].join(',');

            // Update backend with new park list
            await axios.put(
                `https://api.datavortex.nl/naturenomad/users/${user.username}`,
                { info: updatedParks },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Parks being saved:", updatedParks);


            // Update savedParks state locally for UI
            setSavedParks(updatedParks.split(','));

            triggerNotification("Park saved successfully!", "success");

        } catch (e) {
            console.error(e);
            setError(`Something went wrong: ${e.message}`);
            triggerNotification(`Something went wrong: ${e.message}`, "error");
        } finally {
            setLoading(false);
        }
    }

    async function fetchSavedParks() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `https://api.datavortex.nl/naturenomad/users/${user.username}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Fetched savedParks:", savedParks);


            // Parse and store parks in local state
            const parks = response.data.info ? response.data.info.split(',') : [];

            console.log("Fetched savedParks:", parks);
            setSavedParks(parks.filter((code) => code)); // Filter out empty strings

            // setSavedParks(parks);
        } catch (e) {
            console.error("Error fetching saved parks:", e);
        }
    }



    async function fetchFullParkDetails() {
        try {
            const fullParkDetails = await Promise.all(
                savedParks.map(async (parkCode) => {

                    console.log("Fetching details for parkCode:", parkCode);

                    // Fetch details from NPS API
                    const response = await axios.get(
                        `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${import.meta.env.VITE_API_KEY}`
                    );

                    const parkData = response.data.data[0]; // Ensure there's valid data
                    if (!parkData) {

                        console.error(`No data returned for parkCode: ${parkCode}`);

                        throw new Error(`No data returned for parkCode: ${parkCode}`);
                    }

                    const parkActivities = parkData.activities.map((activity) => activity.name);
                    const imageUrl = parkData.images[0]?.url || '';
                    const directionsUrl = parkData.directionsUrl || '';
                    const entranceFees = parkData.entranceFees || [];
                    const entrancePasses = parkData.entrancePasses || [];
                    const fullName = parkData.fullName || '';
                    const location = parkData.states || '';
                    const description = parkData.description || '';

                    return {
                        parkCode, // Include parkCode for reference
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
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            // Fetch current parks from backend
            const response = await axios.get(
                `https://api.datavortex.nl/naturenomad/users/${user.username}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Remove the park from the list
            const backendParks = response.data.info ? response.data.info.split(',') : [];
            const updatedParks = backendParks.filter((code) => code !== parkCode).join(',');

            // Update backend
            await axios.put(
                `https://api.datavortex.nl/naturenomad/users/${user.username}`,
                { info: updatedParks },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Backend response after delete:', response.data.info);

            // Update local state
            setSavedParks(updatedParks.split(','));
            triggerNotification("Park removed successfully!", "success");

        } catch (e) {
            console.error(e);
            setError(`Something went wrong: ${e.message}`);
            triggerNotification(`Something went wrong: ${e.message}`, "error");
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
