import React, { useContext, useEffect, useState} from 'react';
import axios from "axios";
import {SavedParksContext} from "../../context/SavedParksContext.jsx";
import './SearchComponent.css'
import Modal from '../modal/Modal.jsx';

function SearchComponent() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [availableActivities, setAvailableActivities] = useState([]);
    const [suggestedParks, setSuggestedParks]= useState([]);
    const [selectedParks, setSelectedParks] = useState([]);
    const [selectedActivities, setSelectedActivities]= useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [topParks, setTopParks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {savePark} = useContext(SavedParksContext);

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
    async function handleSearch() {
        // Fetch top 5 parks based on selected parks and activities
        setLoading(true);
        try {
            const response = await axios.get(
                `https://developer.nps.gov/api/v1/parks?api_key=VH0NU4pT0TJAlBErq2450GOdx2Rhf2gX3cQcJMM8&limit=5`,
                {
                    params: {
                        parks: selectedParks.map((park) => park.fullName).join(','),
                        activities: selectedActivities.join(',')
                    }
                }
            );
            setTopParks(response.data.data);
            setIsModalOpen(true); // Open modal with results
        } catch (e) {
            setError(`Something went wrong: ` + e.message);
        } finally {
            setLoading(false);
        }
    }

    function handleCloseModal() {
        setIsModalOpen(false);
        setSelectedParks([]);
        setSelectedActivities([]);
        setTopParks([]);
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
                <button onClick={handleSearch} disabled={loading}>
                    Search
                </button>

                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <h2>Top 5 Parks</h2>
                    {topParks.map((park) => (
                        <div key={park.id}>
                            <h3>{park.fullName}</h3>
                            <p>{park.description}</p>
                            <button onClick={() => savePark(park)}>Save Park</button>
                        </div>
                    ))}
                    <button onClick={handleCloseModal}>Search Again</button>
                </Modal>


            </div>

        );
}

export default SearchComponent;