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

            const response = await axios.get(
                `https://api.datavortex.nl/naturenomad/users/${user.username}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const backendParks = response.data.info ? response.data.info.split(',') : [];

            if (backendParks.includes(newPark.parkCode)) {
                triggerNotification("This park is already saved in your favorites", "warning");
                return;
            }

            const updatedParks = [...backendParks, newPark.parkCode].join(',');

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


            const parks = response.data.info ? response.data.info.split(',') : [];

            setSavedParks(parks.filter((code) => code));

        } catch (e) {
            console.error("Error fetching saved parks:", e);
        }
    }



    async function fetchFullParkDetails() {
        try {
            const fullParkDetails = await Promise.all(
                savedParks.map(async (parkCode) => {

                    const response = await axios.get(
                        `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${import.meta.env.VITE_API_KEY}`
                    );

                    const parkData = response.data.data[0];
                    if (!parkData) {
                        console.error(`No data returned for parkCode: ${parkCode}`);
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
                        parkCode,
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

            const response = await axios.get(
                `https://api.datavortex.nl/naturenomad/users/${user.username}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            const backendParks = response.data.info ? response.data.info.split(',') : [];
            const updatedParksArray = backendParks.filter((code) => code !== parkCode);
            const updatedParksString = updatedParksArray.length ? updatedParksArray.join(',') : "";

            const updateResponse =
                await axios.put(
                `https://api.datavortex.nl/naturenomad/users/${user.username}`,
                { info: updatedParksString },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

       
            if (updateResponse.status !== 200) {
                triggerNotification("Could not delete park!", "error");
            }

            setSavedParks(updatedParksArray);
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
