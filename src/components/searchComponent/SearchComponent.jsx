import React, {useCallback, useContext, useEffect, useState} from 'react';
import axios from "axios";
import {SavedParksContext} from "../../context/SavedParksContext.jsx";
import './SearchComponent.css'

function SearchComponent() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [availableActivities, setAvailableActivities] = useState([]);
    const [suggestedParks, setSuggestedParks]= useState([]);

    const [selectedParks, setSelectedParks] = useState([]);
    const [selectedActivities, setSelectedActivities]= useState([]);

    const {savePark} = useContext(SavedParksContext);
    const [searchTerm, setSearchTerm] = useState('');

// keys zijn overal weg!!!

    useEffect(() => {
        const controller = new AbortController();

        async function fetchActivities (){
            setLoading(true);
            setError('');

            try{
                const response = await axios.get(`https://developer.nps.gov/api/v1/activities?api_key=VH0NU4pT0TJAlBErq2450GOdx2Rhf2gX3cQcJMM8`,{signal: controller.signal,});
                setAvailableActivities(response.data.data);
            } catch (e) {
                if (axios.isCancel(e)) {
                    console.error(`request is canceled`)
                } else {
                    console.error(e);
                    setError(`Something went wrong: ` + e.message + true);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchActivities();

        return function cleanup() {
            controller.abort();
        }
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSuggestedParks([]);
            return;
        }

        const controller = new AbortController();
        async function fetchParksSuggestions() {
            try {
                const response = await axios.get(
                    `https://developer.nps.gov/api/v1/parks?api_key=VH0NU4pT0TJAlBErq2450GOdx2Rhf2gX3cQcJMM8&limit=50&start=0&q=${searchTerm}`,
                    { signal: controller.signal }
                );
                setSuggestedParks(response.data.data);
            } catch (e) {
                if (!axios.isCancel(e)) {
                    setError(`Something went wrong: ` + e.message);
                }
            }
        }
        fetchParksSuggestions();
        return () => controller.abort();
    }, [searchTerm]);


// async function searchParks() {
//         try {
//             const url = `https://developer.nps.gov/api/v1/parks?api_key=VH0NU4pT0TJAlBErq2450GOdx2Rhf2gX3cQcJMM8&limit=50`;
//

    function handleParkSelection(park) {
        if (!selectedParks.find((p) => p.id === park.id)) {
            setSelectedParks((prevSelected) => [...prevSelected, park]);
        }
        setSearchTerm(''); // clear search after selection
        setSuggestedParks([]); // clear suggestions after selection
    }

    function removeSelectedPark(parkId) {
        setSelectedParks((prevSelected) =>
            prevSelected.filter((park) => park.id !== parkId)
        );
    }

function handleActivitySelection(e) {
    const { value, checked } = e.target;
    setSelectedActivities(prev =>
        checked ? [...prev, value] : prev.filter(activity => activity !== value)
    );
}

        return (
            <div>
                <h1>Select Parks and Activities</h1>
                <input
                    type="text"
                    placeholder="Search for a park"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {error && <p className="error">{error}</p>}
                <div className="suggestions">
                    {suggestedParks.slice(0, 10).map((park) => (
                        <div
                            key={park.id}
                            className="suggestion"
                            onClick={() => handleParkSelection(park)}
                        >
                            {park.fullName}
                        </div>
                    ))}
                </div>
                <div className="selected-parks">
                    <h2>Selected Parks</h2>
                    {selectedParks.map((park) => (
                        <div key={park.id} className="selected-park">
                            {park.fullName}
                            <button onClick={() => removeSelectedPark(park.id)}>Remove</button>
                        </div>
                    ))}
                </div>

                <div>
                    <h2>Activities</h2>
                    {availableActivities.map((activity) => (
                        <label key={activity.id}>
                            <input
                                type="checkbox"
                                value={activity.name}
                                onChange={handleActivitySelection}
                            />
                            {activity.name}
                        </label>
                    ))}
                </div>

                {selectedParks.length > 0 && (
                    <>
                        <h2>Your Top Parks</h2>
                        <ul>
                            {selectedParks.map((park) => (
                                <li key={park.id}>
                                    <h3>{park.fullName}</h3>
                                    <p>{park.description}</p>
                                    <button onClick={() => savePark(park)}>Save Park</button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

        );
}

export default SearchComponent;