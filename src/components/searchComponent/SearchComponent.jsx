import React, { useContext, useEffect, useState} from 'react';
import axios from "axios";
import {SavedParksContext} from "../../context/SavedParksContext.jsx";
import './SearchComponent.css'
import Modal from '../modal/Modal.jsx';
import debounce from 'lodash/debounce';
import { useNotification } from "../../context/NotificationContext.jsx";
import {useNavigate} from "react-router-dom";
import Button from "../button/Button.jsx";
import Loading from "../loadingSpinner/LoadingSpinner.jsx";

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
    const [notification, setNotification] = useState(false);
    const { triggerNotification } = useNotification();
    const navigate = useNavigate();




    useEffect(() => {
        const controller = new AbortController();

        async function fetchActivities (){
            setLoading(true);
            setError('');

            try{
                const response = await axios.get(`https://developer.nps.gov/api/v1/activities?api_key=${import.meta.env.VITE_API_KEY}`,{signal: controller.signal,});
                setAvailableActivities(response.data.data);
                console.log(response.data.data)
            } catch (e) {
                if (axios.isCancel(e)) {
                    console.error(`request is canceled`)
                    triggerNotification('Request was canceled.', 'warning');
                } else {
                    console.error(e);
                    setError(`Something went wrong: ` + e.message + true);
                    triggerNotification(`Something went wrong: ${e.message}`, 'warning');
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


        const fetchParksSuggestions = debounce(async () => {
            try {
                const response = await axios.get(
                    `https://developer.nps.gov/api/v1/parks?api_key=${import.meta.env.VITE_API_KEY}&limit=50&start=0&q=${searchTerm}`,
                    { signal: controller.signal }
                );
                setSuggestedParks(response.data.data);
            } catch (e) {
                if (!axios.isCancel(e)) {
                    setError(`Something went wrong: ` + e.message);
                    triggerNotification('Request was canceled.', 'warning');
                }
            }
        }, 300);

        fetchParksSuggestions();


        return () => {
            controller.abort();
            fetchParksSuggestions.cancel();
        };
    }, [searchTerm]);




    function handleParkSelection(park) {
        if (!selectedParks.find((p) => p.id === park.id)) {
            setSelectedParks((prevSelected) => [...prevSelected, park]);
        }
        setSearchTerm('');
        setSuggestedParks([]);
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

    function filterParksByActivities(parks, selectedActivities) {
        return parks.map(park => {
            // Check if the park includes all selected activities
            const parkActivities = park.activities || [];
            const hasSelectedActivities = selectedActivities.every(activity => parkActivities.includes(activity));

            // Return the park with the new flag
            return { ...park, hasSelectedActivities };
        });
    }

    async function fetchPreselectedParksData() {
        return await Promise.all(
            selectedParks.map(async (park) => {

                const response = await axios.get(
                    `https://developer.nps.gov/api/v1/parks?parkCode=${park.parkCode}&api_key=${import.meta.env.VITE_API_KEY}`
                );
                const parkData = response.data.data[0];
                const parkActivities = parkData.activities.map((activity) => activity.name);
                const imageUrl = parkData.images[0]?.url || '';
                const directionsUrl = parkData.directionsUrl || '';
                const entranceFees = parkData.entranceFees || [];
                const entrancePasses = parkData.entrancePasses || [];

                const missingActivities = selectedActivities.filter(
                    (activity) => !parkActivities.includes(activity)
                );

                return {
                    ...park,
                    hasSelectedActivities: selectedActivities.every((activity) =>
                        parkActivities.includes(activity)
                    ),
                    missingActivities,
                    description: parkData.description,
                    imageUrl,
                    directionsUrl,
                    entranceFees,
                    entrancePasses,
                };
            })
        );
    }



    async function handleSearch() {
        setLoading(true);
        setError('');
        try {
            console.log('Selected Parks:', selectedParks);
            console.log('Selected Activities:', selectedActivities);


            if (selectedActivities.length === 0) {
                triggerNotification("Please select at least one activity", "warning");
                return;
            }

            const selectedParksData = await fetchPreselectedParksData();
            console.log("Preselected Parks Data:", selectedParksData);


            const activityQuery = selectedActivities.map(activity => `"${activity}"`).join(', ');
            console.log('Activity Query:', activityQuery);

            const apiUrl = `https://developer.nps.gov/api/v1/activities/parks`;
            console.log('Request URL:', apiUrl);


            const response = await axios.get(apiUrl, {
                params: {
                    q: activityQuery,
                    limit: 50,
                    api_key: import.meta.env.VITE_API_KEY
                }
            });

            console.log('API Response:', response.data);


            const parkFrequencyMap = new Map();

            response.data.data.forEach(activity => {
                activity.parks.forEach(park => {
                    console.log('Processing park:', park.parkCode);

                    if (parkFrequencyMap.has(park.parkCode)) {
                        parkFrequencyMap.set(park.parkCode, {
                            ...parkFrequencyMap.get(park.parkCode),
                            count: parkFrequencyMap.get(park.parkCode).count + 1
                        });
                    } else {
                        parkFrequencyMap.set(park.parkCode, { ...park, count: 1 });
                    }
                });
            });


            console.log('Park Frequency Map:', parkFrequencyMap);


            const sortedParks = Array.from(parkFrequencyMap.values()).sort((a, b) => b.count - a.count);
            console.log('Sorted Parks:', sortedParks);
            const top10Parks = sortedParks.slice(0, 10);
            console.log(`top 10 parks data:`, top10Parks);


            const parksWithActivities = await Promise.all(
                top10Parks.map(async (park) => {
                    const response = await axios.get(
                        `https://developer.nps.gov/api/v1/parks?parkCode=${park.parkCode}&api_key=${import.meta.env.VITE_API_KEY}`
                    );
                    const parkData = response.data.data[0];
                    const parkDescription = parkData.description;
                    const parkActivities = response.data.data[0].activities.map((activity) => activity.name);
                    const imageUrl = parkData.images[0]?.url || '';  // Select the first image if available

                    const missingActivities = selectedActivities.filter(
                        (activity) => !parkActivities.includes(activity)
                    );

                    const hasSelectedActivities = selectedActivities.every((activity) =>
                        parkActivities.includes(activity)
                    );

                    return {
                        ...park,
                        hasSelectedActivities: selectedActivities.every((activity) =>
                            parkData.activities.some((a) => a.name === activity)),
                        missingActivities,
                        description: parkDescription,
                        imageUrl,
                    };
                })
            );

            const filteredTopParks = parksWithActivities.filter(
                (park) => !selectedParksData.some((prePark) => prePark.parkCode === park.parkCode)
            );

            const finalTop10Parks = [...selectedParksData, ...filteredTopParks].slice(0, 10);

            setTopParks(finalTop10Parks);
            setIsModalOpen(true);

        } catch (e) {
            setError(`Something went wrong: ${e.message}`);
            triggerNotification(`Something went wrong: ${e.message}`, 'warning');
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
        <div className="search-component">
            {loading && <Loading size={50} message="Fetching parks, please wait..." />}
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search for a park"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />

            {/* Display Error if Exists */}
            {error && <p className="error-message">{error}</p>}

            {/* Suggestions */}
            <div className="suggestions">
                {suggestedParks
                    .filter((park) =>
                        park.fullName.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .slice(0, 10)
                    .map((park) => (
                        <div
                            key={park.id}
                            className="suggestion"
                            onClick={() => handleParkSelection(park)}
                        >
                            {park.fullName}
                        </div>
                    ))}
            </div>

            {/* Selected Parks */}
            <div className="selected-parks">
                <h2 className="section-title">Selected Parks</h2>
                <div className="selected-parks-grid">
                    {selectedParks.map((park) => (
                        <div key={park.id} className="selected-park">
                            <h3>{park.fullName}</h3>
                            <Button text="Remove" className="btn btn--remove" onClick={() => removeSelectedPark(park.id)} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Activities Section */}
            <h2 className="section-title">Activities</h2>
            <div className="activities-container">
                {availableActivities.map((activity) => (
                    <label key={activity.id} className="activity-checkbox">
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


            <Button text="Search" className="btn btn--primary" onClick={handleSearch}  disabled={loading} />

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button
                            onClick={handleCloseModal}
                            className="modal-close"
                        >
                            &times;
                        </button>
                        <h2 className="modal-title">"Wilderness Picks for You"</h2>
                        <div className="modal-content">
                            {topParks.length > 0 ? (
                                topParks.map((park) => {
                                    const isSelectedPark = selectedParks.some(
                                        (selected) => selected.parkCode === park.parkCode
                                    );

                                    return (
                                        <div key={park.id} className="modal-tile">
                            <span
                                className={
                                    isSelectedPark
                                        ? "badge badge--selected"
                                        : "badge badge--recommended"
                                }
                            >
                                {isSelectedPark
                                    ? "Your Selected Park"
                                    : "Our Recommendation"}
                            </span>
                                            <img
                                                src={park.imageUrl}
                                                alt={`${park.fullName} image`}
                                                className="modal-tile-image"
                                            />
                                            <h3 className="modal-tile-title">{park.fullName}</h3>
                                            <p className="modal-tile-description">{park.description}</p>
                                            <p className="modal-tile-activities">
                                                {park.hasSelectedActivities
                                                    ? "✅ Includes selected activities"
                                                    : "⚠️ Does not include all selected activities"}
                                            </p>

                                            {park.missingActivities.length > 0 && (
                                                <p className="modal-tile-missing-activities">
                                                    ⚠️ Missing activities:{" "}
                                                    {park.missingActivities.join(", ")}
                                                </p>
                                            )}

                                            <Button
                                                onClick={() => savePark(park)}
                                                className="btn btn--save"
                                                text="Save Park"
                                            />
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="no-results-message">
                                    No parks match the selected activities.
                                </p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <Button
                                onClick={handleSearchAgain}
                                className="btn btn--secondary"
                                text="Search Again"
                            />
                            <Button
                                onClick={() => navigate('/myfavourites')}
                                className="btn btn--secondary"
                                text="Go to wishlist"
                            />
                        </div>
                    </div>
                </div>

            )}
        </div>


    );
}

export default SearchComponent;