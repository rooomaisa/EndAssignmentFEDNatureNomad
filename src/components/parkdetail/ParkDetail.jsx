import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ActivityList from '../activityList/ActivityList';
import './ParkDetail.css';


function ParkDetail() {
    const { parkCode } = useParams(); // Haal parkCode uit de URL
    const [parkData, setParkData] = useState(null); // Gegevens van het park
    const [selectedActivities, setSelectedActivities] = useState([]); // Geselecteerde activiteiten

    // Haal gegevens van het park op via de API
    useEffect(() => {
        async function fetchParkData() {
            try {
                const response = await axios.get(
                    `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${import.meta.env.VITE_API_KEY}`
                );
                setParkData(response.data.data[0]); // Zet de data in de state
            } catch (error) {
                console.error("Error fetching park data:", error);
            }
        }

        fetchParkData();
    }, [parkCode]);

    // Callback voor het aanvinken van activiteiten
    const handleToggleActivity = (id) => {
        setSelectedActivities((prev) =>
            prev.includes(id)
                ? prev.filter((activityId) => activityId !== id) // Verwijder als al geselecteerd
                : [...prev, id] // Voeg toe als nog niet geselecteerd
        );
    };

    // Toon "Loading..." als de data nog wordt opgehaald
    if (!parkData) return <p>Loading...</p>;

    return (
        <div className="park-detail">
            <h1>{parkData.fullName}</h1>
            <img
                src={parkData.images[0]?.url || 'https://via.placeholder.com/400'}
                alt={parkData.fullName}
            />
            <p>{parkData.description}</p>
            <p>Toegangskosten: ${parkData.entranceFees[0]?.cost || 'Geen informatie'}</p>

            {/* Activiteitenlijst */}
            <h2>Activiteiten</h2>
            <div className="activity-list">
                <ActivityList
                    activities={parkData.activities}
                    onToggle={handleToggleActivity}
                />
            </div>

            {/* Geselecteerde activiteiten */}
            <h2>Geselecteerde activiteiten:</h2>
            <div className="selected-activities">
                <ul>
                    {selectedActivities.map((id) => {
                        const activity = parkData.activities.find((a) => a.id === id);
                        return <li key={id}>{activity.name}</li>;
                    })}
                </ul>
            </div>
        </div>


    );
}

export default ParkDetail;
