import {
	ADD_QUESTION_TO_QUESTIONS_DATA,
	ADD_QUESTION_TO_USER,
	ADD_QUESTION_TO_EVENT,
	ADD_QUESTION_TO_STATION
} from '../Constants/ActionTypes';



// export function setQuestionOptions(questionID, options) {  //TODO: add something in for non-Sampling-Events quetions (settings, etc)
// 	return { type: SET_QUESTION_OPTIONS, questionID, options }
//   }

export function addQuestionToUser(username, question) {
	// console.log("addQuestionToUser(",username,",", question,")");
	return (dispatch) => {
		dispatch({ type: ADD_QUESTION_TO_USER, username, question });

		// dispatch({ type: COMBINE_QUESTIONS_DATA }); //TODO: need getState?  Call a store util instead?
	}
}

export function addQuestionToQuestionsData(question) {
	return { type: ADD_QUESTION_TO_QUESTIONS_DATA, question }
}

export function addQuestionToEvent(eventID, question) {
	return (dispatch) => {
		dispatch({ type: ADD_QUESTION_TO_EVENT, eventID, question });

		// dispatch({ type: COMBINE_QUESTIONS_DATA }); //TODO: need getState?  Call a store util instead?
	}
}
export function addQuestionToStation(stationID, question) {
	console.log("addQuestionToStation(", stationID, ",", question, ")");
	return (dispatch) => {
		dispatch({ type: ADD_QUESTION_TO_STATION, stationID, question });

		// dispatch({ type: COMBINE_QUESTIONS_DATA }); //TODO: need getState?  Call a store util instead?
	}
}






