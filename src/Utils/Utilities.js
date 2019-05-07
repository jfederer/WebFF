export const safeCopy = (obj) => {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" !== typeof obj) return obj;

    // Handle boolean, number, and string
    if (typeof obj === "boolean" ||
        typeof obj === "number" ||
        typeof obj === "string") {
        return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = safeCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = safeCopy(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

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

