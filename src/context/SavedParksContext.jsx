import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from "axios";
import {AuthContext} from "./AuthContext.jsx";

export const SavedParksContext = createContext({});

function SavedParksProvider({ children }) {
    const { user } = useContext(AuthContext);
    const initialSavedParks = JSON.parse(localStorage.getItem('savedParks') || '[]');
    const [savedParks, setSavedParks] = useState(initialSavedParks);
    const [fullParkDetails, setFullParkDetails] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState('');


    async function savePark(newPark) {

        const parkAlreadySaved = savedParks.some((park) => park.parkCode === newPark.parkCode);
        if (parkAlreadySaved) {
            console.log("This park is already saved");
            setNotification('This park is already saved in your favorites');
            setTimeout(() => setNotification(''), 3000);
            return;
        }


        const updatedParks = [...savedParks, { parkCode: newPark.parkCode }];
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
            console.log('Park saved successfully:', response.data);

        } catch (e) {
            console.error(e);
            setError(`Something went wrong: ` + e.message);
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

            console.log(response.data);

            const savedParkCodes = (response.data);
            console.log(savedParkCodes)
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

                    const data = response.data.data
                    console.log("Data received from fetchSavedParks:", data);

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


            console.log("this is the fullparks detail",fullParkDetails);
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
            console.log('Park deleted successfully:', response.data);
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
