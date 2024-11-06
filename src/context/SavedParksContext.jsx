import React, { createContext, useState } from 'react';
import authContext from "./AuthContext.jsx";
import axios from "axios";

export const SavedParksContext = createContext({});

function SavedParksProvider({ children }) {

    const [savedParks, setSavedParks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    async function savePark(newPark) {
        const updatedParks = [...savedParks, newPark];
        setSavedParks(updatedParks);

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const username = authContext.user.username;

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

        } catch (e) {
            console.error(e);
            setError(`Something went wrong: ` + e.message);
        } finally {
        setLoading(false);
    }












    return (
        <SavedParksContext.Provider value={{ savedParks, setSavedParks, savePark }}>
            {children}
        </SavedParksContext.Provider>
    );
}

export default SavedParksProvider;
