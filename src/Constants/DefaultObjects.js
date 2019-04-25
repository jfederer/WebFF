export const emptySamplingEvent = {
	eventID: "",
	eventName: "",
	dateModified: "",
	shippedStatus: "Not Shipped",
	questionValues: {
	}
}

export const emptyUser = {
	username: "",
	sedLoginUsername: "",
	settings: {
		backupInterval: 300,
		outlineQuestions: true,
		customQuestions: []
	}
}

export const defaultQuestionsData = {
	stationName: {
            "id": "stationName",
            "label": "Station Name",
            "type": "DropDown",
            "includeBlank": true,
            "tabName": "Field Form",
            "layoutGroup": "Basic",
            "helperText": "PCodes FTW!",
            "width_xs": 6,
            "width_lg": 3,
            "options":
                {"Hi":"12334"},
            "value": ""
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
		
		edgeOfWater_Left: {
            "id": "edgeOfWater_Left",
            "label": "Left Edge Of Water",
            "type": "Text",
            "placeholder": "Feet from XYZ",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 6,
            "width_lg": 2
        },

        edgeOfWater_Right :{
            "id": "edgeOfWater_Right",
            "label": "Right Edge Of Water",
            "type": "Text",
            "placeholder": "Feet from XYZ",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 5,
            "width_lg": 2
        },

        streamWidth : {
            "id": "streamWidth",
            "label": "Stream Width",
            "XMLTag": "P00004",
            "type": "ComputedValue",
            "computationString": "3/4*(edgeOfWater_Right-edgeOfWater_Left+2)^2",
            "placeholder": "This will be calculated",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 2
        },

        // projectName: {
        //     "id": "projectName",
        //     "label": "Project Name",
        //     "type": "Text",
        //     "tabName": "Field Form",
        //     "value": "",
        //     "layoutGroup": "Basic",
        //     "width_xs": 6,
        //     "width_lg": 3
        // },

        // projectID: {
        //     "id": "projectID",
        //     "label": "Project ID",
        //     "type": "Text",
        //     "tabName": "Data Entry",
        //     "value": "",
        //     "layoutGroup": "Basic",
        //     "width_xs": 4,
        //     "width_lg": 2
        // },

        // agencyCode: {
        //     "id": "agencyCode",
        //     "label": "Agency Code",
        //     "type": "Text",
        //     "tabName": "Field Form",
        //     "value": "",
        //     "layoutGroup": "Basic",
        //     "width_xs": 2,
        //     "width_lg": 1
        // },

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

        // sedimentType: {
        //     "id": "sedimentType",
        //     "label": "Sediment Type",
        //     "XMLTag": "SedTranspMode",
        //     "type": "DropDown",
        //     "includeBlank": false,
        //     "options":
        //     {
        //         "Bedload": "bedload",
        //         "Bottom Material": "bottom",
        //         "Suspended": "suspended"
        //     },
        //     "actions":
        //     {
        //         "anyValue": "HideQuestion::samplerType_bedload&HideQuestion::samplerType_bottom&HideQuestion::samplerType_suspended&HideQuestion::verticalsInComposite&HideQuestion::compositeSamplesInCrossSection&HideQuestion::tetherLine&HideQuestion::bagMesh&HideQuestion::samplingMethod_suspended&HideQuestion::samplingMethod_bedload&HideQuestion::samplingMethod_bottom&HideQuestion::samplingMethod_bottom_QWDATA_CV&HideQuestion::samplingMethod_bedload_QWDATA_CV&HideQuestion::samplingMethod_suspended_QWDATA_CV&HideQuestion::setA_AnalysedFor_bedload&HideQuestion::setA_AnalysedFor_bottom&HideQuestion::setA_AnalysedFor_suspended&HideQuestion::setB_AnalysedFor_bedload&HideQuestion::setB_AnalysedFor_bottom&HideQuestion::setB_AnalysedFor_suspended&HideQuestion::setC_AnalysedFor_bedload&HideQuestion::setC_AnalysedFor_bottom&HideQuestion::setC_AnalysedFor_suspended",
        //         "bedload": "ShowQuestion::samplerType_bedload&ShowQuestion::verticalsInComposite&ShowQuestion::compositeSamplesInCrossSection&ShowQuestion::tetherLine&ShowQuestion::bagMesh&ShowQuestion::samplingMethod_bedload&ShowQuestion::samplingMethod_bedload_QWDATA_CV&ShowQuestion::setA_AnalysedFor_bedload&ShowQuestion::setB_AnalysedFor_bedload&ShowQuestion::setC_AnalysedFor_bedload",
        //         "bottom": "ShowQuestion::samplerType_bottom&ShowQuestion::samplingMethod_bottom&ShowQuestion::samplingMethod_bottom_QWDATA_CV&ShowQuestion::setA_AnalysedFor_bottom&ShowQuestion::setB_AnalysedFor_bottom&ShowQuestion::setC_AnalysedFor_bottom",
        //         "suspended": "ShowQuestion::samplerType_suspended&ShowQuestion::samplingMethod_suspended&ShowQuestion::samplingMethod_suspended_QWDATA_CV&ShowQuestion::setA_AnalysedFor_suspended&ShowQuestion::setB_AnalysedFor_suspended&ShowQuestion::setC_AnalysedFor_suspended"
        //     },
        //     "value": "suspended",
        //     "tabName": "Field Form",
        //     "layoutGroup": "Basic",
        //     "width_xs": 4,
        //     "width_lg": 2
        // },

        // samplingMethod_bottom: {
        //     "id": "samplingMethod_bottom",
        //     "label": "Sampling Method",
        //     "XMLTag": "P82398",
        //     "type": "DropDown",
        //     "tabName": "Field Form",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "POINT SAMPLE": "50",
        //         "COMPOSITE - MULTIPLE POINT SAMPLES": "55",
        //         "SEDIMENT CORE": "5010",
        //         "OTHER": "8010"
        //     },
        //     "actions":
        //         { "anyValue": "ShowTab::DataEntry&HideQuestion::setA_samplesTable_EWI&HideQuestion::setA_samplesTable_EDI&HideQuestion::setB_samplesTable_EWI&HideQuestion::setB_samplesTable_EDI&HideQuestion::setC_samplesTable_EWI&HideQuestion::setC_samplesTable_EDI&ShowQuestion::setA_samplesTable_OTHER&ShowQuestion::setB_samplesTable_OTHER&ShowQuestion::setC_samplesTable_OTHER" },
        //     "value": "",
        //     "layoutGroup": "Basic",
        //     "width_xs": 4,
        //     "width_lg": 2
        // },

        // samplingMethod_bedload: {
        //     "id": "samplingMethod_bedload",
        //     "label": "Sampling Method",
        //     "XMLTag": "P82398",
        //     "type": "DropDown",
        //     "tabName": "Field Form",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "POINT SAMPLE": "50",
        //         "COMPOSITE - MULTIPLE POINT SAMPLES": "55",
        //         "BEDLOAD, SINGLE EQUAL WIDTH INCREMENT(SEWI)": "1000",
        //         "BEDLOAD, MULTIPLE EQUAL WIDTH INCREMENT(MEWI)": "1010",
        //         "BEDLOAD, UNEQUAL WIDTH INCREMENT(UWI)": "1020",
        //         "OTHER": "8010"
        //     },
        //     "actions":
        //         { "anyValue": "ShowTab::DataEntry&HideQuestion::setA_samplesTable_EWI&HideQuestion::setA_samplesTable_EDI&HideQuestion::setB_samplesTable_EWI&HideQuestion::setB_samplesTable_EDI&HideQuestion::setC_samplesTable_EWI&HideQuestion::setC_samplesTable_EDI&ShowQuestion::setA_samplesTable_OTHER&ShowQuestion::setB_samplesTable_OTHER&ShowQuestion::setC_samplesTable_OTHER" },
        //     "value": "",
        //     "layoutGroup": "Basic",
        //     "width_xs": 4,
        //     "width_lg": 2
        // },

        // samplingMethod_suspended: {
        //     "id": "samplingMethod_suspended",
        //     "label": "Sampling Method",
        //     "XMLTag": "P82398",
        //     "type": "DropDown",
        //     "tabName": "Field Form",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "EQUAL WIDTH INCREMENT (EWI)": "10",
        //         "EQUAL WIDTH INCREMENT, NON - ISOKINETIC": "15",
        //         "EQUAL DISCHARGE INCREMENT (EDI)": "20",
        //         "TIMED SAMPLING INTERVAL": "25",
        //         "SINGLE VERTICAL": "30",
        //         "MULTIPLE VERTICALS": "40",
        //         "POINT SAMPLE": "50",
        //         "COMPOSITE - MULTIPLE POINT SAMPLES": "55",
        //         "WEIGHTED BOTTLE": "60",
        //         "GRAB SAMPLE (DIP)": "70",
        //         "DISCHARGE INTEGRATED, EQUAL TRANSIT RATE(ETR)": "80",
        //         "DISCHARGE INTEGRATED, CENTROID": "90",
        //         "VAN DORN SAMPLER": "100",
        //         "SEWAGE SAMPLER": "110",
        //         "VELOCITY INTEGRATED": "120",
        //         "SUSPSED; PUMPING - stream sample using a pumping mechanism": "900",
        //         "SUSPSED;SINGLE-STAGE, nozzle at fixed stage, passively fillng": "910",
        //         "SUSPSED; BOX-SINGLE VER, DEPTH-INT, Attached To Structure": "920",
        //         "SUSPSED;PARTIAL DEPTH, DEPTH integrated, part of single vert.": "930",
        //         "SUSPSED; PARTIAL WIDTH - DEP/WIDTH INT, part of X-section": "940",
        //         "THIEF SAMPLE": "4010",
        //         "OPEN-TOP BAILER": "4020",
        //         "DOUBLE-VALVE BAILER": "4025",
        //         "OTHER": "8010",
        //         "GRAB SAMPLE AT WATER-SUPPLY TAP": "8030",
        //         "SPIGOT (NON-WATER-SUPPLY)": "8040",
        //         "GRAB SAMPLE AT TAP(S) ON A DAM": "8050"
        //     },
        //     "actions":
        //     {
        //         "10": "ShowQuestion::setA_samplesTable_EWI&ShowQuestion::setB_samplesTable_EWI&ShowQuestion::setC_samplesTable_EWI&HideQuestion::setA_samplesTable_OTHER&HideQuestion::setB_samplesTable_OTHER&HideQuestion::setC_samplesTable_OTHER",
        //         "20": "ShowQuestion::setA_samplesTable_EDI&ShowQuestion::setB_samplesTable_EDI&ShowQuestion::setC_samplesTable_EDI&HideQuestion::setA_samplesTable_OTHER&HideQuestion::setB_samplesTable_OTHER&HideQuestion::setC_samplesTable_OTHER",
        //         "anyValue": "ShowTab::DataEntry&HideQuestion::setA_samplesTable_EWI&HideQuestion::setA_samplesTable_EDI&HideQuestion::setB_samplesTable_EWI&HideQuestion::setB_samplesTable_EDI&HideQuestion::setC_samplesTable_EWI&HideQuestion::setC_samplesTable_EDI&ShowQuestion::setA_samplesTable_OTHER&ShowQuestion::setB_samplesTable_OTHER&ShowQuestion::setC_samplesTable_OTHER"
        //     },
        //     "value": "",
        //     "layoutGroup": "Basic",
        //     "width_xs": 4,
        //     "width_lg": 2
        // },

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

		setA_StartTime: {
            "id": "setA_StartTime",
            "label": "Start Time",
            "type": "TimeInput",
			"tabName": "Field Form",
			"autofill": true,
            "layoutGroup": "Set A Information",
            "value": "15:00",
            "width_xs": 5,
            "width_lg": 2
        },

		setA_samplesComposited: {
            "id": "setA_samplesComposited",
            "label": "Samples Composited",
            "XMLTag": "AnalyzeIndSamples",
			"type": "Toggle",
			// "checkbox": true,
            "tabName": "Field Form",
            "layoutGroup": "Set A Information",
            "value": true,
            "width_xs": 4,
            "width_lg": 3
        },

        // samplingTeam: {
        //     "id": "samplingTeam",
        //     "label": "Sampling Team",
        //     "type": "Text",
        //     "value": "",
        //     "tabName": "Field Form",
        //     "layoutGroup": "Basic",
        //     "width_xs": 5,
        //     "width_lg": 3
        // },

        // compiledBy: {
        //     "id": "compiledBy",
        //     "label": "Compiled By",
        //     "type": "Text",
        //     "value": "",
        //     "tabName": "Field Form",
        //     "layoutGroup": "Basic",
        //     "width_xs": 3,
        //     "width_lg": 1
        // },

        // sky: {
        //     "id": "sky",
        //     "label": "Sky",
        //     "type": "DropDown",
        //     "tabName": "Field Form",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "Clear": "Clear",
        //         "Partly Cloudy": "Partly Cloudy",
        //         "Cloudy": "Cloudy"
        //     },
        //     "value": "",
        //     "layoutGroup": "Weather",
        //     "width_xs": 4,
        //     "width_lg": 2
        // },

        // precipitation: {
        //     "id": "precipitation",
        //     "label": "Precipitation",
        //     "type": "DropDown",
        //     "tabName": "Field Form",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "No Precip": "No Precip",
        //         "Mist": "Mist",
        //         "Light Rain": "Light Rain",
        //         "Medium Rain": "Medium Rain",
        //         "Heavy Rain": "Heavy Rain",
        //         "Sleet": "Sleet",
        //         "Snow": "Snow"
        //     },
        //     "value": "",
        //     "layoutGroup": "Weather",
        //     "width_xs": 4,
        //     "width_lg": 2
        // },

        // temperature: {
        //     "id": "temperature",
        //     "label": "Temperature",
        //     "type": "DropDown",
        //     "tabName": "Field Form",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "Very Cold": "Very Cold",
        //         "Cold": "Cold",
        //         "Cool": "Cool",
        //         "Warm": "Warm",
        //         "Hot": "Hot",
        //         "Very Hot": "Very Hot"
        //     },
        //     "value": "",
        //     "layoutGroup": "Weather",
        //     "width_xs": 4,
        //     "width_lg": 2
        // },

        // wind: {
        //     "id": "wind",
        //     "label": "Wind",
        //     "type": "DropDown",
        //     "tabName": "Field Form",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "Calm": "Calm",
        //         "Light Breeze": "Light Breeze",
        //         "Breeze": "Breeze",
        //         "Gusty": "Gusty",
        //         "Windy": "Windy"
        //     },
        //     "value": "",
        //     "layoutGroup": "Weather",
        //     "width_xs": 4,
        //     "width_lg": 2
        // },

        // windDirection: {
        //     "id": "windDirection",
        //     "label": "Wind Direction",
        //     "type": "DropDown",
        //     "tabName": "Field Form",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "Upstream": "Upstream",
        //         "Downstream": "Downstream",
        //         "Cross-stream": "Cross-stream"
        //     },
        //     "value": "",
        //     "layoutGroup": "Weather",
        //     "width_xs": 4,
        //     "width_lg": 2
        // },

        // hydrologicEvent: {
        //     "id": "hydrologicEvent",
        //     "label": "Hydrologic Event",
        //     "XMLTag": "HydEvent",
        //     "type": "DropDown",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "1 - Drought": "1",
        //         "2 - Spill": "2",
        //         "3 - Regulated flow": "3",
        //         "4 - Snowmelt": "4",
        //         "5 - Earthquake": "5",
        //         "6 - Hurricane": "6",
        //         "7 - Flood": "7",
        //         "8 - Volcanic action": "8",
        //         "9 -Routine Sample": "9",
        //         "A - Spring Breakup": "A",
        //         "B - Under ice cover": "B",
        //         "C - Glacial Lake Outbreak": "C",
        //         "D - Mudflow": "D",
        //         "E - Tidal Action": "E",
        //         "F - Fire (basin affected)": "F",
        //         "H - Dambreak": "H",
        //         "J - Storm": "J",
        //         "K - Backwater": "K",
        //         "X - Not Applicable": "X"
        //     },
        //     "value": "",
        //     "tabName": "Field Form",
        //     "layoutGroup": "Sample Information",
        //     "width_xs": 4,
        //     "width_lg": 3
        // },

        // hydrologicCondition: {
        //     "id": "hydrologicCondition",
        //     "label": "Hydrologic Condition",
        //     "XMLTag": "Hstat",
        //     "type": "DropDown",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "4 - Stable, low stage": "4",
        //         "5 - Falling stage": "5",
        //         "6 - Stable, high stage": "6",
        //         "7 - Peak stage": "7",
        //         "8 - Rising stage": "8",
        //         "9 - Stable, normal stage": "9",
        //         "A - Not Determined": "A",
        //         "X - Not Applicable": "X"
        //     },
        //     "value": "",
        //     "tabName": "Field Form",
        //     "layoutGroup": "Sample Information",
        //     "width_xs": 4,
        //     "width_lg": 3
        // },

        // sampleMedium: {
        //     "id": "sampleMedium",
        //     "label": "Sample Medium",
        //     "XMLTag": "SmplMediumCode",
        //     "type": "DropDown",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "Surface Water (WS)": "WS",
        //         "Surface Water QC (WSQ)": "WSQ",
        //         "Bed Material (SB)": "SB",
        //         "Bed Material QC (SBQ)": "SBQ",
        //         "Artificial (OA)": "OA",
        //         "Artificial QC (OAQ)": "OAQ"
        //     },
        //     "value": "",
        //     "tabName": "Field Form",
        //     "layoutGroup": "Sample Information",
        //     "width_xs": 4,
        //     "width_lg": 3
        // },

        // sampleType: {
        //     "id": "sampleType",
        //     "label": "Sample Type",
        //     "XMLTag": "Stype",
        //     "type": "DropDown",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "1 - Spike": "1",
        //         "2 - Blank": "2",
        //         "3 - Reference": "3",
        //         "4 - Blind": "4",
        //         "5 - Duplicate": "5",
        //         "6 - Reference Material": "6",
        //         "7 - Replicate": "7",
        //         "8 - Spike Solution": "8",
        //         "9 - Regular": "9",
        //         "A - Not Determined": "A",
        //         "B - Other QA": "B",
        //         "H - Composite": "H"
        //     },
        //     "value": "",
        //     "tabName": "Field Form",
        //     "layoutGroup": "Sample Information",
        //     "width_xs": 4,
        //     "width_lg": 3
        // },

        // samplePurpose: {
        //     "id": "samplePurpose",
        //     "label": "Sample Purpose",
        //     "XMLTag": "P71999",
        //     "type": "DropDown",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "10 - ROUTINE": "10",
        //         "15 - NAWQA - NATIONAL WATER-QUALITY ASSESSMENT": "15",
        //         "20 - NASQAN": "20",
        //         "25 - NMN - National Monitoring Network": "25",
        //         "30 - BENCHMARK": "30",
        //         "35 - RASA, REGIONAL AQUIFER SYSTEMS ANALYSIS": "35",
        //         "40 - SW NETWORK": "40",
        //         "50 - GW NETWORK": "50",
        //         "60 - LOWFLOW NETWORK": "60",
        //         "70 - HIGHFLOW NETWORK": "70",
        //         "80 - ACID RAIN": "80",
        //         "80.01 - BULK OR UNDEFINED (BU)": "80.01",
        //         "80.02 - SAMPLE RELATED PROBLEM (NS)": "80.02",
        //         "80.03 - DRY WET-SIDE SAMPLE (NA)": "80.03",
        //         "80.04 - COMPLETELY MISSING SAMPLES (UN)": "80.04",
        //         "80.05 - LONG DURATION SAMPLE (LD)": "80.05",
        //         "80.06 - SAMPLING PROTOCOL (TIME) (SP)": "80.06",
        //         "80.07 - SAMPLER MALFUNCTION (S)": "80.07",
        //         "90 - SNOW SURVEY": "90",
        //         "100 - MT. ST. HELENS": "100",
        //         "110 - SEEPAGE STUDY": "110",
        //         "120 - IRRIGATION EFFECTS": "120",
        //         "130 - RECHARGE": "130",
        //         "140 - INJECTION": "140",
        //         "150 - BANK ERODIBILITY": "150",
        //         "160 - NATIONAL BLANK AND SPIKE PROGRAM": "160",
        //         "170 - QUALITY ASSURANCE": "170",
        //         "180 - CROSS-SECTION VARIATION": "180",
        //         "190 - GROUND-WATER/SURFACE-WATER INTERACTION STUDY": "190"
        //     },
        //     "value": "",
        //     "tabName": "Field Form",
        //     "layoutGroup": "Sample Information",
        //     "width_xs": 4,
        //     "width_lg": 3
        // },

        // analysisStatus: {
        //     "id": "analysisStatus",
        //     "label": "Analysis Status",
        //     "XMLTag": "Astat",
        //     "type": "DropDown",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "Unrestricted": "U",
        //         "Internal-use only": "I",
        //         "Proprietary": "P"
        //     },
        //     "value": "",
        //     "tabName": "Field Form",
        //     "layoutGroup": "Sample Information",
        //     "width_xs": 4,
        //     "width_lg": 3
        // },

        // meanStreamDepth: {
        //     "id": "meanStreamDepth",
        //     "label": "Mean Stream Depth (ft)",
        //     "type": "Text",
        //     "value": "",
        //     "tabName": "Field Form",
        //     "layoutGroup": "Sample Information",
        //     "placeholder": "P00064",
        //     "width_xs": 4,
        //     "width_lg": 3
        // },

        // streamVelocity: {
        //     "id": "streamVelocity",
        //     "label": "Stream Velocity (ft/s)",
        //     "type": "Text",
        //     "placeholder": "P00055",
        //     "value": "",
        //     "tabName": "Field Form",
        //     "layoutGroup": "Sample Information",
        //     "width_xs": 4,
        //     "width_lg": 3
        // },

        // streamMixing: {
        //     "id": "streamMixing",
        //     "label": "Stream Mixing",
        //     "type": "DropDown",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "Well Mixed": "Well Mixed",
        //         "Stratified": "Stratified",
        //         "Poorly-mixed": "Poorly-mixed",
        //         "Unknown": "Unknown"
        //     },
        //     "value": "",
        //     "tabName": "Field Form",
        //     "layoutGroup": "Sample Information",
        //     "width_xs": 4,
        //     "width_lg": 3
        // },

        // streamColor: {
        //     "id": "streamColor",
        //     "label": "Stream Color",
        //     "type": "DropDown",
        //     "includeBlank": true,
        //     "options":
        //     {
        //         "Brown": "Brown",
        //         "Green": "Green",
        //         "Blue": "Blue",
        //         "Gray": "Gray",
        //         "Clear": "Clear",
        //         "Other": "Other"
        //     },
        //     "value": "",
        //     "tabName": "Field Form",
        //     "layoutGroup": "Sample Information",
        //     "width_xs": 4,
        //     "width_lg": 3
		// }
	};