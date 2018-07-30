import React from 'react'; //lets me use JSX
import Question from '../Components/Question';


export const createQuestionComponentsForLayoutGroup = (questionsData, changeHandler) => {
    // the questonisData variable contains only Questions data for a single layout group
    // returns question components pointing to this.questionChangeHandler
	let layoutGroupQuestionComponents = [];

    if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
        layoutGroupQuestionComponents = questionsData.map(questionData => {
			return <Question {...questionData} stateChangeHandler={changeHandler} />
		});
    }

    return layoutGroupQuestionComponents;
}




export const mathStringReformat = (s) => {
    s = s.toLowerCase();
    s = replaceAll(s, " ", ""); // strip whitespace
    s = replaceAll(s, "-(", "-1*("); 
    s = replaceAll(s, ")(", ")*(");
    s = replaceAll(s, "-", "+-");
    s = replaceAll(s, "--", "+");
    s = replaceAll(s, "++", "+");
    s = replaceAll(s, "(+", "(");
    for (var i = 0; i < 10; i++) {
        s = replaceAll(s, i + "(", i + "*(");
    }
    while(s.charAt(0) === "+") s = s.substr(1);
    return s;
} // standardize string format

function replaceAll(haystack, needle, replace) {
    return haystack.split(needle).join(replace);
} // replace all fx
