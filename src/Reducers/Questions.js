import _ from 'lodash';

import {
	// COMBINE_USER_QUESTIONS,
	ADD_QUESTION_TO_QUESTIONS_DATA,
	RESET_QUESTIONS_DATA_TO_DEFAULT,
	SHOW_QUESTIONS,
	HIDE_QUESTIONS
} from '../Constants/ActionTypes';

import { defaultQuestionsData } from './../Constants/DefaultObjects';


const initialState = {
	questionsData: defaultQuestionsData
};



const userQuestions = { };
const eventQuestions = {};

export function Questions(state = initialState, action) {
	// let newState = _.cloneDeep(state);

	let newState = _.merge({}, state, userQuestions, eventQuestions);

	switch (action.type) {
		case ADD_QUESTION_TO_QUESTIONS_DATA: //TODO: FIXME: verify no duplicate
			newState.questionsData[action.question.id]=action.question;
			return newState;
		// case ADD_QUESTION_TO_EVENT:
		// 	// catching action from sampling event reducer to ensure we update questionsData
		// 	console.log("Here2");
		// 	return newState;
		case RESET_QUESTIONS_DATA_TO_DEFAULT:
			let resetState = initialState;
			return resetState;
		// case SET_QUESTION_OPTIONS:
		// 	try {
		// 		newState.questionsData[action.questionID].options = action.options;
		// 	}
		// 	catch (err) {
		// 		console.warn("Attempted to set options on non-existent question " + action.questionID);
		// 	}
		// 	return newState;
		case SHOW_QUESTIONS: // action.payload is an array of arrays containing full paths to questionIDs
			//FUTURE: should question show/hide belong in the sampling event? user?
			//OPTIMIZE: SHOW and HIDE are copies of each other with one thing changed... combine?
			let questionsToShow = action.payload.map((questionArr) => questionArr[0]);
			questionsToShow.forEach(q_ID => {
				try {
					newState.questionsData[q_ID]['hidden'] = false;
				}
				catch (err) {
					console.warn("Attempted to show non-existent question " + q_ID);
				}
			});
			return newState;
		case HIDE_QUESTIONS:
			// let questionsToHide = action.payload.map((questionArr) => questionArr[0]);
			action.QID_paths.forEach(QID_path => {
				try {
					// console.log('QID_path1 :', QID_path);
					// let getValue = _.get(newState.questionsData, ...QID_path.concat(['hidden']));
					// console.log("getValue1: ", getValue);

					let hiddenPath = QID_path.concat(['hidden']);

					console.log('hidden path :', hiddenPath);
					// let questionData = _.get(newState.questionsData, QID_path.concat('hidden'));
					// console.log("questionData: ", questionData);

					_.set(newState.questionsData, hiddenPath, true);
					console.log("statonNumberQD: ", newState.questionsData.stationNumber);
					// questionData['hidden'] = true;
					// _.set(newState.questionsData, q_ID_path.push('hidden'), true )


					// newState.questionsData[q_ID]['hidden'] = true;
				}
				catch (err) {
					console.warn("Attempted to hide non-existent question " + QID_path);
				}
			});
			return newState;
		default:
			return state;
	}
}


