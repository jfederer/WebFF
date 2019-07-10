export const getDateStringFromDate = (date) => {
	let d = date;
	if(!d) {
		d = new Date()
	}
	
	return d.getUTCFullYear() + "-" +
		("0" + (d.getUTCMonth() + 1)).slice(-2) + "-" +
		("0" + d.getUTCDate()).slice(-2);
}

export const getTimeStringFromDate = (date) => {
	let d = date;
	if(!d) {
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