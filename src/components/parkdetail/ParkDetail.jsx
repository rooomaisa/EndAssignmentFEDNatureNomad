import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ParkDetail() {
    const { parkCode } = useParams();
    const [parkData, setParkData] = useState(null);

    useEffect(() => {
        async function fetchParkData() {
            const response = await axios.get(
                `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${import.meta.env.VITE_API_KEY}`
            );
            setParkData(response.data.data[0]);
        }
        fetchParkData();
    }, [parkCode]);

    if (!parkData) return <p>Loading...</p>;

    return (
        <div>
            <h1>{parkData.fullName}</h1>
            <img src={parkData.images[0]?.url} alt={parkData.fullName} />
            <p>{parkData.description}</p>
            <p>Toegangskosten: ${parkData.entranceFees[0]?.cost || 'Geen informatie'}</p>
        </div>
    );
}

export default ParkDetail;
