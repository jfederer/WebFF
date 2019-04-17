import {
	SET_CURRENT_USERNAME,
	USER_DATA_REQUEST,
	USER_DATA_LOAD_COMPLETE,

	MAKE_NEW_USER,
	SET_USER_DATA,

	SAMPLING_EVENTS_REQUEST,
	SAMPLING_EVENTS_LOAD_COMPLETE,

	SAMPLING_EVENT_REQUEST,
	SAMPLING_EVENT_LOAD_COMPLETE
} from '../Constants/ActionTypes';

import { makeNewUser } from './User';

// ****** Terminology ***********
//LOAD = triggered overall event
//REQUEST = SedFF starts the request of the event (invalidates/marks 'isacquireing' etc)
//ACQUIRE = SedFF takes steps to necessary data into memory SYNC... passes to fetch (async) if not in local
//FETCH = SedFF goes to API to get data (async) and passed to ingest
//INGEST = SedFF imports/stores/etc the data that came back from acquire if needed
//LOAD_COMPLETE = UI can release isacquireing and everything is loaded as should be in memory


export function loadAndSetCurrentUser(username) {
	return (dispatch, getState) => {
		dispatch(userDataRequest(username));


		dispatch(userDataAcquire(username))
			.then(
				() => {
					dispatch(setCurrentUsername(username));
					dispatch(userDataLoadComplete());
					//TODO: will need to fire off event loading, etc...
				}, () => {
					console.log("Unable to acquire user data");
					dispatch(makeNewUser(username));
					dispatch(userDataLoadComplete());
					//TODO: modal dialog indicating could overwrite old user data
				}
			);
	}
}

export function userDataRequest(username) {
	return { type: USER_DATA_REQUEST, username };
}

export function userDataAcquire(username) {
		// check if username is in store
		// if not, check from database
		// if not, reject with false
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			const user = getState().Users[username];
			if (user) {
				console.log("User exists in memory");
				resolve(true);
			} else {
				fetch('https://jsonplaceholder.typicode.com/users?username=Bret')
					.then(response => response.json())
					.then(json => dispatch(userDataIngest(json)))
					.then((didIngest) => {
						if (didIngest) {
							resolve(true);
						} else {
							reject(false);
						}
					});
			}

		})
	}
}


// function delay(t, v) {
// 	return new Promise(function (resolve) {
// 		setTimeout(resolve.bind(null, v), t)
// 	});
// }



export function setCurrentUsername(username) {
	return { type: SET_CURRENT_USERNAME, username }
}

export function userDataLoadComplete() {
	return { type: USER_DATA_LOAD_COMPLETE };
}

export function userDataIngest(userData) {
	return (dispatch) => {
		//TODO: ensure userdata is of appropriate format
		// console.log(userData);
		// dispatch({ type: SET_USER_DATA, user: userData }) //TODO: uncomment
		return false;
	}
}

export function loadSamplingEvent(eventID) {
	return { type: SAMPLING_EVENT_REQUEST, eventID: eventID }
}



