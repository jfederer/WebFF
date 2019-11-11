import { SYNC_ALL_TO_DB } from '../Constants/ActionTypes';
import { fetchDBInfo } from '../Utils/NetworkUtilities';

import {userDataIngest} from './User';

export function syncToDB() { 
	return { type: SYNC_ALL_TO_DB }
  }
  
  
export function userDataAcquire(username) {
	console.log("userDataAcquire(", username, ")");
	// check if username is in store
	// if not, check from database
	// if not, reject with false
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			const user = getState().Users[username];
			if (user) {
				console.log("User exists in memory");
				//TODO: check if one in DB is newer...
				resolve(true);
			} else {
				fetchDBInfo({ key: "username", value: username },
					"Users",
					(dbResponse) => {  // success callback
						console.log("Success callback");
						if (Array.isArray(dbResponse) && dbResponse.length === 1) {
							let dispatchResp = dispatch(userDataIngest(dbResponse[0]));
							console.log('dispatchResp', dispatchResp)
							resolve(true);
						} else {
							console.log("dbResponse did not return exactly one user");
							reject(false);
						}
					},
					(res) => { // failure callback
						console.warn("userDataAcquire fetchDBInfo failure callback: " + res);
						reject(false);
					});

				// fetch('https://jsonplaceholder.typicode.com/users?username=Bret')
				// 	.then(response => response.json())
				// 	.then(json => dispatch(userDataIngest(json)))
				// 	.then((didIngest) => {
				// 		if (didIngest) {
				// 			resolve(true);
				// 		} else {
				// 			reject(false);
				// 		}
				// 	});
			}
		})
	}
}