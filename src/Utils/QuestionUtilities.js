import React from 'react'; //lets me use JSX
import Question from '../Components/Question';


export const createQuestionComponents = (questionsData, changeHandler, _globalState, questionsValues, allProps) => {
    // creates one question component for every question in questionsData
	// overwrites questionsData value with passed in value in questionsValues
	let questionComponents = [];
	// console.log("createQuestionComponents: questionsData", questionsData);
    if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
        questionComponents = questionsData.map(questionData => {

			let value = questionData.value;
			//console.log("Value from questionData: ", value);
			if(questionsValues) {
			//	console.log("questionsData.id: ", questionData.id);
				value = questionsValues[questionData.id]
				//console.log("Value from questionVALUES: ", value);
			}
	//		console.log(allProps);
			let allPropFuncs = {};
			Object.keys(allProps).map((propKey)=> {
				if(typeof(allProps[propKey])=== "function") {
					allPropFuncs[propKey]=allProps[propKey];
				}
				return null;
			});

	//		console.log(allPropFuncs);

			return <Question {...allPropFuncs}  {...questionData} value={value} questionsValues={questionsValues} stateChangeHandler={changeHandler} globalState={_globalState} />
		});
    }

    return questionComponents;
}

export const getQuestionDataFromQuestionsDataByQuestionID=(questionsData, questionID) => {
	let DEBUG = false;
	
	if(DEBUG)console.log("--------------");
	if(DEBUG)console.log(questionsData);
	if(DEBUG)console.log("looking for questionID: ", questionID);
	
	let questionData = questionsData.filter(questionData => {
		
		// var areEqual = questionData.id.toUpperCase() === questionID.toUpperCase();
		// console.log(questionData.id + " " + areEqual);
		
		if (questionData.id === questionID) {
			if(DEBUG)console.log("Found");
			return questionData;
		}
		return null;
	}
	);
	
	if(DEBUG)console.log(questionData);

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
    // given questionData, will filter down to items that match the layoutgroup = layoutGroupName ....
    let layoutGroupQuestionsData = [];

    if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
        layoutGroupQuestionsData = questionsData.filter((questionData) => {
            return questionData.layoutGroup === layoutGroupName;
        });
    }
    return layoutGroupQuestionsData;

}



export const saveQuestionValueToLS = (Q) => {
	//this function saves updated question "values" (must be located at "Q.state.value") to localStorage.questionsData
	// returns updated questionsData object
	//console.log("getQuestionDataWithUpdatedValue", Q.state.value);
	var DEBUG = false;
	if (DEBUG) console.log("getQuestionDataWithUpdatedValue: Q: ", Q);
	if (Q == null) { //POC
		console.log("Question passed to getQuestionDataWithUpdatedValue was null or undefined");
		return;
	}

	// get the questions in localStorage
	var questionsDataFromLS = JSON.parse(localStorage.getItem('questionsData'));
	if (DEBUG) console.log("getQuestionDataWithUpdatedValue: questionsDataFromLS: ", questionsDataFromLS);

	// find the specific question in questionsDataFromLS based on the id,then update the value property
	var newQuestionsData = questionsDataFromLS.filter(questionData => {
		//if (DEBUG) console.log("saveQuestionValueToLS: ", questionData.id + " === " + Q.props.id);
		if (questionData.id === Q.props.id) {
			if (DEBUG) console.log("------FOUND!--------");
			if (DEBUG) console.log("getQuestionDataWithUpdatedValue: questionData (pre): ", questionData);
			if (DEBUG) console.log("getQuestionDataWithUpdatedValue: Q.state.value", Q.state.value);
			questionData.value = Q.state.value;
			if (DEBUG) console.log("getQuestionDataWithUpdatedValue: questionData (post)", questionData);

		} else {
			if (DEBUG) console.log("getQuestionDataWithUpdatedValue: no");
		}
		return questionData;
	});

	if (DEBUG) console.log("getQuestionDataWithUpdatedValue: newQuestionsData: ", newQuestionsData);

	// replace the questionData in localStorage
	localStorage.setItem('questionsData', JSON.stringify(newQuestionsData));

}


