import React from 'react'; //lets me use JSX
import Question from '../Components/Question';


export const insertNode = (questionsData, changeHandler, _globalState, questionsValues) => {
    // creates one question component for every question in questionsData
	// overwrites questionsData value with passed in value in questionsValues
	let questionComponents = [];
	//console.log(questionsValues);
    if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
        questionComponents = questionsData.map(questionData => {

			let value = questionData.value;
			//console.log("Value from questionData: ", value);
			if(questionsValues) {
			//	console.log("questionsData.id: ", questionData.id);
				value = questionsValues[questionData.id]
				//console.log("Value from questionVALUES: ", value);
			}

			return <Question {...questionData} value={value} questionsValues={questionsValues} stateChangeHandler={changeHandler} globalState={_globalState}/>
		});
    }

    return questionComponents;
}