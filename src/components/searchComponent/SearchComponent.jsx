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
                console.log(response.data.data)
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
        setLoading(true);
        setError('');
        try {
            console.log('Selected Parks:', selectedParks);
            console.log('Selected Activities:', selectedActivities);

            if (selectedActivities.length === 0) {
                setError('Please select at least one activity.');
                return;
            }

            // Create the query parameter with activity names
            const activityQuery = selectedActivities.map(activity => `"${activity}"`).join(', ');
            console.log('Activity Query:', activityQuery);

            const apiUrl = `https://developer.nps.gov/api/v1/activities/parks`;
            console.log('Request URL:', apiUrl);

            // Make the API call
            const response = await axios.get(apiUrl, {
                params: {
                    q: activityQuery, // Pass the names in the `q` parameter
                    limit: 50,
                    api_key: 'VH0NU4pT0TJAlBErq2450GOdx2Rhf2gX3cQcJMM8'
                }
            });

            console.log('API Response:', response.data);

            if (response.data.total === '0') {
                setError('No parks found for the selected activities.');
            } else {
                // Extract parks from each activity's response
                const parksWithActivities = response.data.data.flatMap(activity => activity.parks);
                setTopParks(parksWithActivities);
                setIsModalOpen(true); // Show the modal with the search results
            }
        } catch (e) {
            setError(`Something went wrong: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }




    function handleCloseModal() {
        setIsModalOpen(false);
        resetSearch();
    }

    const resetSearch = () => {
        setSelectedParks([]);
        setSelectedActivities([]);
        setSearchTerm('');
    };

    const handleSearchAgain = () => {
        handleCloseModal();
    };




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
                                checked={selectedActivities.includes(activity.name)}
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
                    {topParks.length > 0 ? (
                        topParks.map((park) => (
                            <div key={park.id}>
                                <h3>{park.fullName}</h3>
                                <p>{park.description}</p>
                                <p>{park.hasSelectedActivities ? '✅ Includes selected activities' : '⚠️ Does not include all selected activities'}</p>
                                <button onClick={() => savePark(park)}>Save Park</button>
                            </div>
                        ))
                    ) : (
                        <p>No parks match the selected activities.</p>
                    )}
                    <button onClick={handleSearchAgain}>Search Again</button>
                </Modal>


            </div>

        );
}

export default SearchComponent;