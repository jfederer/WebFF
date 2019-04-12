
import {
	MAKE_NEW_USER,
} from '../Constants/ActionTypes';

export function requestUserData(dispatch, getState, username) {
	// check if username is in store
	// if not, check in local storage
	// if not, check from database
	// if not, return null
	const user = getState().Users[username];  // if already in store, just change the current username  //FUTURE: check date against user mod date in database
		if(user) {
			return user;
		} else {
			console.log("User not in memory");
			dispatch({type: MAKE_NEW_USER, username});
			return false;
		}
}




export function checkMemoryForUsername(username) {
	// blah
	console.log("checkMemoryForUsername");
}

export function checkLocalStorageForUsername(username) {
	// blah
	console.log("checkLocalStorageForUsername");
}

export function checkDatabaseForUsername(username) {
	// blah
	console.log("checkDatabaseForUsername");
}
