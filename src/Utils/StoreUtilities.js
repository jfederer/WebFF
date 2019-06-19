import React from 'react'; //lets me use JSX
import Question from '../Components/Question';
import { Grid } from '@material-ui/core';
import store from '../Store';
import _ from 'lodash';

import { SET_INFORMATION_IDENTIFIER } from '../Constants/Config';

export function getNumberOfSets(eventID) { 

	let event = store.getState().SamplingEvents[eventID]; //TODO: change to "getEvent"

	let num = Object.keys(event.questionsValues).filter((key) => {  //TODO: change these to getQuestionValues
		return key.startsWith(SET_INFORMATION_IDENTIFIER);
	}).length;
	return num;
}


export function getSetListAsArray(eventID) { 
	let event = store.getState().SamplingEvents[eventID];  //TODO: change to "getEvent"

	let setListArr = [];
	setListArr = Object.keys(event.questionsValues).filter((key) => { //TODO: change these to getQuestionValues
		return key.startsWith(SET_INFORMATION_IDENTIFIER);
	})
	return setListArr;
}

export function getSetListAsObject(eventID) { 
	let setListObj = {};
	getSetListAsArray(eventID).forEach(qid => {
		setListObj[qid.split(SET_INFORMATION_IDENTIFIER)[1]] = qid;
	});
	return setListObj;
}



