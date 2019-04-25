import _ from 'lodash';

import {
	COMBINE_USER_QUESTIONS,
	ADD_QUESTION,
	RESET_QUESTIONS_DATA_TO_DEFAULT,
	SET_QUESTION_OPTIONS
} from '../Constants/ActionTypes';


import { defaultQuestionsData } from './../Constants/DefaultObjects';

const initialState = {
	questionsData: defaultQuestionsData,
	hiddenPanels: ["FieldForm:Weather"],
	hiddenQuestions: []
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
		// console.log(action.questionID);
		// console.log(newState.questionsData);
			newState.questionsData[action.questionID].options = action.options;
			return newState;
		default:
			return state;
	}
}
