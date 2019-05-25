import { 
	SET_QUESTION_OPTIONS, 
	ADD_QUESTION
	} from '../Constants/ActionTypes';



export function setQuestionOptions(questionID, options) {  //TODO: add something in for non-Sampling-Events quetions (settings, etc)
	return { type: SET_QUESTION_OPTIONS, questionID, options }
  }

  export function addQuestion(question) {  
	return { type: ADD_QUESTION, question }
  }




