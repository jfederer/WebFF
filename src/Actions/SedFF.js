import {
	SET_CURRENT_USERNAME,
	REQUESTING_USER_DATA,
	RECEIVED_USER_DATA,
	USER_DATA_LOAD_COMPLETE,
	MAKE_NEW_USER,
	LOAD_SAMPLING_EVENT,
	SET_USER_DATA
} from '../Constants/ActionTypes';

//import {requestUserData} from '../Utils/User';

// likely need a 'load current user' and a 'set current user' as separate items...   load user -> request UD -> recieve UD -> set user ....

export function loadAndSetCurrentUser(username) {

	return (dispatch, getState) => {
		dispatch(requestingUserData(username)); // sets SedFF.isFetchingUserData

		const user = getState().Users[username];
		if (user) {
			// if already in store, just change the current username  
			//FUTURE: check date against user mod date in database
			dispatch(setCurrentUsername(username));
			dispatch(userDataLoadComplete());
		} else {
			// user not in store, need to check database
			fetch('https://jsonplaceholder.typicode.com/users?username=Bret')
				.then(response => response.json())
				.then(json => dispatch(ingestUserData(json)))
				.then(() => dispatch(userDataLoadComplete()));
		}
	}
}


function delay(t, v) {
	return new Promise(function (resolve) {
		setTimeout(resolve.bind(null, v), t)
	});
}

export function requestingUserData(username) {
	return { type: REQUESTING_USER_DATA, username };
}

export function setCurrentUsername(username) {
	return { type: SET_CURRENT_USERNAME, username }
}

export function ingestUserData(userData) {


	return (dispatch) =>
		delay(3000).then(() => {
			console.log("IUD");
			console.log(userData);
			dispatch({ type: SET_USER_DATA, userData })
		}
		)
}

export function userDataLoadComplete() {
	return { type: USER_DATA_LOAD_COMPLETE };
}





export function requestUserData(dispatch, getState, username) {
	// check if username is in store
	// if not, check in local storage
	// if not, check from database
	// if not, return null
	const user = getState().Users[username];  // if already in store, just change the current username  //FUTURE: check date against user mod date in database
	if (user) {
		return user;
	}

	console.log("User not in memory");

	return dispatch => {
		checkDatabaseForUsername(username);
	}


	dispatch({ type: MAKE_NEW_USER, username });
	return false;
}

export function checkDatabaseForUsername(username) {
	console.log("checkDatabaseForUsername");
	return dispatch => {
		fetch('https://jsonplaceholder.typicode.com/users?username=Bret')
			.then(response => response.json())
			.then(json => dispatch(receiveUserData(json)))
	}
}


// async example
// export function setCurrentUser(username) {
// 	// return { type: SET_CURRENT_USERNAME, username }
// 	return dispatch => {
// 			dispatch(requestUserData(username))
// 			return fetch('https://jsonplaceholder.typicode.com/users?username=Bret')
// 			.then(response => response.json())
// 			.then(json => dispatch(receiveUserData(json))) //last one in the 'then chain' needs to just be a standard object (I think)
// 	}
// }


export function makeNewUser(username) {
	return { type: MAKE_NEW_USER, username }
}



export function receiveUserData(userdata) {
	return { type: RECEIVED_USER_DATA, userdata } //FUTURE: "received at"
}



export function loadSamplingEvent(eventID) {
	return { type: LOAD_SAMPLING_EVENT, eventID: eventID }
}



