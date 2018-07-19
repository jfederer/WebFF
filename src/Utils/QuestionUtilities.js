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

// export default createQuestionComponentsForLayoutGroup;



