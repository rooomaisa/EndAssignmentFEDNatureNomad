import React, { useContext, useEffect, useState} from 'react';
import axios from "axios";
import {SavedParksContext} from "../../context/SavedParksContext.jsx";
import './SearchComponent.css'
import Modal from '../modal/Modal.jsx';
import debounce from 'lodash/debounce';

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


        const fetchParksSuggestions = debounce(async () => {
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
                    `https://developer.nps.gov/api/v1/parks?parkCode=${park.parkCode}&api_key=VH0NU4pT0TJAlBErq2450GOdx2Rhf2gX3cQcJMM8`
                );
                const parkData = response.data.data[0];
                const parkActivities = parkData.activities.map((activity) => activity.name);
                const imageUrl = parkData.images[0]?.url || '';

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
                setError('Please select at least one activity.');
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
                    api_key: 'VH0NU4pT0TJAlBErq2450GOdx2Rhf2gX3cQcJMM8'
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
                        `https://developer.nps.gov/api/v1/parks?parkCode=${park.parkCode}&api_key=VH0NU4pT0TJAlBErq2450GOdx2Rhf2gX3cQcJMM8`
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
                {suggestedParks
                    .filter((park) => park.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
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
                <h2>Top 10 Parks</h2>
                {topParks.length > 0 ? (
                    topParks.map((park) => {
                        const isSelectedPark = selectedParks.some((selected) => selected.parkCode === park.parkCode);

                        return (
                            <div key={park.id}>
                                {isSelectedPark ? (
                                    <span style={{color: 'green', fontWeight: 'bold'}}>Your Selected Park</span>
                                ) : (
                                    <span style={{color: 'blue', fontWeight: 'bold'}}>Our Recommendation</span>
                                )}
                                <h3>{park.fullName}</h3>
                                {park.imageUrl && (
                                    <img src={park.imageUrl} alt={`${park.fullName} image`} width="100" height="75" />
                                )}
                                <p>{park.description}</p>
                                <p>{park.hasSelectedActivities ? '✅ Includes selected activities' : '⚠️ Does not include all selected activities'}</p>

                                {park.missingActivities.length > 0 && (
                                    <p>
                                        ⚠️ Missing activities: {park.missingActivities.join(', ')}
                                    </p>
                                )}

                                <button onClick={() => savePark(park)}>Save Park</button>
                            </div>
                        );
                    })
                ) : (
                    <p>No parks match the selected activities.</p>
                )}
                <button onClick={handleSearchAgain}>Search Again</button>
            </Modal>


        </div>
    );
    }

 export default SearchComponent;