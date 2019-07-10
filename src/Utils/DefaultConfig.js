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


