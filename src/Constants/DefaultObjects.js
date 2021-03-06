import {
	ANALYSE_TEXT_SF,
	ANALYSE_TEXT_SA,
	ANALYSE_TEXT_LOI,
	ANALYSE_TEXT_Z,
	ANALYSE_TEXT_FO,
	ANALYSE_TEXT_BD,
	ANALYSE_TEXT_C,
	ANALYSE_TEXT_T,
	ANALYSE_TEXT_DS,
	ANALYSE_TEXT_SC,
	NOT_SAMPLED,
	SUSPENDED_TEXT,
	BEDLOAD_TEXT,
	BOTTOM_MATERIAL_TEXT,
	LEFT_BANK_VALUE,
	RIGHT_BANK_VALUE
} from './Dictionary';

import { DATA_ENTRY_INFORMATION_IDENTIFIER, QWDATA_TABLE_IDENTIFIER, PARAMETERS_TABLE_IDENTIFIER, DEFAULT_BACKUP_INTERVAL } from './Config';

export const emptySamplingEvent = {
	eventID: "",
	eventName: "",
	dateModified: "",
	shippedStatus: "Not Shipped",
	questionsValues: {
		// waterwayInfo:{}
	},
	questionsData: {
	}
}

export const emptyUser = {
	username: "",
	sedLoginUsername: "",
	settings: {
		backupInterval: DEFAULT_BACKUP_INTERVAL,
		outlineQuestions: true,
		questionsData: {}
	}
}


export const defaultSetInformationQuestionsData = {
	startTime: {
		"id": "startTime",
		"label": "Start Time",
		"type": "TimeInput",
		"value": "",
		"width_xs": 5,
		"width_lg": 2
	},

	endTime: {
		"id": "endTime",
		"label": "End Time",
		"type": "TimeInput",
		"value": "",
		"width_xs": 5,
		"width_lg": 2
	},

	startGageHeight: {
		"id": "startGageHeight",
		"label": "Start Gage Ht",
		"placeholder": "feet",
		"type": "Text",
		"value": "",
		"width_xs": 3,
		"width_lg": 2
	},

	endGageHeight: {
		"id": "endGageHeight",
		"label": "End Gage Ht",
		"placeholder": "feet",
		"type": "Text",
		"value": "",
		"width_xs": 3,
		"width_lg": 2
	},

	// avgGageHeight: {
	// 	"id": "avgGageHeight",
	// 	"label": "Avg Gage Ht",
	// 	"tabName": "DataEntry",
	// 	"layoutGroup": "Set A Information",
	// 	"type": "ComputedValue",
	// 	"computationString": "(setA_StartGageHeight+setA_EndGageHeight)/2",
	// 	"value": "",
	// 	"width_xs": 4,
	// 	"width_lg": 2
	// },

	numberOfSamplingPoints: {
		"id": "numberOfSamplingPoints",
		"value": "",
		"label": "Sampling Points",
		"type": "Text",
		"placeholder": "Number of Points",
		"width_xs": 3,
		"width_lg": 3,
		// "actions":
		// 	{ "anyValue": "ShowTab::QWDATA" }
	},

	numberOfContainers: {
		"id": "numberOfContainers",
		"label": "Number Of Containers",
		"type": "Text",
		"value": "",
		"width_xs": 3,
		"width_lg": 4
	},

	samplesComposited: {
		"id": "samplesComposited",
		"label": "Samples Composited",
		"XMLTag": "AnalyzeIndSamples",
		"type": "Toggle",
		"checkbox": true,
		"value": false,
		"width_xs": 4,
		"width_lg": 3
	},

	groupOfSamples: {
		"id": "groupOfSamples",
		"label": "This is a group of samples",
		"type": "Toggle",
		"checkbox": true,
		"value": false,
		"width_xs": 4,
		"width_lg": 3,
	},

	["samplesTable_EDI_" + BEDLOAD_TEXT]: {
		"id": "samplesTable_EDI",
		"label": "Samples Table",
		"type": "TableInput",
		// "hidden": true,
		"colHeaders": true,
		"rowHeaders": true,
		"invalidMessage": "Must input number of samples before table will display",
		"value": [
			["% from bank",
				"Distance from L bank, feet",
				"Sampling Depth, feet",
				"Transit Rate, ft / sec",
				"Rest time on Bed for Bedload sample,seconds",
				"Horizontal width of Vertical, feet"],
			["", "", "", "", "", ""]
		],
		"width_xs": 10,
		"width_lg": 10
	},

	["samplesTable_EWI_" + BEDLOAD_TEXT]: {
		"id": "samplesTable_EWI",
		"label": "Samples Table",
		"type": "TableInput",
		// "hidden": true,
		"colHeaders": true,
		"rowHeaders": false,

		"value": [["Distance from L bank, feet",
			"Sampling Depth, feet",
			"Transit Rate, ft / sec",
			"Rest time on Bed for Bedload sample, seconds",
			"Horizontal width of Vertical, feet"],
		["",
			"",
			"",
			"",
			""]],
		"width_xs": 10,
		"width_lg": 10
	},

	["samplesTable_OTHER_" + BEDLOAD_TEXT]: {
		"id": "samplesTable_OTHER",
		"label": "Samples Table",
		"type": "TableInput",
		// "hidden": true,
		"colHeaders": true,
		"rowHeaders": false,

		"value": [["Distance from L bank, feet",
			"Sampling Depth, feet",
			"Transit Rate, ft / sec",
			"Rest time on Bed for Bed load sample, seconds",
			"Horizontal width of Vertical, feet"],
		["",
			"",
			"",
			"",
			""]],
		"width_xs": 10,
		"width_lg": 10
	},
	["samplesTable_EDI_" + BOTTOM_MATERIAL_TEXT]: {
		"id": "samplesTable_EDI",
		"label": "Samples Table",
		"type": "TableInput",
		// "hidden": true,
		"colHeaders": true,
		"rowHeaders": true,
		"invalidMessage": "Must input number of samples before table will display",
		"value": [
			["% from bank",
			"Distance from L bank, feet",
				"Sampling Depth, feet",
				"Transit Rate, ft / sec"],
			["", "", "", ""]
		],
		"width_xs": 10,
		"width_lg": 10
	},

	["samplesTable_EWI_" + BOTTOM_MATERIAL_TEXT]: {
		"id": "samplesTable_EWI",
		"label": "Samples Table",
		"type": "TableInput",
		// "hidden": true,
		"colHeaders": true,
		"rowHeaders": false,

		"value": [["Distance from L bank, feet",
			"Sampling Depth, feet",
			"Transit Rate, ft / sec"],
		["", "", ""]],
		"width_xs": 10,
		"width_lg": 10
	},

	["samplesTable_OTHER_" + BOTTOM_MATERIAL_TEXT]: {
		"id": "samplesTable_OTHER",
		"label": "Samples Table",
		"type": "TableInput",
		// "hidden": true,
		"colHeaders": true,
		"rowHeaders": false,

		"value": [["Distance from L bank, feet",
			"Sampling Depth, feet",
			"Transit Rate, ft / sec"],
		["", "", ""]],
		"width_xs": 10,
		"width_lg": 10
	},
	["samplesTable_EDI_" + SUSPENDED_TEXT]: {
		"id": "samplesTable_EDI",
		"label": "Samples Table",
		"type": "TableInput",
		// "hidden": true,
		"colHeaders": true,
		"rowHeaders": true,
		"invalidMessage": "Must input number of samples before table will display",
		"value": [
			["% from bank",
			"Distance from L bank, feet",
				"Sampling Depth, feet",
				"Transit Rate, ft / sec"],
			["", "", "", ""]
		],
		"width_xs": 10,
		"width_lg": 10
	},

	["samplesTable_EWI_" + SUSPENDED_TEXT]: {
		"id": "samplesTable_EWI",
		"label": "Samples Table",
		"type": "TableInput",
		// "hidden": true,
		"colHeaders": true,
		"rowHeaders": false,

		"value": [
			["Distance from L bank, feet",
				"Sampling Depth, feet",
				"Transit Rate, ft / sec",
			],
			["", "", ""]
		],
		"width_xs": 10,
		"width_lg": 10
	},

	["samplesTable_OTHER_" + SUSPENDED_TEXT]: {
		"id": "samplesTable_OTHER",
		"label": "Samples Table",
		"type": "TableInput",
		// "hidden": true,
		"colHeaders": true,
		"rowHeaders": false,

		"value": [["Distance from L bank, feet",
			"Sampling Depth, feet",
			"Transit Rate, ft / sec"],
		["", "", ""]
		],
		"width_xs": 10,
		"width_lg": 10
	},

	["analysedFor_" + BEDLOAD_TEXT]: {
		"id": "analysedFor_" + BEDLOAD_TEXT,
		"label": "Analyze Set/Group for",
		"XMLTag": "Analyses",
		"type": "MultipleChoice",
		"options": {
			[ANALYSE_TEXT_SF]: "SF",
			[ANALYSE_TEXT_SA]: "SA",
			[ANALYSE_TEXT_LOI]: "LOI",
			[ANALYSE_TEXT_Z + '*']: "Z",
			[ANALYSE_TEXT_FO]: "FO"
		},
		"value": {
			"SF": false,
			"SA": false,
			"LOI": false,
			"Z": false,
			"FO": false
			// [ANALYSE_TEXT_SF]: false,
			// [ANALYSE_TEXT_SA]: false,
			// [ANALYSE_TEXT_LOI]: false,
			// [ANALYSE_TEXT_Z]: false,
			// [ANALYSE_TEXT_FO]: false
		},
		"width_xs": 2,
		"width_lg": 2
	},

	["analysedFor_" + BOTTOM_MATERIAL_TEXT]: {
		"id": "analysedFor_" + BOTTOM_MATERIAL_TEXT,
		"label": "Analyze Set/Group for",
		"XMLTag": "Analyses",
		"type": "MultipleChoice",
		"options":
		{
			[ANALYSE_TEXT_SF + "*"]: "SF",
			[ANALYSE_TEXT_FO]: "FO",
			[ANALYSE_TEXT_SA + "*"]: "SA",
			[ANALYSE_TEXT_LOI + "*"]: "LOI",
			[ANALYSE_TEXT_BD]: "BD",
			[ANALYSE_TEXT_Z + "*"]: "Z"
		},
		"value": {
			"SF": false,
			"FO": false,
			"SA": false,
			"LOI": false,
			"BD": false,
			"Z": false
			// [ANALYSE_TEXT_SF]: false,
			// [ANALYSE_TEXT_FO]: false,
			// [ANALYSE_TEXT_SA]: false,
			// [ANALYSE_TEXT_LOI]: false,
			// [ANALYSE_TEXT_BD]: false,
			// [ANALYSE_TEXT_Z]: false
		},
		"width_xs": 2,
		"width_lg": 2
	},

	["analysedFor_" + SUSPENDED_TEXT]: {
		"id": "analysedFor_" + SUSPENDED_TEXT,
		"label": "Analyze Set/Group for",
		"XMLTag": "Analyses",
		"type": "MultipleChoice",
		"helperText": "* possible add-on analysis for individual samples.",
		"options":
		{
			[ANALYSE_TEXT_C]: "C",
			[ANALYSE_TEXT_SF + "*"]: "SF",
			[ANALYSE_TEXT_SA + "*"]: "SA",
			[ANALYSE_TEXT_T]: "T",
			[ANALYSE_TEXT_LOI + "*"]: "LOI",
			[ANALYSE_TEXT_DS]: "DS",
			[ANALYSE_TEXT_SC]: "SC",
			[ANALYSE_TEXT_Z + "*"]: "Z"
		},
		"value": {
			'C': false,
			'SF': false,
			'SA': false,
			'T': false,
			'LOI': false,
			'DS': false,
			'SC': false,
			'Z': false
			// [ANALYSE_TEXT_C]: false,
			// [ANALYSE_TEXT_SF + "*"]: false,
			// [ANALYSE_TEXT_SA + "*"]: false,
			// [ANALYSE_TEXT_T]: false,
			// [ANALYSE_TEXT_LOI + "*"]: false,
			// [ANALYSE_TEXT_DS]: false,
			// [ANALYSE_TEXT_SC]: false,
			// [ANALYSE_TEXT_Z + "*"]: false
		},
		"width_xs": 2,
		"width_lg": 2
	}
}


export const defaultWaterwayInfoQuestionsData = {

	bank: {
		"id": "bank",
		"label": "Measure From",
		"type": "DropDown",
		"value": LEFT_BANK_VALUE,
		'options': {
			"Left Bank": LEFT_BANK_VALUE,
			"Right Bank": RIGHT_BANK_VALUE
		},
		// "tabName": "FieldForm",
		// "layoutGroup": "Waterway Info",
		"width_xs": 12,
		"width_lg": 2
	},
	edgeOfWater_Start: {
		"id": "edgeOfWater_Start",
		"label": "Start Edge Of Water",
		"type": "Text",
		"placeholder": "Feet from XYZ",
		"value": "",
		// "tabName": "FieldForm",
		// "layoutGroup": "Waterway Info",
		"width_xs": 6,
		"width_lg": 2
	},

	edgeOfSamplingZone_Start: {
		"id": "edgeOfSamplingZone_Start",
		"label": "Start Edge Of Sampling Zone",
		"type": "Text",
		"placeholder": "Feet from XYZ",
		"value": "",
		// "tabName": "FieldForm",
		// "layoutGroup": "Waterway Info",
		"width_xs": 6,
		"width_lg": 3
	},

	edgeOfSamplingZone_End: {
		"id": "edgeOfSamplingZone_End",
		"label": "End Edge Of Sampling Zone",
		"type": "Text",
		"placeholder": "Feet from XYZ",
		"value": "",
		// "tabName": "FieldForm",
		// "layoutGroup": "Waterway Info",
		"width_xs": 6,
		"width_lg": 3
	},

	edgeOfWater_End: {
		"id": "edgeOfWater_End",
		"label": "End Edge Of Water",
		"type": "Text",
		"placeholder": "Feet from XYZ",
		"value": "",
		// "tabName": "FieldForm",
		// "layoutGroup": "Waterway Info",
		"width_xs": 6,
		"width_lg": 2
	},

	// streamWidth: {
	// 	"id": "streamWidth",
	// 	"label": "Stream Width",
	// 	"XMLTag": "P00004",
	// 	"type": "ComputedValue",
	// 	"computationString": "edgeOfWater_Right-edgeOfWater_Left", //TODO:
	// 	"placeholder": "This will be calculated",
	// 	"value": "",
	// 	// "tabName": "FieldForm",
	// 	// "layoutGroup": "Waterway Info",
	// 	"width_xs": 2,
	// 	"width_lg": 2
	// },
}




export const defaultQuestionsData = {


	stationName: {
		"id": "stationName",
		"label": "Station Name",
		"type": "StationDropDown",
		"tabName": "Field Form",
		"layoutGroup": "Basic",
		"helperText": "PCodes FTW!",
		"width_xs": 6,
		"width_lg": 3,
	},

	stationNumber: {
		"id": "stationNumber",
		"label": "Station Number",
		"type": "Text",
		"tabName": "Field Form",
		"value": "",
		"layoutGroup": "Basic",
		"width_xs": 6,
		"width_lg": 3
	},

	projectName: {
		"id": "projectName",
		"label": "Project Name",
		"type": "Text",
		"tabName": "Field Form",
		"value": "",
		"layoutGroup": "Basic",
		"width_xs": 6,
		"width_lg": 3
	},

	projectID: {
		"id": "projectID",
		"label": "Project ID",
		"type": "Text",
		"tabName": "Field Form",
		"value": "",
		"layoutGroup": "Basic",
		"width_xs": 4,
		"width_lg": 2
	},

	agencyCode: {
		"id": "agencyCode",
		"label": "Agency Code",
		"type": "Text",
		"tabName": "Field Form",
		"value": "",
		"layoutGroup": "Basic",
		"width_xs": 2,
		"width_lg": 1
	},

	sampleDate: {
		"id": "sampleDate",
		"label": "Sample Date",
		"type": "DateInput",
		"tabName": "Field Form",
		"placeholder": "yyyymmdd",
		"value": null,
		"layoutGroup": "Basic",
		"width_xs": 4,
		"width_lg": 2
	},

	["samplingMethod_" + SUSPENDED_TEXT]: {
		"id": "samplingMethod_" + SUSPENDED_TEXT,
		"label": "Suspended Sediment Method",
		"XMLTag": "P82398",
		"type": "DropDown",
		"tabName": "Field Form",
		"includeBlank": false,
		"options":
		{
			[NOT_SAMPLED]: NOT_SAMPLED,
			"EQUAL WIDTH INCREMENT (EWI)": "10",
			"EQUAL WIDTH INCREMENT, NON - ISOKINETIC": "15",
			"EQUAL DISCHARGE INCREMENT (EDI)": "20",
			"TIMED SAMPLING INTERVAL": "25",
			"SINGLE VERTICAL": "30",
			"MULTIPLE VERTICALS": "40",
			"POINT SAMPLE": "50",
			"COMPOSITE - MULTIPLE POINT SAMPLES": "55",
			"WEIGHTED BOTTLE": "60",
			"GRAB SAMPLE (DIP)": "70",
			"DISCHARGE INTEGRATED, EQUAL TRANSIT RATE(ETR)": "80",
			"DISCHARGE INTEGRATED, CENTROID": "90",
			"VAN DORN SAMPLER": "100",
			"SEWAGE SAMPLER": "110",
			"VELOCITY INTEGRATED": "120",
			"SUSPSED; PUMPING - stream sample using a pumping mechanism": "900",
			"SUSPSED;SINGLE-STAGE, nozzle at fixed stage, passively fillng": "910",
			"SUSPSED; BOX-SINGLE VER, DEPTH-INT, Attached To Structure": "920",
			"SUSPSED;PARTIAL DEPTH, DEPTH integrated, part of single vert.": "930",
			"SUSPSED; PARTIAL WIDTH - DEP/WIDTH INT, part of X-section": "940",
			"THIEF SAMPLE": "4010",
			"OPEN-TOP BAILER": "4020",
			"DOUBLE-VALVE BAILER": "4025",
			"OTHER": "8010",
			"GRAB SAMPLE AT WATER-SUPPLY TAP": "8030",
			"SPIGOT (NON-WATER-SUPPLY)": "8040",
			"GRAB SAMPLE AT TAP(S) ON A DAM": "8050"
		},
		"actions":
		{
			"anyValue": "ShowTab::DataEntry",
			[NOT_SAMPLED]: "HideTab::DataEntry"
		},
		"value": NOT_SAMPLED,
		"layoutGroup": "Sampling Method",
		"width_xs": 4,
		"width_lg": 4
	},

	["samplingMethod_" + BEDLOAD_TEXT]: {
		"id": "samplingMethod_" + BEDLOAD_TEXT,
		"label": "Bedload Sampling Method",
		"XMLTag": "P82398",
		"type": "DropDown",
		"tabName": "Field Form",
		"includeBlank": false,
		"options":
		{
			[NOT_SAMPLED]: NOT_SAMPLED,
			"POINT SAMPLE": "50",
			"COMPOSITE - MULTIPLE POINT SAMPLES": "55",
			"BEDLOAD, SINGLE EQUAL WIDTH INCREMENT(SEWI)": "1000",
			"BEDLOAD, MULTIPLE EQUAL WIDTH INCREMENT(MEWI)": "1010",
			"BEDLOAD, UNEQUAL WIDTH INCREMENT(UWI)": "1020",
			"OTHER": "8010"
		},
		"actions":
		{
			"anyValue": "ShowTab::DataEntry",
			[NOT_SAMPLED]: "HideTab::DataEntry"
		},
		"value": NOT_SAMPLED,
		"layoutGroup": "Sampling Method",
		"width_xs": 4,
		"width_lg": 4
	},

	["samplingMethod_" + BOTTOM_MATERIAL_TEXT]: {
		"id": "samplingMethod_" + BOTTOM_MATERIAL_TEXT,
		"label": "Bottom Material Sampling Method",
		"XMLTag": "P82398",
		"type": "DropDown",
		"tabName": "Field Form",
		"includeBlank": false,
		"options":
		{
			[NOT_SAMPLED]: NOT_SAMPLED,
			"POINT SAMPLE": "50",
			"COMPOSITE - MULTIPLE POINT SAMPLES": "55",
			"SEDIMENT CORE": "5010",
			"OTHER": "8010"
		},
		"actions":
		{
			"anyValue": "ShowTab::DataEntry",
			[NOT_SAMPLED]: "HideTab::DataEntry"
		},
		"value": NOT_SAMPLED,
		"layoutGroup": "Sampling Method",
		"width_xs": 4,
		"width_lg": 4
	},

	timeDatum: {
		"id": "timeDatum",
		"label": "Time Datum",
		"XMLTag": "TimeDatum",
		"type": "DropDown",
		"tabName": "Field Form",
		"options":
		{
			"SITEFILE Default": "SITEFILE",
			"Atlantic Standard Time": "AST",
			"Atlantic Daylight Time": "ADT",
			"Eastern Standard Time": "EST",
			"Eastern Daylight Time": "EDT",
			"Central Standard Time": "CST",
			"Central Daylight Time": "CDT",
			"Mountain Standard Time": "MST",
			"Mountain Daylight Time": "MDT",
			"Pacific Standard Time": "PST",
			"Pacific Daylight Time": "PDT",
			"Alaska Standard Time": "AKST",
			"Alaska Daylight Time": "AKDT",
			"Hawaii–Aleutian Standard Time": "HST",
			"Hawaii–Aleutian Daylight Time": "HDT"
		},
		"value": "SITEFILE",
		"layoutGroup": "Basic",
		"width_xs": 4,
		"width_lg": 2
	},

	samplingTeam: {
		"id": "samplingTeam",
		"label": "Sampling Team",
		"type": "Text",
		"value": "",
		"tabName": "Field Form",
		"layoutGroup": "Basic",
		"width_xs": 5,
		"width_lg": 3
	},

	compiledBy: {
		"id": "compiledBy",
		"label": "Compiled By",
		"type": "Text",
		"value": "",
		"tabName": "Field Form",
		"layoutGroup": "Basic",
		"width_xs": 3,
		"width_lg": 1
	},

	sky: {
		"id": "sky",
		"label": "Sky",
		"type": "DropDown",
		"tabName": "Field Form",
		"includeBlank": true,
		"options":
		{
			"Clear": "Clear",
			"Partly Cloudy": "Partly Cloudy",
			"Cloudy": "Cloudy"
		},
		"value": "",
		"layoutGroup": "Weather",
		"width_xs": 4,
		"width_lg": 2
	},

	precipitation: {
		"id": "precipitation",
		"label": "Precipitation",
		"type": "DropDown",
		"tabName": "Field Form",
		"includeBlank": true,
		"options":
		{
			"No Precip": "No Precip",
			"Mist": "Mist",
			"Light Rain": "Light Rain",
			"Medium Rain": "Medium Rain",
			"Heavy Rain": "Heavy Rain",
			"Sleet": "Sleet",
			"Snow": "Snow"
		},
		"value": "",
		"layoutGroup": "Weather",
		"width_xs": 4,
		"width_lg": 2
	},

	temperature: {
		"id": "temperature",
		"label": "Temperature",
		"type": "DropDown",
		"tabName": "Field Form",
		"includeBlank": true,
		"options":
		{
			"Very Cold": "Very Cold",
			"Cold": "Cold",
			"Cool": "Cool",
			"Warm": "Warm",
			"Hot": "Hot",
			"Very Hot": "Very Hot"
		},
		"value": "",
		"layoutGroup": "Weather",
		"width_xs": 4,
		"width_lg": 2
	},

	wind: {
		"id": "wind",
		"label": "Wind",
		"type": "DropDown",
		"tabName": "Field Form",
		"includeBlank": true,
		"options":
		{
			"Calm": "Calm",
			"Light Breeze": "Light Breeze",
			"Breeze": "Breeze",
			"Gusty": "Gusty",
			"Windy": "Windy"
		},
		"value": "",
		"layoutGroup": "Weather",
		"width_xs": 4,
		"width_lg": 2
	},

	windDirection: {
		"id": "windDirection",
		"label": "Wind Direction",
		"type": "DropDown",
		"tabName": "Field Form",
		"includeBlank": true,
		"options":
		{
			"Upstream": "Upstream",
			"Downstream": "Downstream",
			"Cross-stream": "Cross-stream"
		},
		"value": "",
		"layoutGroup": "Weather",
		"width_xs": 4,
		"width_lg": 2
	},

	hydrologicEvent: {
		"id": "hydrologicEvent",
		"label": "Hydrologic Event",
		"XMLTag": "HydEvent",
		"type": "DropDown",
		"includeBlank": true,
		"options":
		{
			"1 - Drought": "1",
			"2 - Spill": "2",
			"3 - Regulated flow": "3",
			"4 - Snowmelt": "4",
			"5 - Earthquake": "5",
			"6 - Hurricane": "6",
			"7 - Flood": "7",
			"8 - Volcanic action": "8",
			"9 -Routine Sample": "9",
			"A - Spring Breakup": "A",
			"B - Under ice cover": "B",
			"C - Glacial Lake Outbreak": "C",
			"D - Mudflow": "D",
			"E - Tidal Action": "E",
			"F - Fire (basin affected)": "F",
			"H - Dambreak": "H",
			"J - Storm": "J",
			"K - Backwater": "K",
			"X - Not Applicable": "X"
		},
		"value": "",
		"tabName": "Field Form",
		"layoutGroup": "Sample Information",
		"width_xs": 4,
		"width_lg": 3
	},

	hydrologicCondition: {
		"id": "hydrologicCondition",
		"label": "Hydrologic Condition",
		"XMLTag": "Hstat",
		"type": "DropDown",
		"includeBlank": true,
		"options":
		{
			"4 - Stable, low stage": "4",
			"5 - Falling stage": "5",
			"6 - Stable, high stage": "6",
			"7 - Peak stage": "7",
			"8 - Rising stage": "8",
			"9 - Stable, normal stage": "9",
			"A - Not Determined": "A",
			"X - Not Applicable": "X"
		},
		"value": "",
		"tabName": "Field Form",
		"layoutGroup": "Sample Information",
		"width_xs": 4,
		"width_lg": 3
	},

	sampleMedium: {
		"id": "sampleMedium",
		"label": "Sample Medium",
		"XMLTag": "SmplMediumCode",
		"type": "DropDown",
		"includeBlank": true,
		"options":
		{
			"Surface Water (WS)": "WS",
			"Surface Water QC (WSQ)": "WSQ",
			"Bed Material (SB)": "SB",
			"Bed Material QC (SBQ)": "SBQ",
			"Artificial (OA)": "OA",
			"Artificial QC (OAQ)": "OAQ"
		},
		"value": "",
		"tabName": "Field Form",
		"layoutGroup": "Sample Information",
		"width_xs": 4,
		"width_lg": 3
	},

	sampleType: {
		"id": "sampleType",
		"label": "Sample Type",
		"XMLTag": "Stype",
		"type": "DropDown",
		"includeBlank": true,
		"options":
		{
			"1 - Spike": "1",
			"2 - Blank": "2",
			"3 - Reference": "3",
			"4 - Blind": "4",
			"5 - Duplicate": "5",
			"6 - Reference Material": "6",
			"7 - Replicate": "7",
			"8 - Spike Solution": "8",
			"9 - Regular": "9",
			"A - Not Determined": "A",
			"B - Other QA": "B",
			"H - Composite": "H"
		},
		"value": "",
		"tabName": "Field Form",
		"layoutGroup": "Sample Information",
		"width_xs": 4,
		"width_lg": 3
	},

	samplePurpose: {
		"id": "samplePurpose",
		"label": "Sample Purpose",
		"XMLTag": "P71999",
		"type": "DropDown",
		"includeBlank": true,
		"options":
		{
			"10 - ROUTINE": "10",
			"15 - NAWQA - NATIONAL WATER-QUALITY ASSESSMENT": "15",
			"20 - NASQAN": "20",
			"25 - NMN - National Monitoring Network": "25",
			"30 - BENCHMARK": "30",
			"35 - RASA, REGIONAL AQUIFER SYSTEMS ANALYSIS": "35",
			"40 - SW NETWORK": "40",
			"50 - GW NETWORK": "50",
			"60 - LOWFLOW NETWORK": "60",
			"70 - HIGHFLOW NETWORK": "70",
			"80 - ACID RAIN": "80",
			"80.01 - BULK OR UNDEFINED (BU)": "80.01",
			"80.02 - SAMPLE RELATED PROBLEM (NS)": "80.02",
			"80.03 - DRY WET-SIDE SAMPLE (NA)": "80.03",
			"80.04 - COMPLETELY MISSING SAMPLES (UN)": "80.04",
			"80.05 - LONG DURATION SAMPLE (LD)": "80.05",
			"80.06 - SAMPLING PROTOCOL (TIME) (SP)": "80.06",
			"80.07 - SAMPLER MALFUNCTION (S)": "80.07",
			"90 - SNOW SURVEY": "90",
			"100 - MT. ST. HELENS": "100",
			"110 - SEEPAGE STUDY": "110",
			"120 - IRRIGATION EFFECTS": "120",
			"130 - RECHARGE": "130",
			"140 - INJECTION": "140",
			"150 - BANK ERODIBILITY": "150",
			"160 - NATIONAL BLANK AND SPIKE PROGRAM": "160",
			"170 - QUALITY ASSURANCE": "170",
			"180 - CROSS-SECTION VARIATION": "180",
			"190 - GROUND-WATER/SURFACE-WATER INTERACTION STUDY": "190"
		},
		"value": "",
		"tabName": "Field Form",
		"layoutGroup": "Sample Information",
		"width_xs": 4,
		"width_lg": 3
	},

	analysisStatus: {
		"id": "analysisStatus",
		"label": "Analysis Status",
		"XMLTag": "Astat",
		"type": "DropDown",
		"includeBlank": true,
		"options":
		{
			"Unrestricted": "U",
			"Internal-use only": "I",
			"Proprietary": "P"
		},
		"value": "",
		"tabName": "Field Form",
		"layoutGroup": "Sample Information",
		"width_xs": 4,
		"width_lg": 3
	},

	meanStreamDepth: {
		"id": "meanStreamDepth",
		"label": "Mean Stream Depth (ft)",
		"type": "Text",
		"value": "",
		"tabName": "Field Form",
		"layoutGroup": "Sample Information",
		"placeholder": "P00064",
		"width_xs": 4,
		"width_lg": 3
	},

	streamVelocity: {
		"id": "streamVelocity",
		"label": "Stream Velocity (ft/s)",
		"type": "Text",
		"placeholder": "P00055",
		"value": "",
		"tabName": "Field Form",
		"layoutGroup": "Sample Information",
		"width_xs": 4,
		"width_lg": 3
	},

	streamMixing: {
		"id": "streamMixing",
		"label": "Stream Mixing",
		"type": "DropDown",
		"includeBlank": true,
		"options":
		{
			"Well Mixed": "Well Mixed",
			"Stratified": "Stratified",
			"Poorly-mixed": "Poorly-mixed",
			"Unknown": "Unknown"
		},
		"value": "",
		"tabName": "Field Form",
		"layoutGroup": "Sample Information",
		"width_xs": 4,
		"width_lg": 3
	},

	streamColor: {
		"id": "streamColor",
		"label": "Stream Color",
		"type": "DropDown",
		"includeBlank": true,
		"options":
		{
			"Brown": "Brown",
			"Green": "Green",
			"Blue": "Blue",
			"Gray": "Gray",
			"Clear": "Clear",
			"Other": "Other"
		},
		"value": "",
		"tabName": "Field Form",
		"layoutGroup": "Sample Information",
		"width_xs": 4,
		"width_lg": 3
	},

	waterwayInfo: {
		"id": "waterwayInfo",
		"type": "WaterwayInfo",
		"label": "Waterway Information",
		"value": {
			bank:LEFT_BANK_VALUE,
			edgeOfWater_Start:"",
			edgeOfWater_End:"",
			edgeOfSamplingZone_Start:"",
			edgeOfSamplingZone_End:"",
			streamWidth:"",
			piers:[]
		},
		"tabName": "FieldForm",
		"layoutGroup": "Waterway Info",
		"width_xs": 12,
		"width_lg": 12
	},

	collectingAgency: {
		"id": "collectingAgency",
		"label": "Collecting Agency",
		"XMLTag": "CollecAgency",
		"type": "DropDown",
		"tabName": "QWDATA",
		"layoutGroup": "QWDATA Info",
		"options":
		{
			"USGS-WRD": "USGS-WRD",
			"USGS-GD": "USGS-GD",
			"Observer": "Observer",
			"Other": "Other"
		},
		"actions":
		{
			"USGS-WRD": "HideQuestion::collectingAgencyOther",
			"USGS-GD": "HideQuestion::collectingAgencyOther",
			"Observer": "HideQuestion::collectingAgencyOther",
			"Other": "ShowQuestion::collectingAgencyOther"
		},
		"value": "USGS-WRD",
		"width_xs": 4,
		"width_lg": 2
	},

	collectingAgencyOther: {
		"id": "collectingAgencyOther",
		"label": "Other:",
		"XMLTag": "CollecAgencyOther",
		"hidden": true,
		"type": "Text",
		"tabName": "QWDATA",
		"value": "",
		"layoutGroup": "QWDATA Info",
		"width_xs": 4,
		"width_lg": 2
	},

	// ["samplingMethod_" + BEDLOAD_TEXT + "_QWDATA_CV"]: {
	// 	"id": "samplingMethod_" + BEDLOAD_TEXT + "_QWDATA_CV",
	// 	"label": "Sampling Method",
	// 	"type": "ComputedValue",
	// 	"tabName": "QWDATA",
	// 	"layoutGroup": "QWDATA Info",
	// 	"placeholder": "Select on Field Form page",
	// 	"computationString": "samplingMethod_" + BEDLOAD_TEXT,
	// 	"value": "",
	// 	"width_xs": 4,
	// 	"width_lg": 2
	// },

	// ["samplingMethod_" + BOTTOM_MATERIAL_TEXT + "_QWDATA_CV"]: {
	// 	"id": "samplingMethod_" + BOTTOM_MATERIAL_TEXT + "_QWDATA_CV",
	// 	"label": "Sampling Method",
	// 	"type": "ComputedValue",
	// 	"tabName": "QWDATA",
	// 	"layoutGroup": "QWDATA Info",
	// 	"placeholder": "Select on Field Form page",
	// 	"computationString": "samplingMethod_" + BOTTOM_MATERIAL_TEXT,
	// 	"value": "",
	// 	"width_xs": 4,
	// 	"width_lg": 2
	// },

	// ["samplingMethod_" + SUSPENDED_TEXT + "_QWDATA_CV"]: {
	// 	"id": "samplingMethod_" + SUSPENDED_TEXT + "_QWDATA_CV",
	// 	"label": "Sampling Method",
	// 	"type": "ComputedValue",
	// 	"tabName": "QWDATA",
	// 	"layoutGroup": "QWDATA Info",
	// 	"placeholder": "Select on Field Form page",
	// 	"computationString": "samplingMethod_" + SUSPENDED_TEXT,
	// 	"value": "",
	// 	"width_xs": 4,
	// 	"width_lg": 2
	// },

	// sampleMedium_QWDATA_CV: {
	// 	"id": "sampleMedium_QWDATA_CV",
	// 	"label": "Sample Medium",
	// 	"type": "ComputedValue",
	// 	"tabName": "QWDATA",
	// 	"layoutGroup": "QWDATA Info",
	// 	"placeholder": "Select on Field Form Page",
	// 	"computationString": "sampleMedium",
	// 	"value": "",
	// 	"width_xs": 4,
	// 	"width_lg": 2
	// },


	[DATA_ENTRY_INFORMATION_IDENTIFIER + SUSPENDED_TEXT]: {
		id: DATA_ENTRY_INFORMATION_IDENTIFIER + SUSPENDED_TEXT,
		["samplerType_" + SUSPENDED_TEXT]: {
			"id": "samplerType_" + SUSPENDED_TEXT,
			"label": "Sampler Type",
			"XMLTag": "P84164",
			"type": "DropDown",
			"hidden": false,
			"includeBlank": true,
			"options":
			{
				"100  VAN DORN SAMPLER": "100",
				"110  SEWAGE SAMPLE": "110",
				"120  VELOCITY INTEGRATED SAMPLE": "120",
				"125  KEMMERER BOTTLE": "125",
				"3001  SAMPLER, US DH-48": "3001",
				"3002  SAMPLER, US DH - 59": "3002",
				"3003  SAMPLER, US DH - 75P": "3003",
				"3004  SAMPLER, US DH-75Q": "3004",
				"3005  SAMPLER, US DH-76": "3005",
				"3006  SAMPLER, US D - 43": "3006",
				"3007  SAMPLER, US D - 49": "3007",
				"3008  SAMPLER, US D - 49AL": "3008",
				"3009  SAMPLER, US D-74": "3009",
				"3010  SAMPLER, US D - 74AL": "3010",
				"3011  SAMPLER, US D-77": "3011",
				"3012  SAMPLER, US P - 46": "3012",
				"3013  SAMPLER, US P - 50": "3013",
				"3014  SAMPLER, US P - 61 - A1": "3014",
				"3015  SAMPLER, US P - 63": "3015",
				"3016  SAMPLER, US P - 72": "3016",
				"3017  SAMPLER, US U - 59": "3017",
				"3018  SAMPLER, US U - 73": "3018",
				"3019  SAMPLER, US PS - 69": "3019",
				"3020  SAMPLER, US PS - 69TM": "3020",
				"3021  SAMPLER, US CS-77": "3021",
				"3022  SAMPLER, US PS - 82": "3022",
				"3030  US DH-48 TM": "3030",
				"3031  US DH-48 TM WITH TEFLON GASKET AND NOZZLE": "3031",
				"3032  US DH-59 TM": "3032",
				"3033  US DH-59 TM WITH TEFLON GASKET AND NOZZLE": "3033",
				"3034  US DH-76 TM": "3034",
				"3035  US DH-76 TM WITH TEFLON GASKET AND NOZZLE": "3035",
				"3036  US D-74 TM": "3036",
				"3037  US D-74 AL-TM": "3037",
				"3038  US D-74 AL-TM WITH TEFLON GASKET AND NOZZLE": "3038",
				"3039  US D-77 TM": "3039",
				"3040  US D-77 TM MODIFIED TEFLON BAG SAMPLER": "3040",
				"3041  US P-61 AL-TM": "3041",
				"3042  US P-61": "3042",
				"3043  US P-61 TM": "3043",
				"3044  US DH-81": "3044",
				"3045  US DH-81 WITH TEFLON CAP AND NOZZLE": "3045",
				"3046  SAMPLER,  D - 77 TM, WITH REYNOLDS OVEN COLLAPSIBLE BAG": "3046",
				"3047  SAMPLER, FRAME - TYPE, PLASTIC BOTTLE WITH REYNOLDS OVEN BAG": "3047",
				"3048  SAMPLER, FRAME-TYPE, TEFLON BOTTLE": "3048",
				"3049  SAMPLER, FRAME-TYPE, PLASTIC BOTTLE": "3049",
				"3050  SAMPLER, FRAME-TYPE, PLASTIC BOTTLE W/TEFLON COLLAPS. BAG": "3050",
				"3051  US DH-95 TEFLON BOTTLE": "3051",
				"3052  US DH-95 PLASTIC BOTTLE": "3052",
				"3053  US D-95 TEFLON BOTTLE": "3053",
				"3054  US D-95 PLASTIC BOTTLE": "3054",
				"3055  US D-96 BAG SAMPLER": "3055",
				"3056  US D-96-A1 BAG SAMPLER": "3056",
				"3057  US D-99 BAG SAMPLER": "3057",
				"3058  US DH-2 BAG SAMPLER": "3058",
				"3060  WEIGHTED-BOTTLE SAMPLER": "3060",
				"3061  US WBH-96 WEIGHTED-BOTTLE SAMPLER": "3061",
				"3062  US P-6,  100 lb.POINT - INTEGRATING SAMPLER, replaces P - 61 - A1": "3062",
				"3063  US P-6, 200 lb.POINT - INTEGRATING SAMPLER, replaces P - 63": "3063",
				"3070  GRAB SAMPLE": "3070",
				"3071  OPEN-MOUTH BOTTLE": "3071",
				"3080  VOC HAND SAMPLER": "3080",
				"4010  THIEF SAMPLER": "4010",
				"4020  OPEN-TOP BAILER": "4020",
				"4115  SAMPLER, POINT, AUTOMATIC": "4115",
				"8010  OTHER": "8010"
			},
			"actions":
			{
				"100": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"110": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"120": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"125": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3001": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3002": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3003": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3004": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3005": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3006": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3007": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3008": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3009": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3010": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3011": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3012": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3013": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3014": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3015": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3016": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3017": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3018": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3019": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3020": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3021": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3022": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3030": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3031": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3032": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3033": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3034": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3035": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3036": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3037": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3038": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3039": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3040": "ShowQuestion::sizeOfBag&HideQuestion::sizeOfBottle&ShowQuestion::bagMaterial&HideQuestion::bottleMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3041": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3042": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3043": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3044": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3045": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3046": "ShowQuestion::sizeOfBag&HideQuestion::sizeOfBottle&ShowQuestion::bagMaterial&HideQuestion::bottleMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3047": "ShowQuestion::sizeOfBag&HideQuestion::sizeOfBottle&ShowQuestion::bagMaterial&HideQuestion::bottleMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3048": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3049": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3050": "ShowQuestion::sizeOfBag&HideQuestion::sizeOfBottle&ShowQuestion::bagMaterial&HideQuestion::bottleMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3051": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3052": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3053": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3054": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3055": "ShowQuestion::sizeOfBag&HideQuestion::sizeOfBottle&ShowQuestion::bagMaterial&HideQuestion::bottleMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&ShowPanel::DataEntry:Intake Efficiency Test",
				"3056": "ShowQuestion::sizeOfBag&HideQuestion::sizeOfBottle&ShowQuestion::bagMaterial&HideQuestion::bottleMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&ShowPanel::DataEntry:Intake Efficiency Test",
				"3057": "ShowQuestion::sizeOfBag&HideQuestion::sizeOfBottle&ShowQuestion::bagMaterial&HideQuestion::bottleMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&ShowPanel::DataEntry:Intake Efficiency Test",
				"3058": "ShowQuestion::sizeOfBag&HideQuestion::sizeOfBottle&ShowQuestion::bagMaterial&HideQuestion::bottleMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&ShowPanel::DataEntry:Intake Efficiency Test",
				"3060": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3061": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3062": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3063": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3070": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3071": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"3080": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"4010": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"4020": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"4115": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&HideQuestion::nozzleMaterial&HideQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"8010": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 3
		},
		bottleMaterial: {
			"id": "bottleMaterial",
			"hidden": true,
			"label": "Bottle Material",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"Plastic": "Plastic",
				"Glass": "Glass",
				"Other": "Other"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 3
		},

		bagMaterial: {
			"id": "bagMaterial",
			"label": "Bag Material",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"Plastic": "Plastic",
				"Glass": "Glass",
				"Other": "Other"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 3
		},

		sizeOfBottle: {
			"id": "sizeOfBottle",
			"hidden": true,
			"label": "Size of Bottle",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"Pint": "Pint",
				"Liter": "Liter",
				"Quart": "Quart"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},

		sizeOfBag: {
			"id": "sizeOfBag",
			"label": "Size of Bag",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"1 Liter": "1 Liter",
				"3 Liter": "3 Liter"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},

		nozzleMaterial: {
			"id": "nozzleMaterial",
			"label": "Nozzle M aterial",
			"XMLTag": "P72219",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"Brass": "1",
				"Plastic": "2",
				"TFE": "3"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},

		nozzleDiameter: {
			"id": "nozzleDiameter",
			"label": "Nozzle D iameter",
			"XMLTag": "P72220",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"3/16": "3",
				"1/4": "4",
				"5/16": "5"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},

		streamDepth_IET: {
			"id": "streamDepth_IET",
			"label": "Stream Depth for Test",
			"type": "Text",
			"placeholder": "feet",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 2
		},

		transitRate: {
			"id": "transitRate",
			"label": "Transit Rate for Test",
			"type": "Text",
			"placeholder": "feet / second",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 2
		},

		streamVelocity_IET: {
			"id": "streamVelocity_IET",
			"label": "IET Stream Velocity (ft/s)",
			"XMLTag": "P72196",
			"type": "Text",
			"placeholder": "P72196",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 2
		},

		sampleVolume_IET: {
			"id": "sampleVolume_IET",
			"label": "Sample Volume for Test (mL)",
			"XMLTag": "P72218",
			"type": "Text",
			"placeholder": "P72218",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 4,
			"width_lg": 3
		},

		duration_IET: {
			"id": "duration_IET",
			"label": "Seconds sampler collected water",
			"XMLTag": "P72217",
			"type": "Text",
			"placeholder": "P72217",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 4,
			"width_lg": 3
		},

		nozzleMaterial_IET: {
			"id": "nozzleMaterial_IET",
			"label": "Nozzle Material",
			"type": "ComputedValue",
			"placeholder": "Enter value in sampler info panel",
			"computationString": [DATA_ENTRY_INFORMATION_IDENTIFIER + SUSPENDED_TEXT, "nozzleMaterial"],
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 3
		},

		nozzleDiameter_IET: {
			"id": "nozzleDiameter_IET",
			"label": "Nozzle Diameter",
			"type": "ComputedValue",
			"placeholder": "Enter value in sampler info panel",
			"computationString": [DATA_ENTRY_INFORMATION_IDENTIFIER + SUSPENDED_TEXT, "nozzleDiameter"],
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 3
		},

		ratioOfVertical: {
			"id": "ratioOfVertical",
			"label": "Ratio of Vertical",
			"type": "Text",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 3
		},

		intakeEfficiency: {
			"id": "intakeEfficiency",
			"label": "Intake Efficiency",
			"type": "Text",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 3
		},

		avgRepMeasures: {
			"id": "avgRepMeasures",
			"label": "Average Representational Measures of these sets",
			"type": "Toggle",
			"tabName": "DataEntry",
			"layoutGroup": "Average Representational Measures",
			"checkbox": true,
			"value": false,
			"width_xs": 8,
			"width_lg": 6
		}
	},

	[DATA_ENTRY_INFORMATION_IDENTIFIER + BOTTOM_MATERIAL_TEXT]: {
		id: DATA_ENTRY_INFORMATION_IDENTIFIER + BOTTOM_MATERIAL_TEXT,
		["samplerType_" + BOTTOM_MATERIAL_TEXT]: {
			"id": "samplerType_" + BOTTOM_MATERIAL_TEXT,
			"label": "Sampler Type",
			"XMLTag": "P84164",
			"type": "DropDown",
			"hidden": false,
			"includeBlank": true,
			"options":
			{
				"3023  SAMPLER, US BMH-53 ": "3023",
				"3024  SAMPLER, US BMH - 53TM": "3024",
				"3025  SAMPLER, US BM-54 ": "3025",
				"3026  SAMPLER, US BM - 54TM": "3026",
				"3027  SAMPLER, US BMH-60 ": "3027",
				"3028  SAMPLER, US BMH - 60TM": "3028",
				"3029  SAMPLER, US RBM-80 ": "3029",
				"5010  BOX CORE, LONG ": "5010",
				"5020  BOX CORE, SHORT ": "5020",
				"5030  GRAVITY CORE ": "5030",
				"5040  PISTON CORE ": "5040",
				"5050  PUSH CORE ": "5050",
				"6000  Bed Material -- Scoop Shovel": "6000",
				"6010  Bed Material -- Scoop TM (Epoxy coated metal sampler)": "6010",
				"6020  Bed Material -- Scoop Teflon": "6020",
				"6030  Bed Material -- Pipe Dredge": "6030",
				"6040  Bed Material -- Dredge-Cooper Scooper": "6040",
				"6050  Bed Material -- Ponar Grab": "6050",
				"6060  Bed Material -- Ekman Grab": "6060",
				"6070  Bed Material -- Box Core Grab": "6070",
				"6080  Bed Material -- Peterson Grab": "6080",
				"6090  Bed Material -- Van Veen Grab": "6090",
				"8010  OTHER ": "8010"
			},
			"actions":
			{
				"100": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"110": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 3
		},
		bottleMaterial: {
			"id": "bottleMaterial",
			"hidden": true,
			"label": "Bottle Material",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"Plastic": "Plastic",
				"Glass": "Glass",
				"Other": "Other"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 3
		},

		bagMaterial: {
			"id": "bagMaterial",
			"label": "Bag Material",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"Plastic": "Plastic",
				"Glass": "Glass",
				"Other": "Other"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 3
		},

		sizeOfBottle: {
			"id": "sizeOfBottle",
			"hidden": true,
			"label": "Size of Bottle",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"Pint": "Pint",
				"Liter": "Liter",
				"Quart": "Quart"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},

		sizeOfBag: {
			"id": "sizeOfBag",
			"label": "Size of Bag",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"1 Liter": "1 Liter",
				"3 Liter": "3 Liter"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},



		nozzleMaterial: {
			"id": "nozzleMaterial",
			"label": "Nozzle Material",
			"XMLTag": "P72219",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"Brass": "1",
				"Plastic": "2",
				"TFE": "3"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},

		nozzleDiameter: {
			"id": "nozzleDiameter",
			"label": "Nozzle Diameter",
			"XMLTag": "P72220",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"3/16": "3",
				"1/4": "4",
				"5/16": "5"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},

		streamDepth_IET: {
			"id": "streamDepth_IET",
			"label": "Stream Depth for Test",
			"type": "Text",
			"placeholder": "feet",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 2
		},

		transitRate: {
			"id": "transitRate",
			"label": "Transit Rate for Test",
			"type": "Text",
			"placeholder": "feet / second",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 2
		},

		streamVelocity_IET: {
			"id": "streamVelocity_IET",
			"label": "IET Stream Velocity (ft/s)",
			"XMLTag": "P72196",
			"type": "Text",
			"placeholder": "P72196",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 2
		},

		sampleVolume_IET: {
			"id": "sampleVolume_IET",
			"label": "Sample Volume for Test (mL)",
			"XMLTag": "P72218",
			"type": "Text",
			"placeholder": "P72218",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 4,
			"width_lg": 3
		},

		duration_IET: {
			"id": "duration_IET",
			"label": "Seconds sampler collected water",
			"XMLTag": "P72217",
			"type": "Text",
			"placeholder": "P72217",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test - " + BOTTOM_MATERIAL_TEXT,
			"width_xs": 4,
			"width_lg": 3
		},

		nozzleMaterial_IET: {
			"id": "nozzleMaterial_IET",
			"label": "Nozzle Material",
			"type": "ComputedValue",
			"placeholder": "Enter value in sampler info panel",
			"computationString": "nozzleMaterial",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 3
		},

		nozzleDiameter_IET: {
			"id": "nozzleDiameter_IET",
			"label": "Nozzle Diameter",
			"type": "ComputedValue",
			"placeholder": "Enter value in sampler info panel",
			"computationString": "nozzleDiameter",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 3
		},

		ratioOfVertical: {
			"id": "ratioOfVertical",
			"label": "Ratio of Vertical",
			"type": "Text",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 3
		},

		intakeEfficiency: {
			"id": "intakeEfficiency",
			"label": "Intake Efficiency",
			"type": "Text",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 3
		},

		avgRepMeasures: {
			"id": "avgRepMeasures",
			"label": "Average Representational Measures of these sets",
			"type": "Toggle",
			"tabName": "DataEntry",
			"layoutGroup": "Average Representational Measures",
			"checkbox": true,
			"value": false,
			"width_xs": 8,
			"width_lg": 6
		}
	},

	[DATA_ENTRY_INFORMATION_IDENTIFIER + BEDLOAD_TEXT]: {
		id: DATA_ENTRY_INFORMATION_IDENTIFIER + BEDLOAD_TEXT,
		["samplerType_" + BEDLOAD_TEXT]: {
			"id": "samplerType_" + BEDLOAD_TEXT,
			"label": "Sampler Type",
			"XMLTag": "P84164",
			"type": "DropDown",
			"hidden": false,
			"includeBlank": true,
			"options":
			{
				"1050  BL-6X12 in, Toutle R.Type 2, Exp.Ratio 1.40, Cable Susp": "1050",
				"1055  BL-6X12 in, Toutle R.Type 2, Exp.Ratio 1.40, Wading": "1055",
				"1060  BL-3X3 in, BL - 84, Exp.Ratio 1.40, Cable Susp": "1060",
				"1100  BL-3X3 in, H-S, 50-100 lb, Exp.Ratio 3.22, Cable Susp": "1100",
				"1110  BL-3X3 in, H-S, 100-200 lb, Exp.Ratio 3.22, Cable Susp": "1110",
				"1120  BL-3X3 in, H-S, 1/4-in thick nozzle, Exp.Ratio 3.22, Wading": "1120",
				"1150  BL-3X3 in, BLH - 84, 1/4-in thick nozzle, Exp.Ratio 1.4, Wading": "1150",
				"1170  BL-6X6 in H-S, 1 / 4 -in nozzle, 150-200 lb, Exp.Ratio 3.22, Cable Susp": "1170",
				"1180  BL-4X8 in, Elwha R., Exp.Ratio 1.40, Wading": "1180",
				"1190  BL-4X8 in, Elwha R., Exp.Ratio 1.40, Cable Susp": "1190",
				"1200  BL-Net-Frame Trap": "1200",
				"8010  Other": "8010",
				"8020  Mulitple samplers used": "8020"
			},
			"actions":
			{
				"100": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test",
				"110": "ShowQuestion::sizeOfBottle&HideQuestion::sizeOfBag&ShowQuestion::bottleMaterial&HideQuestion::bagMaterial&ShowQuestion::nozzleMaterial&ShowQuestion::nozzleDiameter&HidePanel::DataEntry:Intake Efficiency Test"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 3
		},
		bottleMaterial: {
			"id": "bottleMaterial",
			"hidden": true,
			"label": "Bottle Material",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"Plastic": "Plastic",
				"Glass": "Glass",
				"Other": "Other"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 3
		},

		bagMaterial: {
			"id": "bagMaterial",
			"label": "Bag Material",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"Plastic": "Plastic",
				"Glass": "Glass",
				"Other": "Other"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 3
		},

		sizeOfBottle: {
			"id": "sizeOfBottle",
			"hidden": true,
			"label": "Size of Bottle",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"Pint": "Pint",
				"Liter": "Liter",
				"Quart": "Quart"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},

		sizeOfBag: {
			"id": "sizeOfBag",
			"label": "Size of Bag",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"1 Liter": "1 Liter",
				"3 Liter": "3 Liter"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},

		bagMesh: {
			"id": "bagMesh",
			"label": "Bag Mesh Size (mm)",
			"XMLTag": "P30333",
			"type": "Text",
			"value": "",
			"placeholder": "mm",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 3
		},

		tetherLine: {
			"id": "tetherLine",
			"label": "Tether Line Used",
			"XMLTag": "P04117",
			"type": "Toggle",
			"value": false,
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"checkbox": true,
			"width_xs": 4,
			"width_lg": 2
		},

		compositeSamplesInCrossSection: {
			"id": "compositeSamplesInCrossSection",
			"label": "Composite Samples in Cross Sectional",
			"XMLTag": "P04118",
			"type": "Text",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},

		verticalsInComposite: {
			"id": "verticalsInComposite",
			"label": "Verticals In Composite",
			"XMLTag": "P04119",
			"type": "Text",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},

		nozzleMaterial: {
			"id": "nozzleMaterial",
			"label": "Nozzle Material",
			"XMLTag": "P72219",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"Brass": "1",
				"Plastic": "2",
				"TFE": "3"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},

		nozzleDiameter: {
			"id": "nozzleDiameter",
			"label": "Nozzle Diameter",
			"XMLTag": "P72220",
			"type": "DropDown",
			"includeBlank": true,
			"options":
			{
				"3/16": "3",
				"1/4": "4",
				"5/16": "5"
			},
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Sampler Info",
			"width_xs": 4,
			"width_lg": 2
		},

		streamDepth_IET: {
			"id": "streamDepth_IET",
			"label": "Stream Depth for Test",
			"type": "Text",
			"placeholder": "feet",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 2
		},

		transitRate: {
			"id": "transitRate",
			"label": "Transit Rate for Test",
			"type": "Text",
			"placeholder": "feet / second",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 2
		},

		streamVelocity_IET: {
			"id": "streamVelocity_IET",
			"label": "IET Stream Velocity (ft/s)",
			"XMLTag": "P72196",
			"type": "Text",
			"placeholder": "P72196",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 2
		},

		sampleVolume_IET: {
			"id": "sampleVolume_IET",
			"label": "Sample Volume for Test (mL)",
			"XMLTag": "P72218",
			"type": "Text",
			"placeholder": "P72218",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 4,
			"width_lg": 3
		},

		duration_IET: {
			"id": "duration_IET",
			"label": "Seconds sampler collected water",
			"XMLTag": "P72217",
			"type": "Text",
			"placeholder": "P72217",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 4,
			"width_lg": 3
		},

		nozzleMaterial_IET: {
			"id": "nozzleMaterial_IET",
			"label": "Nozzle Material",
			"type": "ComputedValue",
			"placeholder": "Enter value in sampler info panel",
			"computationString": "nozzleMaterial",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 3
		},

		nozzleDiameter_IET: {
			"id": "nozzleDiameter_IET",
			"label": "Nozzle Diameter",
			"type": "ComputedValue",
			"placeholder": "Enter value in sampler info panel",
			"computationString": "nozzleDiameter",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 3
		},

		ratioOfVertical: {
			"id": "ratioOfVertical",
			"label": "Ratio of Vertical",
			"type": "Text",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 3
		},

		intakeEfficiency: {
			"id": "intakeEfficiency",
			"label": "Intake Efficiency",
			"type": "Text",
			"value": "",
			"tabName": "DataEntry",
			"layoutGroup": "Intake Efficiency Test",
			"width_xs": 3,
			"width_lg": 3
		},

		avgRepMeasures: {
			"id": "avgRepMeasures",
			"label": "Average Representational Measures of these sets",
			"type": "Toggle",
			"tabName": "DataEntry",
			"layoutGroup": "Average Representational Measures",
			"checkbox": true,
			"value": false,
			"width_xs": 8,
			"width_lg": 6
		}
	},

	[QWDATA_TABLE_IDENTIFIER + BOTTOM_MATERIAL_TEXT]: {
		"id": QWDATA_TABLE_IDENTIFIER + BOTTOM_MATERIAL_TEXT,
		"label": "QWDATA Table",
		"type": "QWDATATable",
		// "tabName": "QWDATA",
		// "layoutGroup": "QWDATA Information",
		"colHeaders": true,
		"rowHeaders": true,
		"value": null,
		"width_xs": 12,
		"width_lg": 12
	},

	[PARAMETERS_TABLE_IDENTIFIER + BOTTOM_MATERIAL_TEXT]: {
		"id": PARAMETERS_TABLE_IDENTIFIER + BOTTOM_MATERIAL_TEXT,
		"label": "Parameters Table",
		"type": "ParametersTable",
		// "tabName": "Parameters",
		// "layoutGroup": "Parameters",
		"colHeaders": true,
		"rowHeaders": true,
		"value": null,
		"width_xs": 12,
		"width_lg": 12
	},

	[QWDATA_TABLE_IDENTIFIER + SUSPENDED_TEXT]: {
		"id": QWDATA_TABLE_IDENTIFIER + SUSPENDED_TEXT,
		"label": "QWDATA Table",
		"type": "QWDATATable",
		// "tabName": "QWDATA",
		// "layoutGroup": "QWDATA Information",
		"colHeaders": true,
		"rowHeaders": true,
		"value": null,
		"width_xs": 12,
		"width_lg": 12
	},

	[PARAMETERS_TABLE_IDENTIFIER + SUSPENDED_TEXT]: {
		"id": PARAMETERS_TABLE_IDENTIFIER + SUSPENDED_TEXT,
		"label": "Parameters Table",
		"type": "ParametersTable",
		// "tabName": "Parameters",
		// "layoutGroup": "Parameters",
		"colHeaders": true,
		"rowHeaders": true,
		"value": null,
		"width_xs": 12,
		"width_lg": 12
	},
	[QWDATA_TABLE_IDENTIFIER + BEDLOAD_TEXT]: {
		"id": QWDATA_TABLE_IDENTIFIER + BEDLOAD_TEXT,
		"label": "QWDATA Table",
		"type": "QWDATATable",
		// "tabName": "QWDATA",
		// "layoutGroup": "QWDATA Information",
		"colHeaders": true,
		"rowHeaders": true,
		"value": null,
		"width_xs": 12,
		"width_lg": 12
	},

	[PARAMETERS_TABLE_IDENTIFIER + BEDLOAD_TEXT]: {
		"id": PARAMETERS_TABLE_IDENTIFIER + BEDLOAD_TEXT,
		"label": "Parameters Table",
		"type": "ParametersTable",
		// "tabName": "Parameters",
		// "layoutGroup": "Parameters",
		"colHeaders": true,
		"rowHeaders": true,
		"value": null,
		"width_xs": 12,
		"width_lg": 12
	}
};