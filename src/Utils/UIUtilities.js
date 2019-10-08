import { getQuestionValue, getActiveSedimentTypes } from './QuestionUtilities';
import { getSetListAsArray } from './StoreUtilities';
import { METHOD_QIDS, DATA_ENTRY_INFORMATION_IDENTIFIER } from '../Constants/Config';
import { NOT_SAMPLED } from '../Constants/Dictionary';

export function shouldDataEntryTabShow(eventID) {
	if (eventID === null) {
		return false;
	}
	return  getActiveSedimentTypes(eventID).length > 0
}



export function shouldTablePagesShow(eventID) {  //FIXME: table pages shouldn't show up until a number of smaplings points exsits...
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