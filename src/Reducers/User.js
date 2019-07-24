import { 
	SET_OUTLINE_QUESTIONS, 
	SET_BACKUP_INTERVAL, 
	SET_SEDLOGIN_USERNAME,
	SET_USER_DATA,
	ADD_QUESTION_TO_USER
} from '../Constants/ActionTypes';
import _ from 'lodash';

//MOCK
const initialUserState = {
	"jfederer@usgs.gov": {
		username: "jfederer@usgs.gov",
		sedLoginUsername: "jfederer@usgs.gov",
		settings: {
			backupInterval: 310,
			outlineQuestions: true,
			customQuestions: []
		}
	},
	"test@usgs.gov": {
		username: "test@usgs.gov",
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
			newState.settings.outlineQuestions = action.useOutlineQuestions; //FIXME: doesn't affect right part of store
			return newState;
		case SET_BACKUP_INTERVAL:
			newState.settings.backupInterval = action.intervalInSeconds; //FIXME: doesn't affect right part of store
			return newState;
		case SET_SEDLOGIN_USERNAME:
			newState.sedLoginUsername = action.newSedLoginUsername; //FIXME: doesn't affect right part of store
			return newState;
		case SET_USER_DATA:
			newState[action.user.username] = action.user;
			return newState
		default:
			return state
	}
}
