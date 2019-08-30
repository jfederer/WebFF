import { getQuestionValue } from './QuestionUtilities';
import { getSetListAsArray } from './StoreUtilities';
import { METHOD_QIDS, DATA_ENTRY_INFORMATION_IDENTIFIER } from '../Constants/Config';
import { NOT_SAMPLED } from '../Constants/Dictionary';

export function shouldDataEntryTabShow(eventID) {
	if (eventID === null) {
		return false;
	}
	let show = false;
	Object.values(METHOD_QIDS).forEach(method_QID => {
		if (getQuestionValue(eventID, method_QID) !== NOT_SAMPLED) {
			show = true;
		}
	});
	return show;
}
export function shouldTablePagesShow(eventID) {
	if (eventID === null) {
		return false;
	}
	let show = false;

	Object.keys(METHOD_QIDS).forEach(sedType => {
		if (getQuestionValue(eventID, DATA_ENTRY_INFORMATION_IDENTIFIER + sedType)) {
			getSetListAsArray(eventID, sedType).forEach(setName => {
				if (getQuestionValue(eventID, DATA_ENTRY_INFORMATION_IDENTIFIER + sedType, setName, "numberOfSamplingPoints")) {
					show = true;
				}
			})
		}
	})
	return show;
}