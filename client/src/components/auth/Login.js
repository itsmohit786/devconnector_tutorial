// src/components/auth/Login.js

import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { login } from '../../actions/auth'


// Functional component and passing the props converted from state
const Login = ({ login, isAuthenticated, userInfo }) => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = async e => {
        e.preventDefault();
        // Triggering the action
        login({ email, password });
    }

    // Redirect if logged in
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
    }

    return (
        <>

            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    />
                    <small className="form-text">This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={password}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to={'/register'}>Sign Up</Link>
            </p>

        </>
    )
}

// Setting validation for propTypes
Login.propTypes = {
    // action: which is a function so - (ptfr) PropTypes.func.isRequired
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    // userInfo: PropTypes.object,
}

const mapStateToProps = state => ({
    // Mapping the global state to prop
    isAuthenticated: state.auth.isAuthenticated,
    // userInfo: state.auth.user
})

export default connect(mapStateToProps, { login })(Login)