import {PHP_FILE_LOCATION, PROGRAM_VERSION } from '../Constants/Version';

export const isReasonablyValidUsernameInLS = () => {
    let user = "";
    try {
        user = JSON.parse(localStorage.getItem('loggedInUser'));
    }
    catch (e) {
        user = localStorage.getItem('loggedInUser');
    }
    return isReasonableUsername(user);
}

export const isReasonableUsername = (user) => {
	return !(user === undefined || user === null || user === '' || user.indexOf('@usgs.gov') < 4 || user.length < 11);
}

export const ensureProgramVersionUpToDate = () => {
    console.log("Checking if program version " + PROGRAM_VERSION + " needs to be updated...");

    let url = PHP_FILE_LOCATION + 'currentVersion.php';
    fetch(url)
        .then(response => response.text())
        .then((repos) => {
            if (repos !== PROGRAM_VERSION) {
                alert("You are using an out-of-date version of SedFF ("+PROGRAM_VERSION+").\n We will reload to get the newest version ("+repos+").\n\n You may see this message multiple times.");
                window.location.reload(true); //TODO: should be a new action -- checking and updating are separate concepts
            }
        }
        );
}