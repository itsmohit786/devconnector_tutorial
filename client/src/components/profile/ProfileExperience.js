import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({ experience: {
    company, current, description, from, to, location, title
} }) => {

    return (
        <div>
            <h3 className="text-dark">{company}</h3>
            <p>{<Moment format="YYYY/MM/DD">{from}</Moment>} - {current ? 'current' : <Moment format="YYYY/MM/DD">{to}</Moment>} </p>
            <p><strong>Position: </strong>{title}</p>
            <p>
                <strong>Description: </strong>{description}
            </p>
        </div>
    )
}

ProfileExperience.propTypes = {
    experience: PropTypes.object.isRequired,
}

export default ProfileExperience
