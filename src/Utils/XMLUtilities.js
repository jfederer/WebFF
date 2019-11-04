import xmljs from 'xml-js';
import { PROGRAM_VERSION, DATA_ENTRY_INFORMATION_IDENTIFIER, IDENTIFIER_SPLITTER, SEDIMENT_TYPES } from '../Constants/Config';
import { getQuestionValue, getActiveSedimentTypes, getMethodCategoryFromValue, getColumnNumberFromTableHeader } from './QuestionUtilities';
import { getSetListAsArray } from './StoreUtilities';
import {
	SET_INFORMATION_IDENTIFIER,
	QWDATA_TABLE_IDENTIFIER,
	PARAMETERS_TABLE_IDENTIFIER,
	XML_SPLITTER,
} from '../Constants/Config';

import {
	SAMPLE_TIME_HEADER, SAMPLE_DATE_HEADER, HYDROLOGIC_EVENT_HEADER, HYDROLOGIC_COND_HEADER,
	SAMPLE_TYPE_HEADER, ASTAT_CODE_HEADER, M2LAB_HEADER, ADD_ON_HEADER, DESCRIPTION_HEADER, BEDLOAD_TEXT,
	LEFT_BANK_VALUE
} from '../Constants/Dictionary';


export function getSedLOGINcompatibleXML(eventID) {
	console.log("getSedLOGINcompatibleXML");
	let sedTypes = getActiveSedimentTypes(eventID);

	if (!sedTypes || sedTypes.length === 0) {
		throw new Error("No Sediment Type has been selected in this event");
	}

	console.log('sedTypes :', sedTypes);

	let SLCXML = {"SedFF_data": {
		"SedFF_version": PROGRAM_VERSION,
		"XML_Generation_Date": new Date().toString()
	}};

	sedTypes.forEach( (sedType, index) => {
		SLCXML.SedFF_data["Event" + XML_SPLITTER + sedType]=buildSampleEventObj(eventID, sedType, index+1);

	})

	console.log('SLCXML :', SLCXML);

		var options = { compact: true, ignoreComment: true, spaces: 4 };
		var rawXML = xmljs.json2xml(SLCXML, options);

		console.log('rawXML :', rawXML);

		// strip tags of any unique identifiers back to just what was before th splitter
		let reg = new RegExp(XML_SPLITTER + "[^>]*>", "g");
		let cleanXML = rawXML.replace(reg, ">")



	// let SLCXML = sedTypes.map(sedType => {
	// 	let sedType_SLCXML = {
	// 		["SedFF" + XML_SPLITTER + sedType]: buildSampleEventObj(eventID, sedType, 1)
	// 	}

	// 	var options = { compact: true, ignoreComment: true, spaces: 4 };
	// 	var rawXML = xmljs.json2xml(sedType_SLCXML, options);

	// 	// strip tags of any unique identifiers back to just what was before th splitter
	// 	let reg = new RegExp(XML_SPLITTER + "[^>]*>", "g");
	// 	return rawXML.replace(reg, ">")


	// });

	return cleanXML;
	return SLCXML;

}


const buildSampleEventObj = (eventID, sedType, eventNum) => {
	console.log("buildSampleEventObj(", eventID, sedType, eventNum, ")");
	let SEObj = {
			"EventNumber": eventNum,
			"SiteId": getQuestionValue(eventID, 'stationNumber'),
			"AgencyCd": getQuestionValue(eventID, 'agencyCode'),
			"SedTranspMode": sedType,
			"SmplMediumCode": getQuestionValue(eventID, 'sampleMedium'),
			"AvgRepMeasures": getQuestionValue(eventID, DATA_ENTRY_INFORMATION_IDENTIFIER + IDENTIFIER_SPLITTER + sedType, 'avgRepMeasures') ? 'Y' : 'N'
	}

	let setNamesList = getSetListAsArray(eventID, sedType);

	setNamesList.forEach((setName) => {
		console.log('MAking setName :', setName);
		SEObj["Set" + XML_SPLITTER + setName] = buildSetObj(eventID, setName, sedType);
	});

	return SEObj;
}


const buildSetObj = (eventID, setName, sedType) => {
	console.log("buildSetOb(", eventID, ",", setName, ",", sedType, ")");

	let DEName = DATA_ENTRY_INFORMATION_IDENTIFIER + sedType;
	let setObj = {
		"Name": getQuestionValue(eventID, DEName, setName, 'groupOfSamples') ? "Sngl" : setName.replace(DATA_ENTRY_INFORMATION_IDENTIFIER + sedType + IDENTIFIER_SPLITTER + SET_INFORMATION_IDENTIFIER, ""),
		"NumberOfSamples": getQuestionValue(eventID, DEName, setName, "numberOfSamplingPoints"),
		"AnalyzeIndSamples": getQuestionValue(eventID, DEName, setName, "samplesComposited") ? 'N' : 'Y',
		"Analyses": stringFromMultipleChoice(getQuestionValue(eventID, DEName, setName, "analysedFor_" + sedType)),
		"NumberOfContainers": getQuestionValue(eventID, DEName, setName, "numberOfContainers"),
	}

	switch (getQuestionValue(eventID, 'samplingMethod_' + sedType)) {
		case '10':
			setObj["SetType"] = "EWI";
			break;
		case '20':
			setObj["SetType"] = "EDI";
			break;
		default:
			setObj["SetType"] = "OTHER";
			break;
	}

	//TODO: what tag does "setType" compare to


	let numOfSampleBlocks = getNumberRowsForSampleBlock(eventID, setName);
	// let numOfSampleBlocks = setObj.AnalyzeIndSamples==="Y"?setObj.NumberOfSamples:1;

	for (let i = 0; i < numOfSampleBlocks; i++) {
		setObj["Sample" + XML_SPLITTER + i] = buildSampleObj(eventID, DEName, setName, i, sedType);
	}

	return setObj;
}

const buildSampleObj = (eventID, DEName, setName, sampNum, sedType) => {
	console.log("buildSampleObj(", eventID, ",", setName, ",", sampNum, ",", sedType, ")");

	let QWDATARowNum = getQWDATARowNum(eventID, sedType, setName, sampNum);
	let QWDATATableName = QWDATA_TABLE_IDENTIFIER + sedType;
	let parametersTableName = PARAMETERS_TABLE_IDENTIFIER + sedType;

	// console.log('QWDATARowNum :', QWDATARowNum);
	// console.log("Begin Date: ", getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), SAMPLE_DATE_HEADER)));

	// console.log("QWDATA Value: ", getQuestionValue(eventID, QWDATATableName));
	// console.log("QWDATA: ADD ON: ", getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), ADD_ON_HEADER)));

	// build sample object


	let sampleObj = {
		"SampleNumber": sampNum + 1,
		"BeginDate": getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), SAMPLE_DATE_HEADER)) !== ""
			? getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), SAMPLE_DATE_HEADER))
			: getQuestionValue(eventID, "sampleDate"),
		"BeginTime": getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), SAMPLE_TIME_HEADER)),
		"TimeDatum": getQuestionValue(eventID, "timeDatum"),
		"AddOnAnalyses": stringFromMultipleChoice(getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), ADD_ON_HEADER))),
		"CollecAgency": getQuestionValue(eventID, "collectingAgency"),
		"colllectorInitials": getQuestionValue(eventID, "compiledBy"),
		"Hstat": getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), HYDROLOGIC_COND_HEADER)) !== ""
			? getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), HYDROLOGIC_COND_HEADER))
			: getQuestionValue(eventID, "hydrologicCondition"),
		"HydEvent": getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), HYDROLOGIC_EVENT_HEADER)) !== ""
			? getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), HYDROLOGIC_EVENT_HEADER))
			: getQuestionValue(eventID, "hydrologicEvent"),
		"Stype": getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), SAMPLE_TYPE_HEADER)) !== ""
			? getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), SAMPLE_TYPE_HEADER))
			: getQuestionValue(eventID, "sampleType"),
		"Astat": getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), ASTAT_CODE_HEADER)) !== ""
			? getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), ASTAT_CODE_HEADER))
			: getQuestionValue(eventID, "analysisStatus"),
		"P71999": getQuestionValue(eventID, "samplePurpose"),
		"P82398": getQuestionValue(eventID, getSamplingMethodQuestionIDString(eventID)),
		"P84164": getQuestionValue(eventID, getSamplerTypeQuestionIDString(eventID)),
		"M2Lab": getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), M2LAB_HEADER))
	}

	// build param part of sample object from the parameters table headers
	let parametersTableHeaders = getQuestionValue(eventID, parametersTableName)[0];

	let activePCodes = {};
	for (let i = 0; i < parametersTableHeaders.length; i++) {
		activePCodes[parametersTableHeaders[i].split("_")[0]] = true;  //TODO: change this splitter to a constant
	}
	let activePCodesArr = Object.keys(activePCodes).filter((el) => el !== DESCRIPTION_HEADER);
	console.log('activePCodesArr :', activePCodesArr);

	activePCodesArr.forEach((pCode, index) => {
		sampleObj["Param" + XML_SPLITTER + index] = buildParamTableParamObj(eventID, parametersTableName, QWDATATableName, QWDATARowNum, pCode);
	});

	//get remaining sample info
	let samplingMethodValue = getQuestionValue(eventID, "samplingMethod_" + sedType);
	let samplesTableName = "samplesTable_" + getMethodCategoryFromValue(samplingMethodValue) + "_" + sedType;
	let samplesTable = getQuestionValue(eventID, DEName, setName, samplesTableName);
	let distanceHeaderText = "Distance from " +getQuestionValue(eventID, "bank").startsWith(LEFT_BANK_VALUE)?"L":"R" + " bank, feet";
	let transitHeaderText = "Transit Rate, ft / sec";
	let restTimeHeaderText = "Rest time on Bed for Bed load sample, seconds";
	let horizWidthHeaderText = "Horizontal width of Vertical, feet"

	// REMOVED per KASKACH request that this be a param block instead of a sample-level item.
	//  "Average Gage Height", if calculated, should be written to P00065.
	//  If they DON'T fill in Start and End Gage Ht, they should be able to enter Average Gage Ht P00065 by hand.  
	// QWDATA can also accept this if left blank.
	// sampleObj["Param" + curParamNum++] = this.buildParamObj("P00065", this.getQuestionValue("set" + setName + "_AvgGageHeight"));

	//  - the "number of Sampling Points" should be written to P00063.  This will be left blank for 'Groups' of samples.


	if (!getQuestionValue(eventID, DEName, setName, "groupOfSamples")) {
		let p00063val = getQuestionValue(eventID, DEName, setName, "numberOfSamplingPoints");
		sampleObj["Param" + XML_SPLITTER +  "P00063"] = buildParamObj("P00063", p00063val);
	}


	//  - the Distance from L Bank should be written to P00009.  (distance from Right bank is P00001)
	let colNum = getColumnNumberFromTableHeader(samplesTable, distanceHeaderText);
	sampleObj["Param" + XML_SPLITTER +  "P00009"] = buildParamObj("P00009", getQuestionValue(eventID, DEName, setName, samplesTableName, sampNum + 1, colNum));   //TODO: Distance from either bank.  Perhaps run the distance as a switchable string (switch via settings? - save to station?)?

	//  - Transit rate, sampler, feet per second  should be written to P50015.
	colNum = getColumnNumberFromTableHeader(samplesTable, transitHeaderText);
	sampleObj["Param" + XML_SPLITTER +  "P50015"] = buildParamObj("P50015", getQuestionValue(eventID, DEName, setName, samplesTableName, sampNum + 1, colNum));   //TODO: Distance from either bank.  Perhaps run the distance as a switchable string (switch via settings? - save to station?)?

	//  - Start Time should be written to P82073, 
	//  - End Time should be written to P82074.  
	//  These should be written in 24-hour military time, with NO colon between the hour & minutes.
	sampleObj["Param" + XML_SPLITTER +  "P82073"] = buildParamObj("P82073", getQuestionValue(eventID, DEName, setName, "startTime").replace(":", ""));
	sampleObj["Param" + XML_SPLITTER +  "P82074"] = buildParamObj("P82074", getQuestionValue(eventID, DEName, setName, "endTime").replace(":", ""));


	// - the "Stream Width", if calculated, should be written to P00004.  
	try {
		let streamWidth = Math.abs(getQuestionValue(eventID, "streamWidth"));
		if (streamWidth !== 0) {
			sampleObj["Param" + XML_SPLITTER + "P00004"] = buildParamObj("P00004", streamWidth);
		}
	} catch (e) {
		console.warn("Stream Width not added to XML", e);
	}


	// let qv = getQuestionValue(eventID, DEName, setName, samplesTableName, sampNum + 1, colNum);
	// console.log("P50015");
	// console.log('samplesTable :', samplesTable);
	// console.log('colNum :', colNum);


	// - - Mean Depth of Stream (00064), 
	sampleObj["Param" + XML_SPLITTER  + "P00064"] = buildParamObj("P00064", getQuestionValue(eventID, "meanStreamDepth"));

	// - - Stream Velocity (00055)
	sampleObj["Param" + XML_SPLITTER  + "P00055"] = buildParamObj("P00055", getQuestionValue(eventID, "streamVelocity"));


	// // IET testing
	// - - Stream Velocity (ft) - - should be written to P72196
	sampleObj["Param" + XML_SPLITTER  + "P72196"] = buildParamObj("P72196", getQuestionValue(eventID, DEName, "streamVelocity_IET"));
	// - - Seconds Sampler collected water - - should be written to P72217
	sampleObj["Param" + XML_SPLITTER + "P72217"] = buildParamObj("P72217", getQuestionValue(eventID, DEName, "duration_IET"));
	// - - Sample Volume for Test (mL) - - should be written to P72218
	sampleObj["Param" + XML_SPLITTER  + "P72218"] = buildParamObj("P72218", getQuestionValue(eventID, DEName, "sampleVolume_IET"));
	// - - Nozzle Material - - should be written to P72219
	sampleObj["Param" + XML_SPLITTER  + "P72219"] = buildParamObj("P72219", getQuestionValue(eventID, DEName, "nozzleMaterial_IET"));
	// - - Nozzle Diameter - - should be written to P72220
	sampleObj["Param" + XML_SPLITTER  + "P72220"] = buildParamObj("P72220", getQuestionValue(eventID, DEName, "nozzleDiameter_IET"));



	// for Bedload samples only:  
	if (sedType === BEDLOAD_TEXT) {
		//  - - Bag Mesh Size, in mm - - should be P30333.
		sampleObj["Param" + XML_SPLITTER  + "P30333"] = buildParamObj("P30333", getQuestionValue(eventID, DEName, "bagMesh"));

		//  - - Tether Line Used - -  should be P04117.
		sampleObj["Param" + XML_SPLITTER  + "P04117"] = buildParamObj("P04117", getQuestionValue(eventID, DEName, "tetherLine") ? 1 : 0);

		//  - - Composited samples in cross sectional bedload measurement, a number - - should be P04118.
		sampleObj["Param" + XML_SPLITTER  + "P04118"] = buildParamObj("P04118", getQuestionValue(eventID, DEName, "compositeSamplesInCrossSection"));

		//  - - Verticals in composite sample, a number - - should be P04119. 
		sampleObj["Param" + XML_SPLITTER  + "P04119"] = buildParamObj("P04119", getQuestionValue(eventID, DEName, "verticalsInComposite"));

		//  - - Rest time on Bed (for Bed load sample), seconds - - should be P04120.
		colNum = getColumnNumberFromTableHeader(samplesTable, restTimeHeaderText);
		sampleObj["Param" + XML_SPLITTER  + "P04120"] = buildParamObj("P04120", getQuestionValue(eventID, DEName, setName, samplesTableName, sampNum + 1, colNum));

		// //  - - Horizontal width of Vertical (for Bed load sample), feet - - should be P04121
		colNum = getColumnNumberFromTableHeader(samplesTable, horizWidthHeaderText);
		sampleObj["Param" + XML_SPLITTER  + "P04121"] = buildParamObj("P04121", getQuestionValue(eventID, DEName, setName, samplesTableName, sampNum + 1, colNum));
	}


	return sampleObj;
}

const buildParamTableParamObj = (eventID, parametersTableName, QWDATATableName, QWDATARowNum, pCode) => {
	console.log("buildParametersTableParamObj(", eventID, parametersTableName, QWDATARowNum, pCode, ")");
	let paramObj = {
		"Name": pCode,
		"Value": getQuestionValue(eventID, parametersTableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, parametersTableName), pCode + "_val")),
		"Rmrk": getQuestionValue(eventID, parametersTableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, parametersTableName), pCode + "_rmk")),
		"NullQlfr": getQuestionValue(eventID, parametersTableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, parametersTableName), pCode + "_nq")),
		"Method": getQuestionValue(eventID, parametersTableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, parametersTableName), pCode + "_mth")),
		"M2Lab": getQuestionValue(eventID, QWDATATableName, QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, QWDATATableName), M2LAB_HEADER))
	}
	return paramObj;
}

const buildParamObj = (pCode, value) => {
	let paramObj = {
		"Name": pCode,
		"Value": value
	}
	return paramObj;
}












// export const insertNode = (questionsData, changeHandler, _globalState, questionsValues) => {
// 	// creates one question component for every question in questionsData
// 	// overwrites questionsData value with passed in value in questionsValues
// 	let questionComponents = [];
// 	//console.log(questionsValues);
// 	if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
// 		questionComponents = questionsData.map(questionData => {

// 			let value = questionData.value;
// 			//console.log("Value from questionData: ", value);
// 			if (questionsValues) {
// 				//	console.log("questionsData.id: ", questionData.id);
// 				value = questionsValues[questionData.id]
// 				//console.log("Value from questionVALUES: ", value);
// 			}

// 			return <Question {...questionData} value={value} questionsValues={questionsValues} stateChangeHandler={changeHandler} globalState={_globalState} />
// 		});
// 	}

// 	return questionComponents;
// }


/////////  UTILS for XML creation //////////////  TODO: cleanup?

const getNumberRowsForSampleBlock = (eventID, setName) => {
	let ai = !getQuestionValue(eventID, setName.split(IDENTIFIER_SPLITTER)[0], setName, "samplesComposited");
	return ai ? getQuestionValue(eventID, setName.split(IDENTIFIER_SPLITTER)[0], setName, "numberOfSamplingPoints") : 1;  // if analyize individually, then we'll check each sample... otherwise, just the one
}


const stringFromMultipleChoice = (MCObj) => {
	if (MCObj) {
		return Object.keys(MCObj).filter((key) => MCObj[key]).join(",");
	} else {
		return "";
	}
}


const getSamplingMethodQuestionIDString = (eventID) => {
	let samplingMethodQuestionIDString = "samplingMethod";
	switch (getQuestionValue(eventID, "sedimentType")) {  //TODO: this needn't be a conditional...
		case 'bedload':
			samplingMethodQuestionIDString += "_bedload";
			break;
		case 'bottom':
			samplingMethodQuestionIDString += "_bottom";
			break;
		default: //suspended
			samplingMethodQuestionIDString += "_suspended";
			break;
	}
	return samplingMethodQuestionIDString;
}

const getSamplerTypeQuestionIDString = (eventID) => { // yes, this and the one below should be combined somehow
	let samplTypeQuestionIDString = "samplerType";
	switch (getQuestionValue(eventID, "sedimentType")) {  //TODO: this needn't be a conditional...
		case 'bedload':
			samplTypeQuestionIDString += "_bedload";
			break;
		case 'bottom':
			samplTypeQuestionIDString += "_bottom";
			break;
		default: //suspended
			samplTypeQuestionIDString += "_suspended";
			break;
	}
	return samplTypeQuestionIDString;
}

// get total number of samples before this one to know what row we are looking at in QWDATA table
const getQWDATARowNum = (eventID, sedType, setName, sampNum) => {  //note, this is also the parameters table row num
	let setList = getSetListAsArray(eventID, sedType);
	let totalNumberOfSamplesInPreviousSets = 0;
	for (let i = 0; i < setList.length; i++) {
		if (setList[i] === setName) {
			totalNumberOfSamplesInPreviousSets += parseInt(sampNum);
			break;
		}
		totalNumberOfSamplesInPreviousSets += parseInt(getNumberRowsForSampleBlock(eventID, setList[i]));
	}
	return totalNumberOfSamplesInPreviousSets + 1; //plus one to move past header
}
