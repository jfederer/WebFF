import { SAMPLE_TIME_HEADER } from '../Constants/Dictionary';
import { getQuestionValue, getDescriptiveColumnForTable } from './QuestionUtilities';
import { getSetListAsArray, getNumberOfSamplesInSet, checkForValidSedimentType } from './StoreUtilities';

export const provideEWISamplingLocations = (samplingZone_left, samplingZone_right, pierLocations, pierWidths, numberOfSamples) => {
    
    samplingZone_left = parseInt(samplingZone_left, 10);
    samplingZone_right = parseInt(samplingZone_right, 10);
    pierLocations.filter((el)=>parseInt(el, 10));
    pierWidths.filter((el)=>parseInt(el, 10)); 
    numberOfSamples = parseInt(numberOfSamples, 10);
    if(numberOfSamples===null | numberOfSamples==="") {
		return;
	}
   let samplingLocations = new Array(numberOfSamples);
    let pierCounted = new Array(pierLocations.length).fill(false);
    let pierTotalWidth = 0;

   // console.log("CALCULATING");

    // console.log(samplingZone_left, samplingZone_right, pierLocations, pierWidths, numberOfSamples);

    function correctSamplingLocationBasedOnPiers (location) {
        // console.log("location: ", location);
        for(let i =0; i<pierLocations.length; i++) {
            if(location > pierLocations[i] && pierCounted[i]===false) {
                pierCounted[i] = true;
                location+=pierWidths[i];
            }
        }
    // console.log("Corrected location: ", location);
        return location;
    }



    for(let i = 0; i<pierWidths.length; i++) {
        pierTotalWidth += pierWidths[i];
    }
    let samplingZoneWidth = (samplingZone_right - samplingZone_left) - pierTotalWidth;
    let samplingWidth = samplingZoneWidth / numberOfSamples;

    samplingLocations[0] = correctSamplingLocationBasedOnPiers(samplingZone_left+(samplingWidth/2));
    for(let i = 1; i<samplingLocations.length;i++) {
        samplingLocations[i] = correctSamplingLocationBasedOnPiers(samplingLocations[i-1]+samplingWidth);
    }
    for(let i = 0; i<samplingLocations.length;i++) {
        samplingLocations[i] = Math.round( samplingLocations[i] * 10 ) / 10;
    }

return samplingLocations;
}

export const provideEDISamplingPercentages = (numberOfSamples) => {
  let width = 100 / numberOfSamples;
  let results = [];
  for(let i=1; i<=numberOfSamples; i++) {
	results.push((Math.round((((i)*width)-(width/2))* 10 ) / 10)+'%');
  }
return results;
}


export const insertEstimatedTime = (eventID, sedType, value) => {
	checkForValidSedimentType(sedType, "insertEstimatedTime");
	let etc = getEstimatedTimeColumn(eventID, sedType);
	let SampleTimeIndex = value[0].indexOf(SAMPLE_TIME_HEADER);
	if (SampleTimeIndex < 0) { throw new Error(SAMPLE_TIME_HEADER + " not found in header of QWDATA table") }
	for (let row = 1; row < value.length; row++) { // skip header row
		if (!Array.isArray(value[row][SampleTimeIndex])) {
			value[row][SampleTimeIndex] = etc[row];
		}
	}
	return value;
}


export const getEstimatedTimeColumn = (eventID, sedType) => {
	checkForValidSedimentType(sedType, "getEstimatedTimeColumn");

	let descColumn = getDescriptiveColumnForTable(eventID, sedType);
	let estimatedTimeColumn = new Array(descColumn.length).fill("");
	let setList = getSetListAsArray(eventID, sedType);

	let totalNumberOfSamplesInPreviousSets = 0;
	setList.forEach((setName) => {
		let numberOfSamplesInSet = getNumberOfSamplesInSet(eventID, sedType, setName);
		let startTime = getQuestionValue(eventID, setName, "startTime");
		let endTime = getQuestionValue(eventID, setName, "endTime");
		let ai = !getQuestionValue(eventID, setName, "samplesComposited");
		let startDateTime = new Date("January 1, 2000 " + startTime)
		let endDateTime = new Date("January 1, 2000 " + endTime)
		let msElapsed = Math.abs(endDateTime - startDateTime);
		let msBetweenSamples = msElapsed / (numberOfSamplesInSet - 1);

		for (let sampNum = 0; sampNum < (ai ? numberOfSamplesInSet : 1); sampNum++) {
			let QWDATARowNum = sampNum + 1 + totalNumberOfSamplesInPreviousSets;
			let timeSinceStart = (sampNum * msBetweenSamples);
			let d = new Date(startDateTime.getTime() + timeSinceStart);
			estimatedTimeColumn[QWDATARowNum] = startTime && endTime
				? ('0' + d.getHours()).slice(-2) + ":" + ('0' + (d.getMinutes())).slice(-2)
				: "";
		}
		totalNumberOfSamplesInPreviousSets += ai ? eval(numberOfSamplesInSet) : eval(1); // if this set was a composite, it was only one line in the QWDATA Table
	});

	return estimatedTimeColumn;
}