import { SUSPENDED_TEXT, BEDLOAD_TEXT, BOTTOM_MATERIAL_TEXT, EVENT_LINK_TABLE_TYPE, STATION_LINK_TABLE_TYPE } from './Dictionary';

export const USER_DB_NODES = ['stations', 'customQuestions'];   //TODO: create a 'settings' node with things like 'usePaper' and 'syncDelay'.  In the future, include other settings like "availableSamplers"

export const SAMPLING_EVENT_IDENTIFIER = "SamplingEvent::";
export const DATA_ENTRY_INFORMATION_IDENTIFIER = "DataEntry::";
export const SET_INFORMATION_IDENTIFIER = "SetInfo::";
export const QWDATA_TABLE_IDENTIFIER = "QWDATATable::"
export const PARAMETERS_TABLE_IDENTIFIER = "ParametersTable::";
export const WATERWAY_INFORMATION_IDENTIFIER = "Waterway::";

export const IDENTIFIER_SPLITTER = "&&";  //for use between identifiers
export const XML_SPLITTER = "_XMLSPLIT_"; //for use when stripping XML tags of superfluous info.  Anything after the splitter will be cut off in final xml.


export const QUESTIONS_DATA_OBJECT_TYPE = "questionsDataObjectType";
export const QUESTIONS_VALUES_OBJECT_TYPE = "questionsValuesObjectType";

export const QWDATA_TABLE_TYPE = "QWDATA_TABLE_TYPE";
export const PARAMETER_TABLE_TYPE = "PARAMETER_TABLE_TYPE";
export const DATA_ENTRY_SHEET_TYPE = "DATA_ENTRY_SHEET_TYPE";

export const DATA_ENTRY_SAMPLES_TABLE_STATIONING_COLUMN_NUMBER = 0;

// export const QUESTION_ID_STRINGS_THAT_FORCE_PROPAGATION = ["numberOfSamplingPoints", "samplesComposited", "pier", "edgeOfSamplingZone"];  //TODO: need to ensure no custom questions include these 

export const QIDS_LINKED_TO_STATION_NAME = ["stationNumber", "projectName", "projectID", "agencyCode"];

export const DEFAULT_HIDDEN_NAVIGATION_TABS = ["FieldForm", "DataEntry", "Parameters", "QWDATA"];
export const DEFAULT_HIDDEN_PANELS = [	"DataEntry:IntakeEfficiencyTest&&DataEntry::"+SUSPENDED_TEXT, "DataEntry:AverageRepresentationalMeasures&&DataEntry::"+SUSPENDED_TEXT,
										"DataEntry:IntakeEfficiencyTest&&DataEntry::"+BEDLOAD_TEXT, "DataEntry:AverageRepresentationalMeasures&&DataEntry::"+BEDLOAD_TEXT,
										"DataEntry:IntakeEfficiencyTest&&DataEntry::"+BOTTOM_MATERIAL_TEXT, "DataEntry:AverageRepresentationalMeasures&&DataEntry::"+BOTTOM_MATERIAL_TEXT];

export const EDI_METHOD_CATEGORY = "EDI";
export const EWI_METHOD_CATEGORY = "EWI";
export const OTHER_METHOD_CATEGORY = "OTHER";

export const DISALLOWED_CHARACTERS_IN_SETNAME_REGEX = /(?:[^a-zA-Z0-9 -]|sngl|Sngl|SNGL)/g;  // sngl could mess with XML stuff
export const PCODE_MATCHING_REGEX = /[P]\d{5}/g;

export const DEFAULT_BACKUP_INTERVAL = 300;

export const PROGRAM_VERSION = "0.6.0";

export const IET_REQUIRING_SAMPLER_TYPE_VALUES = ['3055', '3056', '3057', '3058'];

export const LINK_TABLES = {
	[EVENT_LINK_TABLE_TYPE] : "SamplingEventLinkTable",
	[STATION_LINK_TABLE_TYPE]: "StationLinkTable"
}

export const METHOD_QIDS = {
	[SUSPENDED_TEXT] : 'samplingMethod_Suspended',
	[BEDLOAD_TEXT] : 'samplingMethod_Bedload',
	[BOTTOM_MATERIAL_TEXT] : 'samplingMethod_Bottom'
}

export const defaultHiddenPanels = [
    "DataEntry:IntakeEfficiencyTest"
];

export const SEDIMENT_TYPES = {   //use the key (or the direct value from dictionary for internal type for equality, etc.  Use the value for any sort of UI display.
	[SUSPENDED_TEXT]:"Suspended",
	[BEDLOAD_TEXT]:"Bedload",
	[BOTTOM_MATERIAL_TEXT]:"Bottom Material"
}

export const ACTIONABLE_GLOBAL_QIDS = [
	"samplingMethod_"+SUSPENDED_TEXT,
	"samplingMethod_"+BEDLOAD_TEXT,
	"samplingMethod_"+BOTTOM_MATERIAL_TEXT,
	"collectingAgency",
	"bank",
	"waterwayInfo"
]

export const defaultPCodesToShow = ["P00010", "P00020", "P00061", "P00065", "P00095", "P00300", "P00400"];

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


