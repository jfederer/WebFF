import _ from 'lodash';

import {
	COMBINE_USER_QUESTIONS,
	ADD_QUESTION,
	RESET_QUESTIONS_DATA_TO_DEFAULT,
	SET_QUESTION_OPTIONS,
	SHOW_QUESTIONS,
	HIDE_QUESTIONS
} from '../Constants/ActionTypes';

import { defaultQuestionsData } from './../Constants/DefaultObjects';

const initialState = {
	questionsData: defaultQuestionsData
};

export function Questions(state = initialState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case COMBINE_USER_QUESTIONS:
			//TODO:  combine action.currentUserQuestions with initialState
			return newState;
		case ADD_QUESTION:
			//TODO: add action.question to state
			return newState;
		case RESET_QUESTIONS_DATA_TO_DEFAULT:
			let resetState = initialState;
			return resetState;
		case SET_QUESTION_OPTIONS:
			try {
				newState.questionsData[action.questionID].options = action.options;
			}
			catch (err) {
				console.warn("Attempted to set options on non-existent question " + action.questionID);
			}
			return newState;
		case SHOW_QUESTIONS: // action.payload is an array of 1-length arrays containing questionIDs
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
			let questionsToHide = action.payload.map((questionArr) => questionArr[0]);
			questionsToHide.forEach(q_ID => {
				try {
					newState.questionsData[q_ID]['hidden'] = false;
				}
				catch (err) {
					console.warn("Attempted to hide non-existent question " + q_ID);
				}
			});
			return newState;
		default:
			return state;
	}
}


