import { getQuestionValue } from './QuestionUtilities';
import { METHOD_QIDS } from '../Constants/Config';
import { NOT_SAMPLED } from '../Constants/Dictionary';

export function shouldDataEntryTabShow(eventID) {
	if(eventID===null) {
		return false;
	}
	let show = false;
	Object.values(METHOD_QIDS).forEach(method_QID => {
		if (getQuestionValue(eventID, method_QID)!==NOT_SAMPLED) {
			show = true;
		}
	});
	return show;
}