import React from 'react';
import PropTypes from 'prop-types';

function ActivityList({ activities, onToggle }) {
    return (
        <ul>
            {activities.map((activity) => (
                <li key={activity.id}>
                    <label>
                        <input
                            type="checkbox"
                            onChange={() => onToggle(activity.id)}
                        />
                        {activity.name}
                    </label>
                </li>
            ))}
        </ul>
    );
}

ActivityList.propTypes = {
    activities: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default ActivityList;
