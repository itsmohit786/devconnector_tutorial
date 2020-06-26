import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, auth: { isAuthenticated, loading }, ...rest }) => {

    // return console.log(`isAuthenticated: ${isAuthenticated} ---  loading: ${loading}`);
    // return console.log(`!isAuthenticated && !loading : ${!isAuthenticated && !loading}`)


    // console.log(`!isAuthenticated && !loading: ${!isAuthenticated && !loading}`)

    // if (!isAuthenticated && !loading) {
    //     console.log('Redirect to dashboard')
    //     return <Route {...rest} render={props => <Redirect to={'/login'} />} />
    // } else {
    //     console.log('Load the component')
    //     return <Route {...rest} render={props => <Component {...props} />} />
    // }


    return (
        <Route
            {...rest}
            render={props =>
                !isAuthenticated && !loading ? (
                    <Redirect to={'/login'} />
                ) : (
                        <Component {...props} />
                    )
            }
        />
    )
}

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})

// export default PrivateRoute
export default connect(mapStateToProps)(PrivateRoute)