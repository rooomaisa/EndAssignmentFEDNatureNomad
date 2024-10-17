import React, {useCallback, useEffect, useState} from 'react';
import axios from "axios";

function SearchComponent() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [availableActivities, setAvailableActivities] = useState([]);
    const [selectedParks, setSelectedParks] = useState([]);
    const [selectedActivities, setSelectedActivities]= useState([]);
    const [parksData, setParksData] = useState([]);
    const [topFiveParks, setTopFiveParks] = useState([]);


// kan ik die use effect zo gebruiken of zet tie het nu geijk op de pagina er moet wel knop igedrut worden

    // bij die tweede useffect key eruit gehaald * vervangen


        async function searchParks() {
            setLoading(true);
            setError('');

            // Die key klopt hier niet!!!weggehaald voor git

            try {
                const activityList = selectedActivities.join(',');
                const url = `https://developer.nps.gov/api/v1/parks?api_key==${activityList}&limit=50`;
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

    useEffect(() => {
        searchParks();
    }, [selectedActivities]);



    useEffect(() => {
        const controller = new AbortController();

        async function fetchActivities (){
            setLoading(true);
            setError('');

            try{
                const response = await axios.get(`https://developer.nps.gov/api/v1/activities?api_key=*`,{signal: controller.signal,});
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


function handleParkSelection(e) {
    const selected = Array.from(e.target.selectedOptions, option => option.value);

    if (selected.length <= 10){
        setSelectedParks(selected);
    } else {
        alert('You can select a maximum of 10 parks.');
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
                <select multiple onChange={handleParkSelection}>
                    {parksData.map(park => (
                    <option key={park.id} value={park.fullName}>
                        {park.fullName}
                    </option>
                    ))}
                </select>

                <div>
                    {availableActivities.map(activity => (
                        <label key={activity.id}>
                            <input type={`checkbox`} value={activity.name} onChange={handleActivitySelection} />
                            {activity.name}
                        </label>
                    ))}
                </div>

                <button onClick={searchParks}>Search</button>

                <h2>Your top 5 Parks</h2>
                <ul>
                    {topFiveParks.map(park => (
                        <li key={park.id}>
                            <h3>{park.fullName}</h3>
                            <p>{park.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

export default SearchComponent;