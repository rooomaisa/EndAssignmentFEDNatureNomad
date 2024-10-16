import React, {useEffect, useState} from 'react';
import axios from "axios";

function SearchComponent() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [selectedParks, setSelectedParks] = useState([]);
    const [selectedActivities, setSelectedActivities]= useState([]);
    const [parksData, setParksData] = useState([]);
    const [topFiveParks, setTopFiveParks] = useState([]);


    useEffect(() => {
        const controller = new AbortController();

        async function searchParks() {
            setLoading(true);
            setError('');


            try {
                const activityList = selectedActivities.join(',');
                const url = `https://developer.nps.gov/api/v1/parks?api_key=VH0NU4pT0TJAlBErq2450GOdx2Rhf2gX3cQcJMM8&q=${activityList}&limit=50`;
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

        if (selectedActivities.length > 0) {
        searchParks();}

        return function cleanup() {
            controller.abort();
        }
    }, [selectedActivities]);


function handleParkSelection(e) {
    const selected = Array.from(e.target.selectedOptions, option => option.value);

    if (selected.length <= 10){
        setSelectedParks(selected);
    } else {
        alert('You can select a maximum of 10 parks.');
    }

}

function handleActivitySelection(e) {

}









        return (
            <div></div>
        );
    }

export default SearchComponent;