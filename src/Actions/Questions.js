import { 
	SET_QUESTION_OPTIONS, 
	} from '../Constants/ActionTypes';



export function setQuestionOptions(questionID, options) {  //TODO: add something in for non-Sampling-Events quetions (settings, etc)
	return { type: SET_QUESTION_OPTIONS, questionID, options }
  }


