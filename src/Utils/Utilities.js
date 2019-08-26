import {
	SET_INFORMATION_IDENTIFIER, IDENTIFIER_SPLITTER
} from '../Constants/Config';

export const getDateStringFromDate = (date) => {
	let d = date;
	if (!d) {
		d = new Date()
	}

	return d.getUTCFullYear() + "-" +
		("0" + (d.getUTCMonth() + 1)).slice(-2) + "-" +
		("0" + d.getUTCDate()).slice(-2);
}

export const getTimeStringFromDate = (date) => {
	let d = date;
	if (!d) {
		d = new Date()
	}

	return ('0' + d.getHours()).slice(-2) + ":" + ('0' + (d.getMinutes())).slice(-2);
}


export const getDateObjectFromTime = (dateString) => {
	let retDate = new Date("Jan 22, 1981 " + dateString);
	return retDate;
}

export const getKeyFromValue = (obj, value) => {
	let retKey = null;
	Object.keys(obj).forEach((key) => {
		if (obj[key] === value) {
			retKey = key;
		}
	});
	return retKey;
}

export const getShortSetNameFromFullSetName = (fullSetName) => {
	let shortSetName = fullSetName.split(IDENTIFIER_SPLITTER + SET_INFORMATION_IDENTIFIER)[1];
	if (!shortSetName) {
		throw new Error("Failed to get short set name from full set name '" + fullSetName + "'.  Check passing function is providing accurate fullSetName");
	}
	return shortSetName;
}