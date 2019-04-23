import _ from 'lodash';

import { 
	COMBINE_USER_QUESTIONS,
	ADD_QUESTION,
	RESET_QUESTIONS_DATA_TO_DEFAULT
 } from '../Constants/ActionTypes';


import { defaultQuestionsData } from './../Constants/DefaultObjects';

const initialState = defaultQuestionsData;

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
		default:
			return state;
	}
}
