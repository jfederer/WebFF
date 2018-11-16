import {PHP_FILE_LOCATION } from './Constants';

export const isReasonablyValidUsernameInLS = () => {
    let user = "";
    try {
        user = JSON.parse(localStorage.getItem('loggedInUser'));
    }
    catch (e) {
        user = localStorage.getItem('loggedInUser');
    }

    let ret = !(user === undefined || user === null || user === '' || user.indexOf('@usgs.gov') < 4);

    return ret;
}

export const ensureProgramVersionUpToDate = (localVersion) => {
    console.log("Checking if program version " + localVersion + " needs to be updated...");

    let url = PHP_FILE_LOCATION + 'currentVersion.php';
    fetch(url)
        .then(response => response.text())
        .then((repos) => {
            if (repos !== localVersion) {
                alert("You are using an out-of-date version of SedFF. \nWe will reload to get the newest version. You may see this message 3 times.");
                window.location.reload(true);
            }
        }
        );
}