import React from 'react'; //lets me use JSX
import Question from '../Components/Question';
import xmljs from 'xml-js';
import { PROGRAM_VERSION } from '../Constants/Config';
import { getQuestionValue } from './QuestionUtilities';
import { getSetListAsArray } from './StoreUtilities';
import {
	SET_INFORMATION_IDENTIFIER,
} from '../Constants/Config';

import {
	SAMPLE_TIME_HEADER, SAMPLE_DATE_HEADER, HYDROLOGIC_EVENT_HEADER, HYDROLOGIC_COND_HEADER,
	SAMPLE_TYPE_HEADER, ASTAT_CODE_HEADER, M2LAB_HEADER, ADD_ON_HEADER, DESCRIPTION_HEADER
} from '../Constants/Dictionary';


export function getSedLOGINcompatibleXML(eventID) {
	let SLCXML = {
		"SedWE_data": buildSampleEventtObj(eventID)
	}

	var options = { compact: true, ignoreComment: true, spaces: 4 };
	var result = xmljs.json2xml(SLCXML, options);

	// remove numbers from "set"
	var reg = /<Set\d+/g;
	let cleanXML = result.replace(reg, "<Set")
	reg = /<\/Set\d+/g;
	cleanXML = cleanXML.replace(reg, "</Set")

	// remove numbers from "sample"
	reg = /<Sample\d+/g;
	cleanXML = cleanXML.replace(reg, "<Sample")
	reg = /<\/Sample\d+/g;
	cleanXML = cleanXML.replace(reg, "</Sample")

	// remove numbers from "param"
	reg = /<Param\d+/g;
	cleanXML = cleanXML.replace(reg, "<Param")
	reg = /<\/Param\d+/g;
	cleanXML = cleanXML.replace(reg, "</Param")

	return cleanXML;
}


const getColumnNumberFromTableHeader = (tableValue, headerToSearchFor) => {
	// console.log('getColNum :', tableValue, headerToSearchFor);
	let ret = -1;
	tableValue[0].forEach((header, index) => {
		if (headerToSearchFor === header) {
			ret = index;
		}
	});
	return ret;
}

// buildParamTableParamObj(QWDATARowNum, pCode) {
// 	let paramObj = {
// 		"Name": pCode,
// 		"Value": this.getTableQuestionValue("parametersTable", pCode + "_val", QWDATARowNum),
// 		"Rmrk": this.getTableQuestionValue("parametersTable", pCode + "_rmk", QWDATARowNum),
// 		"NullQlfr": this.getTableQuestionValue("parametersTable", pCode + "_nq", QWDATARowNum),
// 		"Method": this.getTableQuestionValue("parametersTable", pCode + "_mth", QWDATARowNum),
// 	}
// 	return paramObj;
// }

// buildParamObj(pCode, value) {
// 	let paramObj = {
// 		"Name": pCode,
// 		"Value": value
// 	}
// 	return paramObj;
// }

// get total number of samples before this one to know what row we are looking at in QWDATA table
const getQWDATARowNum = (eventID, setName, sampNum) => {  //note, this is also the parameters table row num
	let setList = getSetListAsArray(eventID);  // FIXME: will this always return the right order?
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


const buildSampleObj = (eventID, setName, sampNum) => {
	console.log("buildSampleObj(", eventID, ",", setName, ",", sampNum, ")");

	let QWDATARowNum = getQWDATARowNum(eventID, setName, sampNum);

	console.log('QWDATARowNum :', QWDATARowNum);
	// console.log("Begin Date: ", getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), SAMPLE_DATE_HEADER)));

	console.log("QWDATA Value: ", getQuestionValue(eventID, "QWDATATable"));
	console.log("QWDATA: ADD ON: ", getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), ADD_ON_HEADER)));

	// build sample object
	let sampleObj = {
		"SampleNumber": sampNum + 1,
		"BeginDate": getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), SAMPLE_DATE_HEADER)) !== ""
			? getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), SAMPLE_DATE_HEADER))
			: getQuestionValue(eventID, "sampleDate"),
		"BeginTime": getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), SAMPLE_TIME_HEADER)),
		"TimeDatum": getQuestionValue(eventID, "timeDatum"),
		"AddOnAnalyses": stringFromMultipleChoice(getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), ADD_ON_HEADER))),
		"CollecAgency": getQuestionValue(eventID, "collectingAgency"),
		"colllectorInitials": getQuestionValue(eventID, "compiledBy"),

		"Hstat": getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), HYDROLOGIC_COND_HEADER)) !== ""
			? getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), HYDROLOGIC_COND_HEADER))
			: getQuestionValue(eventID, "hydrologicCondition"),
		"HydEvent": getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), HYDROLOGIC_EVENT_HEADER)) !== ""
			? getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), HYDROLOGIC_EVENT_HEADER))
			: getQuestionValue(eventID, "hydrologicEvent"),
		"Stype": getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), SAMPLE_TYPE_HEADER)) !== ""
			? getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), SAMPLE_TYPE_HEADER))
			: getQuestionValue(eventID, "sampleType"),
		"Astat": getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), ASTAT_CODE_HEADER)) !== ""
			? getQuestionValue(eventID, "QWDATATable", QWDATARowNum, getColumnNumberFromTableHeader(getQuestionValue(eventID, "QWDATATable"), ASTAT_CODE_HEADER))
			: getQuestionValue(eventID, "analysisStatus"),

		// "P71999": getQuestionValue("samplePurpose"),
		// "P82398": getQuestionValue(this.getSamplingMethodQuestionIDString()),
		// "P84164": getQuestionValue(this.getSamplerTypeQuestionIDString()),
		// "M2Lab": getQuestionValue(eventID, "QWDATATable", QWDATARowNum, M2LAB_COLUMN_NUM)
	}

	// // build param part of sample object from the parameters table headers
	// let parametersTableHeaders = this.getQuestionValue("parametersTable")[0];
	// if (parametersTableHeaders === null | parametersTableHeaders.length < 4) { // there was no parameters table info or headers
	// 	return sampleObj;  //FIXME: This should either alert or not return... there are other params now.
	// }

	// let activePCodes = {};
	// for (let i = 0; i < parametersTableHeaders.length; i++) {
	// 	activePCodes[parametersTableHeaders[i].split("_")[0]] = true;
	// }
	// let activePCodesArr = Object.keys(activePCodes).filter((el) => el !== "Set-Sample @ Dist");

	// for (let i = 0; i < activePCodesArr.length; i++) {
	// 	sampleObj["Param" + i] = this.buildParamTableParamObj(QWDATARowNum, activePCodesArr[i]);
	// }



	// //build the param part of the sample object from the pCodes not in the parameters page
	// let curParamNum = activePCodesArr.length;

	// // REMOVED per KASKACH request that this be a param block instead of a sample-level item.
	// //  "Average Gage Height", if calculated, should be written to P00065.
	// //  If they DON'T fill in Start and End Gage Ht, they should be able to enter Average Gage Ht P00065 by hand.  
	// // QWDATA can also accept this if left blank.
	// // sampleObj["Param" + curParamNum++] = this.buildParamObj("P00065", this.getQuestionValue("set" + setName + "_AvgGageHeight"));

	// //  - the "Sampling Points" should be written to P00063.  This will be left blank for 'Groups' of samples.
	// if (!this.getQuestionValue("groupOfSamples")) {
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P00063", this.getQuestionValue("set" + setName + "_numberOfSamplingPoints"));
	// }

	// //  - the Distance from L Bank should be written to P00009.
	// sampleObj["Param" + curParamNum++] = this.buildParamObj("P00009", this.getTableQuestionValue("set" + setName + "_samplesTable_" + this.getCurrentSampleEventMethod(), "Distance from L bank, feet", sampNum + 1));

	// //  - Transit rate, sampler, feet per second  should be written to P50015.
	// sampleObj["Param" + curParamNum++] = this.buildParamObj("P50015", this.getTableQuestionValue("set" + setName + "_samplesTable_" + this.getCurrentSampleEventMethod(), "Transit Rate, ft/sec", sampNum + 1));

	// //  - Start Time should be written to P82073, 
	// //  - End Time should be written to P82074.  
	// //  These should be written in 24-hour military time, with NO colon between the hour & minutes.
	// sampleObj["Param" + curParamNum++] = this.buildParamObj("P82073", this.getQuestionValue("set" + setName + "_StartTime").replace(":", ""));
	// sampleObj["Param" + curParamNum++] = this.buildParamObj("P82074", this.getQuestionValue("set" + setName + "_EndTime").replace(":", ""));

	// // - the "Stream Width", if calculated, should be written to P00004.  
	// // TODO: If they DON'T fill in Waterway Info, they should be able to enter Stream Width P00004 by hand.  QWDATA can also accept this if left blank.
	// //	try {
	// let streamWidth = Math.abs(this.getQuestionValue("streamWidth"));
	// if (streamWidth !== 0) {
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P00004", streamWidth);
	// }

	// // } catch (e) {
	// // 	console.warn("Stream Width not added to XML");
	// // }


	// // - - Mean Depth of Stream (00064), 
	// sampleObj["Param" + curParamNum++] = this.buildParamObj("P00064", this.getQuestionValue("meanStreamDepth"));

	// // - - Stream Velocity (00055)
	// sampleObj["Param" + curParamNum++] = this.buildParamObj("P00055", this.getQuestionValue("streamVelocity"));


	// // IET testing
	// // - - Stream Velocity (ft) - - should be written to P72196
	// sampleObj["Param" + curParamNum++] = this.buildParamObj("P72196", this.getQuestionValue("streamVelocity_IET")); //TODO: stream velocity question name collision 
	// // - - Seconds Sampler collected water - - should be written to P72217
	// sampleObj["Param" + curParamNum++] = this.buildParamObj("P72217", this.getQuestionValue("duration_IET"));
	// // - - Sample Volume for Test (mL) - - should be written to P72218
	// sampleObj["Param" + curParamNum++] = this.buildParamObj("P72218", this.getQuestionValue("sampleVolume_IET"));
	// // - - Nozzle Material - - should be written to P72219
	// sampleObj["Param" + curParamNum++] = this.buildParamObj("P72219", this.getQuestionValue("nozzleMaterial_IET"));
	// // - - Nozzle Diameter - - should be written to P72220
	// sampleObj["Param" + curParamNum++] = this.buildParamObj("P72220", this.getQuestionValue("nozzleDiameter_IET"));



	// // for Bedload samples only:  
	// if (this.getQuestionValue("sedimentType") === "bedload") {
	// 	//  - - Bag Mesh Size, in mm - - should be P30333.
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P30333", this.getQuestionValue("bagMesh"));

	// 	//  - - Tether Line Used - -  should be P04117.
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P04117", this.getQuestionValue("tetherLine") ? 1 : 0);

	// 	//  - - Composited samples in cross sectional bedload measurement, a number - - should be P04118.
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P04118", this.getQuestionValue("compositeSamplesInCrossSection"));

	// 	//  - - Verticals in composite sample, a number - - should be P04119. 
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P04119", this.getQuestionValue("verticalsInComposite"));

	// 	//  - - Rest time on Bed (for Bed load sample), seconds - - should be P04120.
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P04120", this.getTableQuestionValue("set" + setName + "_samplesTable_" + this.getCurrentSampleEventMethod(), "Rest time on Bed for Bed load sample, seconds", sampNum + 1));//TODO: test

	// 	//  - - Horizontal width of Vertical (for Bed load sample), feet - - should be P04121
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P04121", this.getTableQuestionValue("set" + setName + "_samplesTable_" + this.getCurrentSampleEventMethod(), "Horizontal width of Vertical, feet", sampNum + 1)); //TODO: test
	// }

	return sampleObj;
}

const getNumberRowsForSampleBlock = (eventID, setName) => {
	let ai = !getQuestionValue(eventID, setName, "samplesComposited");
	return ai ? getQuestionValue(eventID, setName, "numberOfSamplingPoints") : 1;  // if analyize individually, then we'll check each sample... otherwise, just the one
}


const stringFromMultipleChoice = (MCObj) => {
	if (MCObj) {
		return Object.keys(MCObj).filter((key) => MCObj[key]).join(",");
	} else {
		return "";
	}
}


const buildSetObj = (eventID, setName) => {
	console.log("buildSetOb(", eventID, ",", setName, ")");


	let setObj = {
		"Name": getQuestionValue(eventID, setName, 'groupOfSamples') ? "Sngl" : setName.replace(SET_INFORMATION_IDENTIFIER, ""),
		"NumberOfSamples": getQuestionValue(eventID, setName, "numberOfSamplingPoints"),
		"AnalyzeIndSamples": getQuestionValue(eventID, setName, "samplesComposited") ? 'N' : 'Y',
		"Analyses": stringFromMultipleChoice(getQuestionValue(eventID, setName, "analysedFor_" + getQuestionValue(eventID, "sedimentType"))),
		// "NumberOfContainers" : getQuestionValue(eventID, setName, "numberOfSamplingPoints"),
	}

	switch (getQuestionValue(eventID, setName, 'samplingMethod')) {
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

	let numOfSampleBlocks = getNumberRowsForSampleBlock(eventID, setName);

	for (let i = 0; i < numOfSampleBlocks; i++) {
		setObj["Sample" + i] = buildSampleObj(eventID, setName, i);
	}

	return setObj;
}

const buildSampleEventtObj = (eventID) => {
	let SEObj = {
		"SedFF_version": PROGRAM_VERSION,
		"Event": {
			"EventNumber": 1,
			"SiteId": getQuestionValue(eventID, 'stationNumber'),
			"AgencyCd": getQuestionValue(eventID, 'agencyCode'),
			"SedTranspMode": getQuestionValue(eventID, 'sedimentType'),
			"SmplMediumCode": getQuestionValue(eventID, 'sampleMedium'),
			"AvgRepMeasures": getQuestionValue(eventID, 'avgRepMeasures') ? 'Y' : 'N'
		}
	}

	let setNamesList = getSetListAsArray(eventID);

	setNamesList.forEach((setName) => {
		SEObj.Event[setName] = buildSetObj(eventID, setName);
	});

	return SEObj;
}

export const insertNode = (questionsData, changeHandler, _globalState, questionsValues) => {
	// creates one question component for every question in questionsData
	// overwrites questionsData value with passed in value in questionsValues
	let questionComponents = [];
	//console.log(questionsValues);
	if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
		questionComponents = questionsData.map(questionData => {

			let value = questionData.value;
			//console.log("Value from questionData: ", value);
			if (questionsValues) {
				//	console.log("questionsData.id: ", questionData.id);
				value = questionsValues[questionData.id]
				//console.log("Value from questionVALUES: ", value);
			}

			return <Question {...questionData} value={value} questionsValues={questionsValues} stateChangeHandler={changeHandler} globalState={_globalState} />
		});
	}

	return questionComponents;
}