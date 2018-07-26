import React from 'react'; //lets me use JSX
import Question from '../Components/Question';


export const createQuestionComponentsForLayoutGroup = (questionsData, changeHandler) => {
    // the questonisData variable contains only Questions data for a single layout group
    // returns question components pointing to this.questionChangeHandler
    let layoutGroupQuestionComponents = [];

    if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
        layoutGroupQuestionComponents = questionsData.map(questionData => <Question {...questionData} stateChangeHandler={changeHandler} />);
    }

    return layoutGroupQuestionComponents;
}

export const getQuestionData= (questionID) => {
	// returns questionData about single question with its' key field equal to questionKey
	//WARNING, this assumes questionsData is populated in LS  //TODO, do not make assumption
	
	var questionsData = JSON.parse(localStorage.getItem('questionsData'));
	var questionData = questionsData.filter(questionData => questionData.id === questionID);
	
	if(questionData != null && questionData.length===1) {
		return questionData[0];
	} else {
		return null; //TODO: throw errors
	}
}

export const getLayoutGroupNames = (questionsData) => {
    // provided with questionData, will return array of layout group names (strings)
    let layoutGroupNames = [];

    if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
        for (let i = 0; i < questionsData.length; i++) {
            if (!layoutGroupNames.includes(questionsData[i].layoutGroup)) {
                layoutGroupNames.push(questionsData[i].layoutGroup);
            }
        }
    }
    return layoutGroupNames;
}

export const getLayoutGroupQuestionsData = (questionsData, layoutGroupName) => {
    // given questionData, will filter down to items that match the layoutgroup = layoutGroupName
    let layoutGroupQuestionsData = [];

    if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
        layoutGroupQuestionsData = questionsData.filter((questionData) => {
            return questionData.layoutGroup === layoutGroupName;
        });
    }
    return layoutGroupQuestionsData;

}

export const saveQuestionValueToLS = (Q) => {
	//this function saves updated question "values" (must be located at "Q.value") to localStorage.questionsData

	var DEBUG = false;
	if (DEBUG) console.log(Q);
	if (Q == null) { //POC
		console.log("Question returned to questionChangeHandler was null");
		return;
	}

	if (DEBUG) console.log("--------------");
	if (DEBUG) console.log("FF state:");
	if (DEBUG) console.log(this.state);
	// to sync question modifications to localStorage
	if (DEBUG) console.log("--------------");
	if (DEBUG) console.log("Q:");
	if (DEBUG) console.log(Q.state);


	// get the questions in localStorage
	var rawData = JSON.parse(localStorage.getItem('questionsData'));
	if (DEBUG) console.log("--------------");
	if (DEBUG) console.log("questionsData");
	if (DEBUG) console.log(rawData);

	// find the specific question in questionData based on the key,then update the value property
	var QData = rawData.filter(questionData => {
		if (questionData.key === Q.state.key) {
			if (DEBUG) console.log("------FOUND!--------");
			if (DEBUG) console.log("questionData (pre)");
			if (DEBUG) console.log(questionData);
			if (DEBUG) console.log("Q.state.value");
			if (DEBUG) console.log(Q.state.value);
			questionData.value = Q.state.value;
			if (DEBUG) console.log("--------------");
			if (DEBUG) console.log("questionData (post)");
			if (DEBUG) console.log(questionData);
		}
		return questionData;
	});

	if (DEBUG) console.log(QData);

	// replace the questionData in localStorage
	localStorage.setItem('questionsData', JSON.stringify(rawData));
}


