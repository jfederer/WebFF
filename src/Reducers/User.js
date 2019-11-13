import { 
	SET_OUTLINE_QUESTIONS, 
	SET_BACKUP_INTERVAL, 
	SET_SEDLOGIN_USERNAME,
	SET_USER_DATA,
	ADD_QUESTION_TO_USER,
	DELETE_QUESTION_FROM_USER
} from '../Constants/ActionTypes';
import _ from 'lodash';

//MOCK
const initialUserState = {

};

export function Users(state = initialUserState, action) {   //FIXME: all but "SET USER" will bomb if user doesn't exist
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case SET_OUTLINE_QUESTIONS:
			newState[action.username].settings.outlineQuestions = action.useOutlineQuestions; 
			newState[action.username].dateModified = new Date().toString();
			return newState;
		case SET_BACKUP_INTERVAL:
			newState[action.username].settings.backupInterval = action.intervalInSeconds; 
			newState[action.username].dateModified = new Date().toString();
			return newState;
		case SET_SEDLOGIN_USERNAME:
			newState[action.username].sedLoginUsername = action.newSedLoginUsername; 
			newState[action.username].dateModified = new Date().toString();
			return newState;
		case SET_USER_DATA:
			newState[action.user.username] = action.user;
			return newState;
		case ADD_QUESTION_TO_USER:	
			newState[action.username].settings.questionsData[action.question.id] = action.question;
			newState[action.username].dateModified = new Date().toString();
			return newState;
		case DELETE_QUESTION_FROM_USER:	
			delete newState[action.username].settings.questionsData[action.QID];
			newState[action.username].dateModified = new Date().toString();
			return newState;
		default:
			return state
	}
}
