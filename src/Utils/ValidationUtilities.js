// import React from 'react'; //lets me use JSX

export const isReasonablyValidUsernameInLS = () => {
        //let user = JSON.parse(localStorage.getItem('loggedInUser'));
        let user = localStorage.getItem('loggedInUser');
        return !(user===null||user===''||user.indexOf('@usgs.gov')<4);
    }