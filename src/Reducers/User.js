import { SET_OUTLINE_QUESTIONS, SET_BACKUP_INTERVAL, SET_SEDLOGIN_USERNAME } from '../Constants/ActionTypes';
import _ from 'lodash';

const initialUserState = {
		username: (localStorage.getItem('loggedInUser')) && localStorage.getItem('loggedInUser') !== 'undefined'
			? JSON.parse(localStorage.getItem('loggedInUser')) 
			: "mERP", 
		sedLoginUsername: (localStorage.getItem('loggedInUser')) && localStorage.getItem('loggedInUser') !== 'undefined'
		? JSON.parse(localStorage.getItem('loggedInUser')) 
		: "sedmERP", //TODO: pull this AND username appropriately, this is a hack
		settings : {
			backupInterval : 300,
			outlineQuestions: true,
			customQuestions: []
		}
};

export function User(state = initialUserState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case SET_OUTLINE_QUESTIONS:
			newState.settings.outlineQuestions = action.payload;
			return newState;
		case SET_BACKUP_INTERVAL:
			newState.settings.backupInterval = action.payload;
			return newState;
		case SET_SEDLOGIN_USERNAME:
			newState.sedLoginUsername = action.payload;
			return newState;
		default:
			return state
	}
}
