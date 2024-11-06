import React, {useCallback, useEffect, useState} from 'react';
import axios from "axios";

function SearchComponent() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [availableActivities, setAvailableActivities] = useState([]);
    const [availableParks, setAvailableParks] = useState([]);
    const [selectedParks, setSelectedParks] = useState([]);
    const [selectedActivities, setSelectedActivities]= useState([]);
    const [parksData, setParksData] = useState([]);
    const [topFiveParks, setTopFiveParks] = useState([]);

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
        const controller = new AbortController();

        async function fetchParks() {
            setLoading(true);
            setError('');

            try {
                const response = await axios.get(`https://developer.nps.gov/api/v1/parks?api_key=VH0NU4pT0TJAlBErq2450GOdx2Rhf2gX3cQcJMM8&limit=50`, { signal: controller.signal });
                setAvailableParks(response.data.data);
            } catch (e) {
                if (axios.isCancel(e)) {
                    console.error(`request is canceled`);
                } else {
                    console.error(e);
                    setError(`Something went wrong: ` + e.message + true);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchParks();

        return function cleanup() {
            controller.abort();
        };
    }, []);


async function searchParks() {
        if (selectedActivities.length === 0) {
            alert("Please select at least one activity.");
            return;
        }

        setLoading(true);
        setError('');

        // Die key klopt hier niet!!!weggehaald voor git

        try {
            const url = `https://developer.nps.gov/api/v1/parks?api_key=VH0NU4pT0TJAlBErq2450GOdx2Rhf2gX3cQcJMM8&limit=50`;
            console.log("API URL:", url);
            const response = await axios.get(url);
            console.log("API Response:", response.data);
            setParksData(response.data.data);
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

function handleParkSelection(e) {
    const { value, checked }= e.target;

    if (checked){
        if (selectedParks.length < 10) {
            setSelectedParks(prev => [...prev, value]);
    } else {
        alert('You can select a maximum of 10 parks.');
       }
    } else {
        setSelectedParks(prev => prev.filter(park => park !== value));
    }
}

function handleActivitySelection(e) {
    const { value, checked } = e.target;

    if (checked){
        setSelectedActivities(prev => [...prev, value]);
    } else {
        setSelectedActivities(prev => prev.filter(activity => activity !==value));
    }
}

const filterParks = useCallback ((parks) => {
    let filteredParks= parks;

    if (selectedParks.length > 0) {
        filteredParks = parks.filter(park => selectedParks.includes (park.fullName));
    }

    filteredParks.sort((a,b) => {
        const aMatches = a.activities.filter(activity => selectedActivities.includes(activity.name)).length;
        const bMatches = b.activities.filter(activity => selectedActivities.includes(activity.name)).length;

        return bMatches - aMatches;
    });

    return filteredParks;
}, [selectedParks, selectedActivities]);

useEffect (() => {
    if (parksData.length >0){
        const topParks = filterParks(parksData);
        setTopFiveParks(topParks.slice(0, 5));
    }
}, [parksData, filterParks]);




        return (
            <div>
                <h1> Select parks and activities</h1>
                <div>
                    {availableParks.map(park => (
                        <label key={park.id}>
                            <input
                                type="checkbox"
                                value={park.fullName}
                                onChange={handleParkSelection}
                                checked={selectedParks.includes(park.fullName)}
                            />
                            {park.fullName}
                        </label>
                    ))}
                </div>


                <div>
                    {availableActivities.map(activity => (
                        <label key={activity.id}>
                            <input type={`checkbox`} value={activity.name} onChange={handleActivitySelection}/>
                            {activity.name}
                        </label>
                    ))}
                </div>

                <button onClick={searchParks}>Search</button>

                {topFiveParks.length > 0 && (
                    <>
                <h2>Your top 5 Parks</h2>
                <ul>
                    {topFiveParks.map(park => (
                        <li key={park.id}>
                            <h3>{park.fullName}</h3>
                            <p>{park.description}</p>
                        </li>
                    ))}
                </ul>
                    </>
                    )}
            </div>
        );
}

export default SearchComponent;