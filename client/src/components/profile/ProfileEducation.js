import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({ education: {
    school, current, description, from, to, degree, fieldofstudy
} }) => {

    return (
        <div>
            <h3 className="text-dark">{school}</h3>
            <p>{<Moment format="YYYY/MM/DD">{from}</Moment>} - {current ? 'current' : <Moment format="YYYY/MM/DD">{to}</Moment>} </p>
            <p><strong>Degere: </strong>{degree}</p>
            <p><strong>Field of Study: </strong>{fieldofstudy}</p>
            <p>
                <strong>Description: </strong>{description}
            </p>
        </div>
    )
}

ProfileEducation.propTypes = {
    education: PropTypes.object.isRequired,
}

export default ProfileEducation
