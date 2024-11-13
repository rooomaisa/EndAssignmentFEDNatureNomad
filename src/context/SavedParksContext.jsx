import React, {createContext, useContext, useState} from 'react';
import axios from "axios";

export const SavedParksContext = createContext({});

function SavedParksProvider({ children }) {

    const initialSavedParks = JSON.parse(localStorage.getItem('savedParks') || '[]');
    const [savedParks, setSavedParks] = useState(initialSavedParks);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState('');

    async function savePark(newPark) {

        const parkAlreadySaved = savedParks.some((park) => park.parkCode === newPark.parkCode);
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
            const parksDataString= JSON.stringify(updatedParks)


            const response =
                await axios.put(`https://api.datavortex.nl/naturenomad/info`,
                    {info: parksDataString},
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                            // "X-Api-Key": "naturenomad:Ic0HJDZjRv9QEebv4tta"
                        },
                    }
                );
            setSavedParks(JSON.parse(response.data.info));
            console.log('park saves succesfully:', response.data);


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
                `https://api.datavortex.nl/naturenomad/info`,
                { info: parksDataString },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        // "X-Api-Key": "naturenomad:Ic0HJDZjRv9QEebv4tta"
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







            return (
        <SavedParksContext.Provider value={{ savedParks, setSavedParks, savePark, deletePark }}>
            {children}
            {notification && <div className={`notification`}>{notification}</div> }
        </SavedParksContext.Provider>
    );
}

export default SavedParksProvider;
