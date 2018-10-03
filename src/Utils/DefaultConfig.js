export const defaultHiddenTabs = [
    "WaterQuality",
    "FieldForm",
    "DataEntry",
    "Parameters",
    "QWDATA"
];

export const defaultHiddenPanels = [
    "DataEntry:IntakeEfficiencyTest"
];

export const defaultNavMenuInfo = [
    {
        "text": "Dashboard",
        "route": "/Dashboard",
        "icon": "DashboardIcon"
    },
    {
        "text": "Field Form",
        "route": "/FieldForm",
        "icon": "AssignmentIcon"
    },
    {
        "text": "Data Entry",
        "route": "/DataEntry",
        "icon": "EditIcon"
    },
    {
        "text": "Parameters",
        "route": "/Parameters"
    },
    {
        "text": "QWDATA",
        "route": "/QWDATA",
        "icon": "SubtitlesIcon"
    }
];



export const dialogQuestions =
    [
        {
            "dialogName": "Add/Remove Station",

            "dialogDescription": "Add a new station to, or remove and existing station from, your personalized station list",
            "questions":
                [
                    {
                        "id": "editStation_AddOrRemove",
                        "label": "Add or Remove station",
                        "type": "DropDown",
                        "includeBlank": true,
                        "options": {
                            "Add New Station": "Add",
                            "Remove Existing Station": "Remove"
                        },
                        "actions": {
                            "Add": "HideQuestion::deleteStation_stationName&ShowQuestion::newStation_stationName&ShowQuestion::newStation_stationNumber&ShowQuestion::newStation_projectName&ShowQuestion::newStation_projectID&ShowQuestion::newStation_agencyCode",
                            "Remove": "ShowQuestion::deleteStation_stationName&HideQuestion::newStation_stationName&HideQuestion::newStation_stationNumber&HideQuestion::newStation_projectName&HideQuestion::newStation_projectID&HideQuestion::newStation_agencyCode"
                        },
                        "value": "",
                        "width_xs": 12,
                        "width_lg": 12,
                    },
                    {
                        "id": "deleteStation_stationName",
                        "label": "Select Station To Remove",
                        "type": "DropDown",
                        "hidden": true,
                        "includeBlank": true,
                        "options": {
                            "Add New Station": "Add",
                            "Remove Existing Station": "Remove"
                        },
                        "value": ""
                    },
                    {
                        "id": "newStation_stationName",
                        "label": "Station Name",
                        "hidden": true,
                        "type": "Text",
                        "tabName": "Add New Station",
                        "layoutGroup": "Basic",
                        "width_xs": 7,
                        "width_lg": 7,
                        "value": ""
                    },
                    {
                        "id": "newStation_stationNumber",
                        "label": "Station Number",
                        "hidden": true,
                        "type": "Text",
                        "tabName": "Add Station",
                        "value": "",
                        "layoutGroup": "Basic",
                        "width_xs": 5,
                        "width_lg": 5
                    },
                    {
                        "id": "newStation_projectName",
                        "label": "Project Name",
                        "hidden": true,
                        "type": "Text",
                        "tabName": "Add Station",
                        "value": "",
                        "layoutGroup": "Basic",
                        "width_xs": 6,
                        "width_lg": 6
                    },
                    {
                        "id": "newStation_projectID",
                        "label": "Project ID",
                        "hidden": true,
                        "type": "Text",
                        "tabName": "Add Station",
                        "value": "",
                        "layoutGroup": "Basic",
                        "width_xs": 3,
                        "width_lg": 3
                    },
                    {
                        "id": "newStation_agencyCode",
                        "label": "Agency Code",
                        "hidden": true,
                        "type": "Text",
                        "tabName": "Add Station",
                        "value": "",
                        "layoutGroup": "Basic",
                        "width_xs": 3,
                        "width_lg": 3
                    }]
        },
        {
            "dialogName": "Add New Question",
            "dialogDescription": "Fill out the following to add a new question to the program",
            "questions": [{
                "id": "newQuestion_label",
                "label": "Label",
                "type": "Text",
                "width_xs": 6,
                "width_lg": 3,
                "value": ""
            },
            {
                "id": "newQuestion_id",
                "label": "Unique ID",
                "type": "Text",
                "placeholder": "Must be globally unique",
                "value": "",
                "width_xs": 6,
                "width_lg": 6
            },
            {
                "id": "newQuestion_type",
                "label": "Question Type",
                "type": "DropDown",
                "includeBlank": true,
                "options": {
                    "Checkbox": "Checkbox",
                    "Computed Value": "ComputedValue",
                    "Date": "DateInput",
                    "Drop Down": "DropDown",
                    "Multiple Choice": "MultipleChoice",
                    "Table": "TableInput",
                    "Text": "Text",
                    "Time": "TimeInput",
                    "Toggle": "Toggle"
                },
                "value": ""
            },
            {
                "id": "newQuestion_tabName",
                "label": "Tab Name",
                "helperText": "Name of tab where this question resides",
                "placeholder": "spaces acceptable",
                "type": "Text",
                "value": "",
                "width_xs": 4,
                "width_lg": 3
            },
            {
                "id": "newQuestion_layoutGroup",
                "label": "Layout Group",
                "helperText": "Group on Tab where question resides",
                "placeholder": "Spaces acceptable",
                "type": "Text",
                "value": "",
                "width_xs": 4,
                "width_lg": 3
            },
            {
                "id": "newQuestion_initalValue_textValue",
                "label": "Initial Value",
                "type": "Text",
                "placeholder": "Can be left blank",
                "value": "",
                "width_xs": 12,
                "width_lg": 12
            },
            {
                "id": "newQuestion_width_xs",
                "label": "Width when screen is small",
                "type": "Text",
                "placeholder": "1-12",
                "value": "",
                "width_xs": 6,
                "width_lg": 6
            },
            {
                "id": "newQuestion_width_lg",
                "label": "Width when screen is small",
                "type": "Text",
                "placeholder": "Can be left blank",
                "value": "",
                "width_xs": 6,
                "width_lg": 6
            }]
        },
        {
            "dialogName": "User Manual",
            "dialogDescription": "Holding Times-Sample holding times are specified in the USEPA Region 4 Analytical Support",
            "questions": []
        },
        {
            "dialogName": "Switch User",
            "dialogDescription": "WebFF recognizes who you are based on your email.",
            "questions": [{
                "id": "switchUser_email",
                "label": "Email Address",
                "type": "Text",
                "placeholder": "username@usgs.gov",
                "width_xs": 12,
                "width_lg": 12,
                "ref": "switchUser_email",
                "value": ""
            }]
        },
        {
            "dialogName": "Settings",
            "dialogDescription": "Change system settings",
            "questions": [{
                "id": "settings_paper",
                "label": "Outline Fields",
                "type": "Toggle",
                "placeholder": "username@usgs.gov",
                "value": false,
                "width_xs": 12,
                "width_lg": 12
            },
            {
                "id": "settings_syncDelay",
                "label": "Minutes betwen auto save-to-DB",
                "type": "Text",
                "placeholder": "must be >1",
                "value": "5",
                "width_xs": 12,
                "width_lg": 12
            }]
        }
    ];

export const questionsData =
    [
        {
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
                {},
            "value": ""
        },

        {
            "id": "stationNumber",
            "label": "Station Number",
            "type": "Text",
            "tabName": "Field Form",
            "value": "",
            "layoutGroup": "Basic",
            "width_xs": 6,
            "width_lg": 3
        },

        {
            "id": "projectName",
            "label": "Project Name",
            "type": "Text",
            "tabName": "Field Form",
            "value": "",
            "layoutGroup": "Basic",
            "width_xs": 6,
            "width_lg": 3
        },

        {
            "id": "projectID",
            "label": "Project ID",
            "type": "Text",
            "tabName": "Field Form",
            "value": "",
            "layoutGroup": "Basic",
            "width_xs": 4,
            "width_lg": 2
        },

        {
            "id": "agencyCode",
            "label": "Agency Code",
            "type": "Text",
            "tabName": "Field Form",
            "value": "",
            "layoutGroup": "Basic",
            "width_xs": 2,
            "width_lg": 1
        },

        {
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

        {
            "id": "sedimentType",
            "label": "Sediment Type",
            "XMLTag": "SedTranspMode",
            "type": "DropDown",
            "includeBlank": false,
            "options":
            {
                "Bedload": "bedload",
                "Bottom Material": "bottom",
                "Suspended": "suspended"
            },
            "actions":
            {
                "anyValue": "HideQuestion::samplerType_bedload&HideQuestion::samplerType_bottom&HideQuestion::samplerType_suspended&HideQuestion::verticalsInComposite&HideQuestion::compositeSamplesInCrossSection&HideQuestion::tetherLine&HideQuestion::bagMesh&HideQuestion::samplingMethod_suspended&HideQuestion::samplingMethod_bedload&HideQuestion::samplingMethod_bottom&HideQuestion::samplingMethod_bottom_QWDATA_CV&HideQuestion::samplingMethod_bedload_QWDATA_CV&HideQuestion::samplingMethod_suspended_QWDATA_CV&HideQuestion::setA_AnalysedFor_bedload&HideQuestion::setA_AnalysedFor_bottom&HideQuestion::setA_AnalysedFor_suspended&HideQuestion::setB_AnalysedFor_bedload&HideQuestion::setB_AnalysedFor_bottom&HideQuestion::setB_AnalysedFor_suspended&HideQuestion::setC_AnalysedFor_bedload&HideQuestion::setC_AnalysedFor_bottom&HideQuestion::setC_AnalysedFor_suspended",
                "bedload": "ShowQuestion::samplerType_bedload&ShowQuestion::verticalsInComposite&ShowQuestion::compositeSamplesInCrossSection&ShowQuestion::tetherLine&ShowQuestion::bagMesh&ShowQuestion::samplingMethod_bedload&ShowQuestion::samplingMethod_bedload_QWDATA_CV&ShowQuestion::setA_AnalysedFor_bedload&ShowQuestion::setB_AnalysedFor_bedload&ShowQuestion::setC_AnalysedFor_bedload",
                "bottom": "ShowQuestion::samplerType_bottom&ShowQuestion::samplingMethod_bottom&ShowQuestion::samplingMethod_bottom_QWDATA_CV&ShowQuestion::setA_AnalysedFor_bottom&ShowQuestion::setB_AnalysedFor_bottom&ShowQuestion::setC_AnalysedFor_bottom",
                "suspended": "ShowQuestion::samplerType_suspended&ShowQuestion::samplingMethod_suspended&ShowQuestion::samplingMethod_suspended_QWDATA_CV&ShowQuestion::setA_AnalysedFor_suspended&ShowQuestion::setB_AnalysedFor_suspended&ShowQuestion::setC_AnalysedFor_suspended"
            },
            "value": "suspended",
            "tabName": "Field Form",
            "layoutGroup": "Basic",
            "width_xs": 4,
            "width_lg": 2
        },

        {
            "id": "samplingMethod_bottom",
            "label": "Sampling Method",
            "XMLTag": "P82398",
            "type": "DropDown",
            "tabName": "Field Form",
            "includeBlank": true,
            "options":
            {
                "POINT SAMPLE": "50",
                "COMPOSITE - MULTIPLE POINT SAMPLES": "55",
                "SEDIMENT CORE": "5010",
                "OTHER": "8010"
            },
            "actions":
                { "anyValue": "ShowTab::DataEntry&HideQuestion::setA_samplesTable_EWI&HideQuestion::setA_samplesTable_EDI&HideQuestion::setB_samplesTable_EWI&HideQuestion::setB_samplesTable_EDI&HideQuestion::setC_samplesTable_EWI&HideQuestion::setC_samplesTable_EDI&ShowQuestion::setA_samplesTable_OTHER&ShowQuestion::setB_samplesTable_OTHER&ShowQuestion::setC_samplesTable_OTHER" },
            "value": "",
            "layoutGroup": "Basic",
            "width_xs": 4,
            "width_lg": 2
        },

        {
            "id": "samplingMethod_bedload",
            "label": "Sampling Method",
            "XMLTag": "P82398",
            "type": "DropDown",
            "tabName": "Field Form",
            "includeBlank": true,
            "options":
            {
                "POINT SAMPLE": "50",
                "COMPOSITE - MULTIPLE POINT SAMPLES": "55",
                "BEDLOAD, SINGLE EQUAL WIDTH INCREMENT(SEWI)": "1000",
                "BEDLOAD, MULTIPLE EQUAL WIDTH INCREMENT(MEWI)": "1010",
                "BEDLOAD, UNEQUAL WIDTH INCREMENT(UWI)": "1020",
                "OTHER": "8010"
            },
            "actions":
                { "anyValue": "ShowTab::DataEntry&HideQuestion::setA_samplesTable_EWI&HideQuestion::setA_samplesTable_EDI&HideQuestion::setB_samplesTable_EWI&HideQuestion::setB_samplesTable_EDI&HideQuestion::setC_samplesTable_EWI&HideQuestion::setC_samplesTable_EDI&ShowQuestion::setA_samplesTable_OTHER&ShowQuestion::setB_samplesTable_OTHER&ShowQuestion::setC_samplesTable_OTHER" },
            "value": "",
            "layoutGroup": "Basic",
            "width_xs": 4,
            "width_lg": 2
        },

        {
            "id": "samplingMethod_suspended",
            "label": "Sampling Method",
            "XMLTag": "P82398",
            "type": "DropDown",
            "tabName": "Field Form",
            "includeBlank": true,
            "options":
            {
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
                "10": "ShowQuestion::setA_samplesTable_EWI&ShowQuestion::setB_samplesTable_EWI&ShowQuestion::setC_samplesTable_EWI&HideQuestion::setA_samplesTable_OTHER&HideQuestion::setB_samplesTable_OTHER&HideQuestion::setC_samplesTable_OTHER",
                "20": "ShowQuestion::setA_samplesTable_EDI&ShowQuestion::setB_samplesTable_EDI&ShowQuestion::setC_samplesTable_EDI&HideQuestion::setA_samplesTable_OTHER&HideQuestion::setB_samplesTable_OTHER&HideQuestion::setC_samplesTable_OTHER",
                "anyValue": "ShowTab::DataEntry&HideQuestion::setA_samplesTable_EWI&HideQuestion::setA_samplesTable_EDI&HideQuestion::setB_samplesTable_EWI&HideQuestion::setB_samplesTable_EDI&HideQuestion::setC_samplesTable_EWI&HideQuestion::setC_samplesTable_EDI&ShowQuestion::setA_samplesTable_OTHER&ShowQuestion::setB_samplesTable_OTHER&ShowQuestion::setC_samplesTable_OTHER"
            },
            "value": "",
            "layoutGroup": "Basic",
            "width_xs": 4,
            "width_lg": 2
        },

        {
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

        {
            "id": "samplingTeam",
            "label": "Sampling Team",
            "type": "Text",
            "value": "",
            "tabName": "Field Form",
            "layoutGroup": "Basic",
            "width_xs": 5,
            "width_lg": 3
        },

        {
            "id": "compiledBy",
            "label": "Compiled By",
            "type": "Text",
            "value": "",
            "tabName": "Field Form",
            "layoutGroup": "Basic",
            "width_xs": 3,
            "width_lg": 1
        },

        {
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

        {
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

        {
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

        {
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

        {
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

        {
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

        {
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

        {
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

        {
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

        {
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

        {
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

        {
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

        {
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

        {
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

        {
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

        {
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

        {
            "id": "edgeOfSamplingZone_Left",
            "label": "Left Edge Of Sampling Zone",
            "type": "Text",
            "placeholder": "Feet from XYZ",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 6,
            "width_lg": 3
        },

        {
            "id": "edgeOfSamplingZone_Right",
            "label": "Right Edge Of Sampling Zone",
            "type": "Text",
            "placeholder": "Feet from XYZ",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 5,
            "width_lg": 3
        },

        {
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

        {
            "id": "streamWidth",
            "label": "Stream Width",
            "XMLTag": "P00004",
            "type": "ComputedValue",
            "computationString": "edgeOfWater_Right-edgeOfWater_Left",
            "placeholder": "This will be calculated",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 2
        },

        {
            "id": "pier1_start",
            "label": "Pier 1 Start",
            "type": "Text",
            "placeholder": "Feet",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "pier2_start",
            "label": "Pier 2 Start",
            "type": "Text",
            "placeholder": "Feet",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "pier3_start",
            "label": "Pier 3 Start",
            "type": "Text",
            "placeholder": "Feet",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "pier4_start",
            "label": "Pier 4 Start",
            "type": "Text",
            "placeholder": "Feet",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "pier5_start",
            "label": "Pier 5 Start",
            "type": "Text",
            "placeholder": "Feet",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "pier6_start",
            "label": "Pier 6 Start",
            "type": "Text",
            "placeholder": "Feet",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "pier1_end",
            "label": "Pier 1 End",
            "type": "Text",
            "placeholder": "Feet",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "pier2_end",
            "label": "Pier 2 End",
            "type": "Text",
            "placeholder": "Feet",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "pier3_end",
            "label": "Pier 3 End",
            "type": "Text",
            "placeholder": "Feet",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "pier4_end",
            "label": "Pier 4 End",
            "type": "Text",
            "placeholder": "Feet",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "pier5_end",
            "label": "Pier 5 End",
            "type": "Text",
            "placeholder": "Feet",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "pier6_end",
            "label": "Pier 6 End",
            "type": "Text",
            "placeholder": "Feet",
            "value": "",
            "tabName": "FieldForm",
            "layoutGroup": "Waterway Info",
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "samplerType_suspended",
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

        {
            "id": "samplerType_bottom",
            "label": "Sampler Type",
            "XMLTag": "P84164",
            "type": "DropDown",
            "hidden": true,
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

        {
            "id": "samplerType_bedload",
            "label": "Sampler Type",
            "XMLTag": "P84164",
            "type": "DropDown",
            "hidden": true,
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

        {
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

        {
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

        {
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

        {
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

        {
            "id": "bagMesh",
            "hidden": true,
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

        {
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

        {
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

        {
            "id": "tetherLine",
            "hidden": true,
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

        {
            "id": "compositeSamplesInCrossSection",
            "hidden": true,
            "label": "Composite Samples in Cross Sectional",
            "XMLTag": "P04118",
            "type": "Text",
            "value": "",
            "tabName": "DataEntry",
            "layoutGroup": "Sampler Info",
            "width_xs": 4,
            "width_lg": 2
        },

        {
            "id": "verticalsInComposite",
            "hidden": true,
            "label": "Verticals In Composite",
            "XMLTag": "P04119",
            "type": "Text",
            "value": "",
            "tabName": "DataEntry",
            "layoutGroup": "Sampler Info",
            "width_xs": 4,
            "width_lg": 2
        },

        {
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

        {
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

        {
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

        {
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

        {
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

        {
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

        {
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

        {
            "id": "ratioOfVertical",
            "label": "Ratio of Vertical",
            "type": "Text",
            "value": "",
            "tabName": "DataEntry",
            "layoutGroup": "Intake Efficiency Test",
            "width_xs": 3,
            "width_lg": 3
        },

        {
            "id": "intakeEfficiency",
            "label": "Intake Efficiency",
            "type": "Text",
            "value": "",
            "tabName": "DataEntry",
            "layoutGroup": "Intake Efficiency Test",
            "width_xs": 3,
            "width_lg": 3
        },

        {
            "id": "groupOfSamples",
            "label": "This is a group of samples",
            "type": "Toggle",
            "checkbox": true,
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "value": false,
            "width_xs": 12,
            "width_lg": 12,
            "actions":
            {
                "true": "HideQuestion::showSetB&SetValue::setA_samplesComposited:false",
                "false": "ShowQuestion::showSetB"
            }
        },

        {
            "id": "setA_StartTime",
            "label": "Start Time",
            "type": "TimeInput",
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "value": "",
            "width_xs": 5,
            "width_lg": 2
        },

        {
            "id": "setA_EndTime",
            "label": "End Time",
            "type": "TimeInput",
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "value": "",
            "width_xs": 5,
            "width_lg": 2
        },

        {
            "id": "setA_StartGageHeight",
            "label": "Start Gage Ht",
            "placeholder": "feet",
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "type": "Text",
            "value": "",
            "width_xs": 3,
            "width_lg": 2
        },

        {
            "id": "setA_EndGageHeight",
            "label": "End Gage Ht",
            "placeholder": "feet",
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "type": "Text",
            "value": "",
            "width_xs": 3,
            "width_lg": 2
        },

        {
            "id": "setA_AvgGageHeight",
            "label": "Avg Gage Ht",
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "type": "ComputedValue",
            "computationString": "(setA_StartGageHeight+setA_EndGageHeight)/2",
            "value": "",
            "width_xs": 4,
            "width_lg": 2
        },

        {
            "id": "setA_numberOfSamplingPoints",
            "value": "",
            "label": "Sampling Points",
            "type": "Text",
            "placeholder": "Number of Points",
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "width_xs": 3,
            "width_lg": 3,
            "actions":
                { "anyValue": "ShowTab::QWDATA" }
        },

        {
            "id": "setA_numberOfContainers",
            "label": "Number Of Containers",
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "type": "Text",
            "value": "",
            "width_xs": 3,
            "width_lg": 4
        },

        {
            "id": "setA_samplesComposited",
            "label": "Samples Composited",
            "XMLTag": "AnalyzeIndSamples",
            "type": "Toggle",
            "checkbox": true,
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "value": false,
            "width_xs": 4,
            "width_lg": 3
        },

        {
            "id": "setA_samplesTable_EDI",
            "label": "Samples Table",
            "type": "TableInput",
            "hidden": true,
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "colHeaders": true,
            "rowHeaders": true,
            "value": [["DataEntry",
                "Distance from L bank, feet",
                "Sampling Depth, feet",
                "Transit Rate, ft / sec",
                "Rest time on Bed for Bedload sample,seconds",
                "Horizontal width of Vertical, feet"],
            ["Fill Out Number Of Samples", "", "", "", "", ""]],
            "width_xs": 10,
            "width_lg": 10
        },

        {
            "id": "setA_samplesTable_EWI",
            "label": "Samples Table",
            "type": "TableInput",
            "hidden": true,
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "colHeaders": true,
            "rowHeaders": true,

            "value": [["Distance from L bank, feet", "Sampling Depth, feet", "Transit Rate, ft / sec", "Rest time on Bed for Bedload sample, seconds", "Horizontal width of Vertical, feet"],
            ["Fill Out Number Of Samples",
                "",
                "",
                "",
                ""]],
            "width_xs": 10,
            "width_lg": 10
        },

        {
            "id": "setA_samplesTable_OTHER",
            "label": "Samples Table",
            "type": "TableInput",
            "hidden": true,
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "colHeaders": true,
            "rowHeaders": true,

            "value": [["Sample #",
                "Distance from L bank, feet", "Sampling Depth, feet", "Transit Rate, ft / sec", "Rest time on Bed for Bed load sample, seconds", "Horizontal width of Vertical, feet"],
            ["Fill Out Number Of Samples",
                "",
                "",
                "",
                "",
                ""]],
            "width_xs": 10,
            "width_lg": 10
        },

        {
            "id": "setA_AnalysedFor_bedload",
            "label": "Analyze Set/Group A for:",
            "XMLTag": "Analyses",
            "type": "MultipleChoice",
            "options":
            {
                "Sand-Fine break": "SF",
                "Sand Analysis": "SA",
                "Loss-on-ignition": "LOI",
                "Full-size Fractions*": "Z",
                "Fines Only": "FO"
            },
            "value": [],
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "width_xs": 2,
            "width_lg": 2
        },

        {
            "id": "setA_AnalysedFor_bottom",
            "label": "Analyze Set/Group A for:",
            "XMLTag": "Analyses",
            "type": "MultipleChoice",
            "options":
            {
                "Sand-Fine break*": "SF",
                "Fines Only": "FO",
                "Sand Analysis*": "SA",
                "Loss-on-ignition*": "LOI",
                "Bulk Density": "BD",
                "Full-size Fractions*": "Z"
            },
            "value": [],
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "width_xs": 2,
            "width_lg": 2
        },

        {
            "id": "setA_AnalysedFor_suspended",
            "label": "Analyze Set/Group A for:",
            "XMLTag": "Analyses",
            "type": "MultipleChoice",
            "helperText": "* possible add-on analysis for individual samples.",
            "options":
            {
                "Concentration": "C",
                "Sand-Fine break*": "SF",
                "Sand Analysis*": "SA",
                "Turbidity": "T",
                "Loss-on-ignition*": "LOI",
                "Dissolved Solids": "DS",
                "Specific Conductance": "SC",
                "Full-size Fractions*": "Z"
            },
            "value": [],
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "width_xs": 2,
            "width_lg": 2
        },

        {
            "id": "showSetB",
            "label": "Show Set B",
            "type": "Toggle",
            "tabName": "DataEntry",
            "layoutGroup": "Set A Information",
            "value": false,
            "actions":
            {
                "true": "ShowPanel::DataEntry:Set B Information&ShowPanel::DataEntry:Average Representational Measures",
                "false": "HidePanel::DataEntry:Set B Information&HidePanel::DataEntry:Average Representational Measures"
            },
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "avgRepMeasures",
            "label": "Average Representational Measures of these sets",
            "type": "Toggle",
            "tabName": "DataEntry",
            "layoutGroup": "Average Representational Measures",
            "checkbox": true,
            "value": false,
            "width_xs": 8,
            "width_lg": 6
        },

        {
            "id": "setB_StartTime",
            "label": "Start Time",
            "type": "TimeInput",
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "value": "",
            "width_xs": 5,
            "width_lg": 2
        },

        {
            "id": "setB_EndTime",
            "label": "End Time",
            "type": "TimeInput",
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "value": "",
            "width_xs": 5,
            "width_lg": 2
        },

        {
            "id": "setB_StartGageHeight",
            "label": "Start Gage Ht",
            "placeholder": "feet",
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "type": "Text",
            "value": "",
            "width_xs": 3,
            "width_lg": 2
        },

        {
            "id": "setB_EndGageHeight",
            "label": "End Gage Ht",
            "placeholder": "feet",
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "type": "Text",
            "value": "",
            "width_xs": 3,
            "width_lg": 2
        },

        {
            "id": "setB_AvgGageHeight",
            "label": "Avg Gage Ht",
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "type": "ComputedValue",
            "value": "",
            "computationString": "(setB_StartGageHeight+setB_EndGageHeight)/2",
            "width_xs": 4,
            "width_lg": 2
        },

        {
            "id": "setB_numberOfSamplingPoints",
            "value": "",
            "label": "Sampling Points",
            "type": "Text",
            "placeholder": "Number of Points",
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "width_xs": 3,
            "width_lg": 3,
            "actions":
                { "anyValue": "ShowTab::QWDATA" }
        },

        {
            "id": "setB_numberOfContainers",
            "label": "Number Of Containers",
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "type": "Text",
            "value": "",
            "width_xs": 3,
            "width_lg": 4
        },

        {
            "id": "setB_samplesComposited",
            "label": "Samples Composited",
            "XMLTag": "AnalyzeIndSamples",
            "type": "Toggle",
            "checkbox": true,
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "value": false,
            "width_xs": 4,
            "width_lg": 3
        },

        {
            "id": "setB_samplesTable_EDI",
            "label": "Samples Table",
            "type": "TableInput",
            "hidden": true,
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "colHeaders": true,
            "rowHeaders": true,

            "value": [["DataEntry", "Distance from L bank, feet", " Sampling Depth, feet", "Transit Rate, ft / sec", "Rest time on Bed for Bed load sample, seconds", "Horizontal width of Vertical, feet"],
            ["Fill Out Number Of Samples",
                "",
                "",
                "",
                "",
                ""]],
            "width_xs": 10,
            "width_lg": 10,
        },

        {
            "id": "setB_samplesTable_EWI",
            "label": "Samples Table",
            "type": "TableInput",
            "hidden": true,
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "colHeaders": true,
            "rowHeaders": true,
            "value": [["Distance from L bank, feet", "Sampling Depth, feet", "Transit Rate, ft / sec", "Rest time on Bed for Bed load sample, seconds", "Horizontal width of Vertical, feet"],
            ["Fill Out Number Of Samples",
                "",
                "",
                "",
                ""]],
            "width_xs": 10,
            "width_lg": 10
        },

        {
            "id": "setB_samplesTable_OTHER",
            "label": "Samples Table",
            "type": "TableInput",
            "hidden": true,
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "colHeaders": true,
            "rowHeaders": true,
            "value": [["Sample #",
                "Distance from L bank, feet", "Sampling Depth, feet", "Transit Rate, ft / sec", "Rest time on Bed for Bed load sample, seconds", "Horizontal width of Vertical, feet"], ["Fill Out Number Of Samples",
                "",
                "",
                "",
                "",
                ""]],
            "width_xs": 10,
            "width_lg": 10
        },

        {
            "id": "setB_AnalysedFor_bedload",
            "label": "Analyze Set B for:",
            "XMLTag": "Analyses",
            "type": "MultipleChoice",
            "options":
            {
                "Sand-Fine break": "SF",
                "Sand Analysis": "SA",
                "Loss-on-ignition": "LOI",
                "Full-size Fractions*": "Z",
                "Fines Only": "FO"
            },
            "value": [],
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "width_xs": 2,
            "width_lg": 2
        },

        {
            "id": "setB_AnalysedFor_bottom",
            "label": "Analyze Set B for:",
            "XMLTag": "Analyses",
            "type": "MultipleChoice",
            "options":
            {
                "Sand-Fine break*": "SF",
                "Sand Analysis*": "SA",
                "Loss-on-ignition*": "LOI",
                "Bulk Density": "BD",
                "Full-size Fractions*": "Z",
                "Fines Only": "FO"
            },
            "value": [],
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "width_xs": 2,
            "width_lg": 2
        },

        {
            "id": "setB_AnalysedFor_suspended",
            "label": "Analyze Set B for:",
            "XMLTag": "Analyses",
            "type": "MultipleChoice",
            "options":
            {
                "Concentration": "C",
                "Sand-Fine break*": "SF",
                "Sand Analysis*": "SA",
                "Turbidity": "T",
                "Loss-on-ignition*": "LOI",
                "Dissolved Solids": "DS",
                "Specific Conductance": "SC",
                "Full-size Fractions*": "Z"
            },
            "value": [],
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "width_xs": 2,
            "width_lg": 2
        },

        {
            "id": "showSetC",
            "label": "Show Set C",
            "type": "Toggle",
            "tabName": "DataEntry",
            "layoutGroup": "Set B Information",
            "value": false,
            "actions":
            {
                "true": "ShowPanel::DataEntry:Set C Information",
                "false": "HidePanel::DataEntry:Set C Information"
            },
            "width_xs": 2,
            "width_lg": 1
        },

        {
            "id": "setC_StartTime",
            "label": "Start Time",
            "type": "TimeInput",
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "value": "",
            "width_xs": 5,
            "width_lg": 2
        },

        {
            "id": "setC_EndTime",
            "label": "End Time",
            "type": "TimeInput",
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "value": "",
            "width_xs": 5,
            "width_lg": 2
        },

        {
            "id": "setC_StartGageHeight",
            "label": "Start Gage Ht",
            "placeholder": "feet",
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "type": "Text",
            "value": "",
            "width_xs": 3,
            "width_lg": 2
        },

        {
            "id": "setC_EndGageHeight",
            "label": "End Gage Ht",
            "placeholder": "feet",
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "type": "Text",
            "value": "",
            "width_xs": 3,
            "width_lg": 2
        },

        {
            "id": "setC_AvgGageHeight",
            "label": "Avg Gage Ht",
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "type": "ComputedValue",
            "computationString": "(setC_StartGageHeight+setC_EndGageHeight)/2",
            "value": "",
            "width_xs": 4,
            "width_lg": 2
        },

        {
            "id": "setC_numberOfSamplingPoints",
            "value": "",
            "label": "Sampling Points",
            "type": "Text",
            "placeholder": "Number of Points",
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "width_xs": 3,
            "width_lg": 3,
            "actions":
                { "anyValue": "ShowTab::QWDATA" }
        },

        {
            "id": "setC_numberOfContainers",
            "label": "Number Of Containers",
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "type": "Text",
            "value": "",
            "width_xs": 3,
            "width_lg": 4
        },

        {
            "id": "setC_samplesComposited",
            "label": "Samples Composited",
            "XMLTag": "AnalyzeIndSamples",
            "type": "Toggle",
            "checkbox": true,
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "value": false,
            "width_xs": 4,
            "width_lg": 3
        },

        {
            "id": "setC_samplesTable_EDI",
            "label": "Samples Table",
            "type": "TableInput",
            "hidden": true,
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "colHeaders": true,
            "rowHeaders": true,

            "value": [["DataEntry", "Distance from L bank, feet", "Sampling Depth, feet", "Transit Rate, ft / sec", "Rest time on Bed for Bed load sample, seconds", "Horizontal width of Vertical, feet"],
            ["Fill Out Number Of Samples",
                "",
                "",
                "",
                "",
                ""]],
            "width_xs": 10,
            "width_lg": 10
        },

        {
            "id": "setC_samplesTable_EWI",
            "label": "Samples Table",
            "type": "TableInput",
            "hidden": true,
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "colHeaders": true,
            "rowHeaders": true,
            "value": [["Distance from L bank, feet", "Sampling Depth, feet", "Transit Rate, ft / sec", "Rest time on Bed for Bed load sample, seconds", "Horizontal width of Vertical, feet"],
            ["Fill Out Number Of Samples",
                "",
                "",
                "",
                ""]],
            "width_xs": 10,
            "width_lg": 10
        },

        {
            "id": "setC_samplesTable_OTHER",
            "label": "Samples Table",
            "type": "TableInput",
            "hidden": true,
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "colHeaders": true,
            "rowHeaders": true,
            "value": [["Sample #",
                "Distance from L bank, feet", "Sampling Depth, feet", "Transit Rate, ft / sec", "Rest time on Bed for Bed load sample, seconds", "Horizontal width of Vertical, feet"],
            ["Fill Out Number Of Samples",
                "",
                "",
                "",
                "",
                ""]],
            "width_xs": 10,
            "width_lg": 10
        },

        {
            "id": "setC_AnalysedFor_bedload",
            "label": "Analyze Set C for:",
            "XMLTag": "Analyses",
            "type": "MultipleChoice",
            "options":
            {
                "Sand-Fine break": "SF",
                "Sand Analysis": "SA",
                "Loss-on-ignition": "LOI",
                "Full-size Fractions*": "Z",
                "Fines Only": "FO"
            },
            "value": [],
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "width_xs": 2,
            "width_lg": 2
        },

        {
            "id": "setC_AnalysedFor_bottom",
            "label": "Analyze Set C for:",
            "XMLTag": "Analyses",
            "type": "MultipleChoice",
            "options":
            {
                "Sand-Fine break*": "SF",
                "Sand Analysis*": "SA",
                "Loss-on-ignition*": "LOI",
                "Bulk Density": "BD",
                "Full-size Fractions*": "Z",
                "Fines Only": "FO"
            },
            "value": [],
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "width_xs": 2,
            "width_lg": 2
        },

        {
            "id": "setC_AnalysedFor_suspended",
            "label": "Analyze Set C for:",
            "XMLTag": "Analyses",
            "type": "MultipleChoice",
            "options":
            {
                "Concentration": "C",
                "Sand-Fine break*": "SF",
                "Sand Analysis*": "SA",
                "Turbidity": "T",
                "Loss-on-ignition*": "LOI",
                "Dissolved Solids": "DS",
                "Specific Conductance": "SC",
                "Full-size Fractions*": "Z"
            },
            "value": [],
            "tabName": "DataEntry",
            "layoutGroup": "Set C Information",
            "width_xs": 2,
            "width_lg": 2
        },

        {
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

        {
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

        {
            "id": "samplingMethod_bedload_QWDATA_CV",
            "label": "Sampling Method",
            "type": "ComputedValue",
            "tabName": "QWDATA",
            "layoutGroup": "QWDATA Info",
            "placeholder": "Select on Field Form page",
            "computationString": "samplingMethod_bedload",
            "value": "",
            "width_xs": 4,
            "width_lg": 2
        },

        {
            "id": "samplingMethod_bottom_QWDATA_CV",
            "label": "Sampling Method",
            "type": "ComputedValue",
            "tabName": "QWDATA",
            "layoutGroup": "QWDATA Info",
            "placeholder": "Select on Field Form page",
            "computationString": "samplingMethod_bottom",
            "value": "",
            "width_xs": 4,
            "width_lg": 2
        },

        {
            "id": "samplingMethod_suspended_QWDATA_CV",
            "label": "Sampling Method",
            "type": "ComputedValue",
            "tabName": "QWDATA",
            "layoutGroup": "QWDATA Info",
            "placeholder": "Select on Field Form page",
            "computationString": "samplingMethod_suspended",
            "value": "",
            "width_xs": 4,
            "width_lg": 2
        },

        {
            "id": "sampleMedium_QWDATA_CV",
            "label": "Sample Medium",
            "type": "ComputedValue",
            "tabName": "QWDATA",
            "layoutGroup": "QWDATA Info",
            "placeholder": "Select on Field Form Page",
            "computationString": "sampleMedium",
            "value": "",
            "width_xs": 4,
            "width_lg": 2
        },

        {
            "id": "QWDATATable",
            "label": "QWDATA Table",
            "type": "QWDATATable",
            "tabName": "QWDATA",
            "layoutGroup": "QWDATA Information",
            "colHeaders": true,
            "rowHeaders": true,
            // "value": [["Set-Sample @ Dist",
            //     "Sample Date",
            //     "Sample Time",
            //     "Hydrologic Event",
            //     "Hydrologic Cond",
            //     "Sample Type",
            //     "ASTAT Code",
            //     "Add-on Analyses",
            //     "M2Lab"],
            // [
            //     "Fill Out Number Of Samples for at least one set",
            //     "",
            //     "",
            //     "",
            //     "",
            //     "",
            //     "",
            //     [],
            //     ""
            // ]
            // ],
            "value":null,
            "width_xs": 12,
            "width_lg": 12
        },

        {
            "id": "parametersTable",
            "label": "Parameters Table",
            "type": "ParametersTable",
            "tabName": "Parameters",
            "layoutGroup": "Parameters",
            "colHeaders": true,
            "rowHeaders": true,
            "value": [[]],
            "width_xs": 12,
            "width_lg": 12
        }]
