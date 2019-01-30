import { SET_OUTLINE_QUESTIONS, SET_BACKUP_INTERVAL, SET_SEDLOGIN_USERNAME } from '../Constants/ActionTypes';
import _ from 'lodash';

//MOCK
const initialUserState = {
	"jfederer@usgs.gov": {
		username: "jfederer@usgs.gov",
		sedLoginUsername: "jfederer@usgs.gov",
		settings: {
			backupInterval: 300,
			outlineQuestions: true,
			customQuestions: []
		}
	},
	"tvanheel@usgs.gov": {
		username: "tvanheel@usgs.gov",
		sedLoginUsername: "tvan@usgs.gov",
		settings: {
			backupInterval: 200,
			outlineQuestions: false,
			customQuestions: []
		}
	}
};

export function Users(state = initialUserState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case SET_OUTLINE_QUESTIONS:
			newState.settings.outlineQuestions = action.useOutlineQuestions;
			return newState;
		case SET_BACKUP_INTERVAL:
			newState.settings.backupInterval = action.intervalInSeconds;
			return newState;
		case SET_SEDLOGIN_USERNAME:
			newState.sedLoginUsername = action.newSedLoginUsername;
			return newState;
		default:
			return state
	}
}
