import _ from 'lodash';

import {
	CREATE_NEW_SAMPLING_EVENT,
	SE_QUESTION_VALUE_CHANGE,
	ADD_QUESTION_TO_EVENT,
	DELETE_QUESTION_FROM_EVENT,
	SE_QUESTION_VALUE_DELETE,
	SAMPLING_EVENT_BANK_CHANGE
} from '../Constants/ActionTypes';




const initialState = { //MOCK //TODO:
	"695833f2-e483-4c34-a962-d14f79037920": {
		eventID: "695833f2-e483-4c34-a962-d14f79037920",
		eventName: "Event1-JoeAndTom",
		dateModified: "Wed Jan 30 2019 12:44:59 GMT-0600 (Central Standard Time)",
		shippedStatus: "Not Shipped",
		questionsValues: {
			stationName: "station name from values",
			stationNumber: "1value2",
			question3: "1value3"
		}
	},
	"475c42c6-8642-4d0c-a98a-36d5374f00f4": {
		eventID: "475c42c6-8642-4d0c-a98a-36d5374f00f4",
		eventName: "Event2-TomOnly",
		dateModified: "Wed Jan 31 2019 12:44:59 GMT-0600 (Central Standard Time)",
		shippedStatus: "Not Shipped",
		questionsValues: {
			question4: "2value4",
			question5: "2value5",
			question6: "2value6"
		}
	},
	"dd8c3689-d8a8-42ef-bf9f-a52a52f611b8": {
		eventID: "dd8c3689-d8a8-42ef-bf9f-a52a52f611b8",
		eventName: "Event3-JoeOnly",
		dateModified: "Wed Jan 29 2019 12:44:59 GMT-0600 (Central Standard Time)",
		shippedStatus: "Shipped",
		questionsValues: {
			question1: "3value1",
			question2: "3value2",
			question3: "3value3",
			question4: "3value4",
			question5: "3value5",
			question6: "3value6"
		}
	},
    '9076d701-8303-4bb9-8265-630980811838': {
      eventID: '9076d701-8303-4bb9-8265-630980811838',
      eventName: 'Sampling Event on 2019 October 30',
      dateModified: 'Wed Oct 30 2019 09:52:05 GMT-0500 (Central Daylight Time)',
      shippedStatus: 'Not Shipped',
      questionsValues: {
		  bank: "Right Bank",
        samplingMethod_Suspended: '10',
        samplingMethod_Bedload: '50',
        samplingMethod_Bottom: 'Not Sampled',
        timeDatum: 'SITEFILE',
        collectingAgency: 'USGS-WRD',
        samplesComposited: false,
        groupOfSamples: false,
        stationName: 'Station 1 full name at whatever river',
        stationNumber: '1111',
        projectName: 'Default 1Project',
        projectID: 'Default 1ID',
        agencyCode: 'Def1Ag',
        sampleDate: '2019-10-30',
        streamWidth: '',
        'DataEntry::Suspended': {
          samplerType_Suspended: '3004',
          'DataEntry::Suspended&&SetInfo::A': {
            startTime: '11:11',
            endTime: '22:22',
            numberOfSamplingPoints: '3',
            samplesTable_EWI_Suspended: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '5',
                '10',
                ''
              ],
              [
                '20',
                '11',
                ''
              ],
              [
                '35',
                '10',
                ''
              ]
            ],
            analysedFor_Suspended: {
              C: true,
              SF: false,
              SA: false,
              T: false,
              LOI: false,
              DS: false,
              SC: false,
              Z: false
            }
          },
          'DataEntry::Suspended&&SetInfo::B': {
            numberOfSamplingPoints: '3',
            samplesTable_EWI_Suspended: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '1',
                '11',
                ''
              ],
              [
                '2',
                '22',
                ''
              ],
              [
                '3',
                '33',
                ''
              ]
            ],
            analysedFor_Suspended: {
              C: false,
              SF: false,
              SA: false,
              T: false,
              LOI: false,
              DS: false,
              SC: false,
              Z: true
            },
            startTime: '11:22',
            endTime: '22:10'
          }
        },
        'DataEntry::Bedload': {
          'DataEntry::Bedload&&SetInfo::A': {
            numberOfSamplingPoints: '3',
            samplesTable_OTHER_Bedload: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec',
                'Rest time on Bed for Bed load sample, seconds',
                'Horizontal width of Vertical, feet'
              ],
              [
                '6',
                '12',
                '',
                '13',
                ''
              ],
              [
                '21',
                '22',
                '',
                '13',
                ''
              ],
              [
                '36',
                '12',
                '',
                '13',
                ''
              ]
            ],
            analysedFor_Bedload: {
              'Sand-Fine break': false,
              'Sand Analysis': false,
              'Loss-on-ignition': false,
              'Full-size Fractions': false,
              'Fines Only': false,
              SF: true,
              Z: false
            }
          },
          samplerType_Bedload: '1100',
          bagMaterial: 'Plastic',
          sizeOfBag: '3 Liter'
        },
        hydrologicEvent: '1',
        hydrologicCondition: '4',
        analysisStatus: 'U',
        'QWDATATable::Suspended': [
          [
            'Set-Sample @ Dist',
            'Sample Date',
            'Sample Time',
            'Hydrologic Event',
            'Hydrologic Cond',
            'Sample Type',
            'ASTAT Code',
            'Add-on Analyses',
            'M2Lab'
          ],
          [
            'A-1 @ 5',
            '',
            '11:11',
            '',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'A-2 @ 20',
            '',
            '16:46',
            '',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'A-3 @ 35',
            '',
            '22:22',
            '',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'B-1 @ 1',
            '',
            '11:22',
            '2',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'B-2 @ 2',
            '',
            '16:46',
            '2',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'B-3 @ 3',
            '',
            '22:10',
            '2',
            '',
            '',
            '',
            '',
            ''
          ]
        ],
        'ParametersTable::Suspended': [
          [
            'Set-Sample @ Dist',
            'P00010_val',
            'P00010_mth',
            'P00010_rmk',
            'P00010_nq',
            'P00020_val',
            'P00020_mth',
            'P00020_rmk',
            'P00020_nq',
            'P00061_val',
            'P00061_mth',
            'P00061_rmk',
            'P00061_nq',
            'P00065_val',
            'P00065_mth',
            'P00065_rmk',
            'P00065_nq',
            'P00095_val',
            'P00095_mth',
            'P00095_rmk',
            'P00095_nq',
            'P00300_val',
            'P00300_mth',
            'P00300_rmk',
            'P00300_nq',
            'P00400_val',
            'P00400_mth',
            'P00400_rmk',
            'P00400_nq'
          ],
          [
            'A-1 @ 5',
            '20',
            '',
            '',
            '',
            '70',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'A-2 @ 20',
            '20',
            '',
            '',
            '',
            '70',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'A-3 @ 35',
            '20',
            '',
            '',
            '',
            '70',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'B-1 @ 1',
            '20',
            '',
            '',
            '',
            '72',
            'G0005',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'B-2 @ 2',
            '20',
            '',
            '',
            '',
            '72',
            'G0005',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'B-3 @ 3',
            '20',
            '',
            '',
            '',
            '72',
            'G0005',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ]
        ],
        'QWDATATable::Bedload': [
          [
            'Set-Sample @ Dist',
            'Sample Date',
            'Sample Time',
            'Hydrologic Event',
            'Hydrologic Cond',
            'Sample Type',
            'ASTAT Code',
            'Add-on Analyses',
            'M2Lab'
          ],
          [
            'A-1 @ 6',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'A-2 @ 21',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'A-3 @ 36',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ]
        ],
        'ParametersTable::Bedload': [
          [
            'Set-Sample @ Dist',
            'P00010_val',
            'P00010_mth',
            'P00010_rmk',
            'P00010_nq',
            'P00020_val',
            'P00020_mth',
            'P00020_rmk',
            'P00020_nq',
            'P00061_val',
            'P00061_mth',
            'P00061_rmk',
            'P00061_nq',
            'P00065_val',
            'P00065_mth',
            'P00065_rmk',
            'P00065_nq',
            'P00095_val',
            'P00095_mth',
            'P00095_rmk',
            'P00095_nq',
            'P00300_val',
            'P00300_mth',
            'P00300_rmk',
            'P00300_nq',
            'P00400_val',
            'P00400_mth',
            'P00400_rmk',
            'P00400_nq'
          ],
          [
            'A-1 @ 6',
            '',
            '',
            '',
            '',
            '70',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'A-2 @ 21',
            '',
            '',
            '',
            '',
            '70',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ],
          [
            'A-3 @ 36',
            '',
            '',
            '',
            '',
            '70',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
          ]
        ]
      },
      questionsData: {
        'DataEntry::Suspended&&SetInfo::A': {
          id: 'DataEntry::Suspended&&SetInfo::A',
          label: 'Set Information',
          setName: 'A',
          type: 'SetInformation',
          includeBlank: true,
          tabName: 'Data Entry',
          layoutGroup: 'Set A',
          width_xs: 12,
          width_lg: 12,
          options: {},
          value: {},
          startTime: {
            id: 'startTime',
            label: 'Start Time',
            type: 'TimeInput',
            value: '',
            width_xs: 5,
            width_lg: 2
          },
          endTime: {
            id: 'endTime',
            label: 'End Time',
            type: 'TimeInput',
            value: '',
            width_xs: 5,
            width_lg: 2
          },
          startGageHeight: {
            id: 'startGageHeight',
            label: 'Start Gage Ht',
            placeholder: 'feet',
            type: 'Text',
            value: '',
            width_xs: 3,
            width_lg: 2
          },
          endGageHeight: {
            id: 'endGageHeight',
            label: 'End Gage Ht',
            placeholder: 'feet',
            type: 'Text',
            value: '',
            width_xs: 3,
            width_lg: 2
          },
          numberOfSamplingPoints: {
            id: 'numberOfSamplingPoints',
            value: '',
            label: 'Sampling Points',
            type: 'Text',
            placeholder: 'Number of Points',
            width_xs: 3,
            width_lg: 3,
            actions: {
              anyValue: 'ShowTab::QWDATA'
            }
          },
          numberOfContainers: {
            id: 'numberOfContainers',
            label: 'Number Of Containers',
            type: 'Text',
            value: '',
            width_xs: 3,
            width_lg: 4
          },
          samplesComposited: {
            id: 'samplesComposited',
            label: 'Samples Composited',
            XMLTag: 'AnalyzeIndSamples',
            type: 'Toggle',
            checkbox: true,
            value: false,
            width_xs: 4,
            width_lg: 3
          },
          groupOfSamples: {
            id: 'groupOfSamples',
            label: 'This is a group of samples',
            type: 'Toggle',
            checkbox: true,
            value: false,
            width_xs: 4,
            width_lg: 3,
            actions: {
              true: 'HideQuestion::showSetB&SetValue::setA_samplesComposited:false',
              false: 'ShowQuestion::showSetB'
            }
          },
          samplesTable_EDI_Bedload: {
            id: 'samplesTable_EDI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            invalidMessage: 'Must input number of samples before table will display',
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec',
                'Rest time on Bed for Bedload sample,seconds',
                'Horizontal width of Vertical, feet'
              ],
              [
                '',
                '',
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EWI_Bedload: {
            id: 'samplesTable_EWI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec',
                'Rest time on Bed for Bedload sample, seconds',
                'Horizontal width of Vertical, feet'
              ],
              [
                '',
                '',
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_OTHER_Bedload: {
            id: 'samplesTable_OTHER',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec',
                'Rest time on Bed for Bed load sample, seconds',
                'Horizontal width of Vertical, feet'
              ],
              [
                '',
                '',
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EDI_Bottom: {
            id: 'samplesTable_EDI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            invalidMessage: 'Must input number of samples before table will display',
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EWI_Bottom: {
            id: 'samplesTable_EWI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_OTHER_Bottom: {
            id: 'samplesTable_OTHER',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EDI_Suspended: {
            id: 'samplesTable_EDI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            invalidMessage: 'Must input number of samples before table will display',
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EWI_Suspended: {
            id: 'samplesTable_EWI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_OTHER_Suspended: {
            id: 'samplesTable_OTHER',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          analysedFor_Bedload: {
            id: 'analysedFor_Bedload',
            label: 'Analyze Set/Group for',
            XMLTag: 'Analyses',
            type: 'MultipleChoice',
            options: {
              'Sand-Fine break': 'SF',
              'Sand Analysis': 'SA',
              'Loss-on-ignition': 'LOI',
              'Full-size Fractions*': 'Z',
              'Fines Only': 'FO'
            },
            value: {
              'Sand-Fine break': false,
              'Sand Analysis': false,
              'Loss-on-ignition': false,
              'Full-size Fractions': false,
              'Fines Only': false
            },
            width_xs: 2,
            width_lg: 2
          },
          analysedFor_Bottom: {
            id: 'analysedFor_Bottom',
            label: 'Analyze Set/Group for',
            XMLTag: 'Analyses',
            type: 'MultipleChoice',
            options: {
              'Sand-Fine break*': 'SF',
              'Fines Only': 'FO',
              'Sand Analysis*': 'SA',
              'Loss-on-ignition*': 'LOI',
              'Bulk Density': 'BD',
              'Full-size Fractions*': 'Z'
            },
            value: {
              'Sand-Fine break': false,
              'Fines Only': false,
              'Sand Analysis': false,
              'Loss-on-ignition': false,
              'Bulk Density': false,
              'Full-size Fractions': false
            },
            width_xs: 2,
            width_lg: 2
          },
          analysedFor_Suspended: {
            id: 'analysedFor_Suspended',
            label: 'Analyze Set/Group for',
            XMLTag: 'Analyses',
            type: 'MultipleChoice',
            helperText: '* possible add-on analysis for individual samples.',
            options: {
              Concentration: 'C',
              'Sand-Fine break*': 'SF',
              'Sand Analysis*': 'SA',
              Turbidity: 'T',
              'Loss-on-ignition*': 'LOI',
              'Dissolved Solids': 'DS',
              'Specific Conductance': 'SC',
              'Full-size Fractions*': 'Z'
            },
            value: {
              C: false,
              SF: false,
              SA: false,
              T: false,
              LOI: false,
              DS: false,
              SC: false,
              Z: false
            },
            width_xs: 2,
            width_lg: 2
          }
        },
        'DataEntry::Bedload&&SetInfo::A': {
          id: 'DataEntry::Bedload&&SetInfo::A',
          label: 'Set Information',
          setName: 'A',
          type: 'SetInformation',
          includeBlank: true,
          tabName: 'Data Entry',
          layoutGroup: 'Set A',
          width_xs: 12,
          width_lg: 12,
          options: {},
          value: {},
          startTime: {
            id: 'startTime',
            label: 'Start Time',
            type: 'TimeInput',
            value: '',
            width_xs: 5,
            width_lg: 2
          },
          endTime: {
            id: 'endTime',
            label: 'End Time',
            type: 'TimeInput',
            value: '',
            width_xs: 5,
            width_lg: 2
          },
          startGageHeight: {
            id: 'startGageHeight',
            label: 'Start Gage Ht',
            placeholder: 'feet',
            type: 'Text',
            value: '',
            width_xs: 3,
            width_lg: 2
          },
          endGageHeight: {
            id: 'endGageHeight',
            label: 'End Gage Ht',
            placeholder: 'feet',
            type: 'Text',
            value: '',
            width_xs: 3,
            width_lg: 2
          },
          numberOfSamplingPoints: {
            id: 'numberOfSamplingPoints',
            value: '',
            label: 'Sampling Points',
            type: 'Text',
            placeholder: 'Number of Points',
            width_xs: 3,
            width_lg: 3,
            actions: {
              anyValue: 'ShowTab::QWDATA'
            }
          },
          numberOfContainers: {
            id: 'numberOfContainers',
            label: 'Number Of Containers',
            type: 'Text',
            value: '',
            width_xs: 3,
            width_lg: 4
          },
          samplesComposited: {
            id: 'samplesComposited',
            label: 'Samples Composited',
            XMLTag: 'AnalyzeIndSamples',
            type: 'Toggle',
            checkbox: true,
            value: false,
            width_xs: 4,
            width_lg: 3
          },
          groupOfSamples: {
            id: 'groupOfSamples',
            label: 'This is a group of samples',
            type: 'Toggle',
            checkbox: true,
            value: false,
            width_xs: 4,
            width_lg: 3,
            actions: {
              true: 'HideQuestion::showSetB&SetValue::setA_samplesComposited:false',
              false: 'ShowQuestion::showSetB'
            }
          },
          samplesTable_EDI_Bedload: {
            id: 'samplesTable_EDI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            invalidMessage: 'Must input number of samples before table will display',
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec',
                'Rest time on Bed for Bedload sample,seconds',
                'Horizontal width of Vertical, feet'
              ],
              [
                '',
                '',
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EWI_Bedload: {
            id: 'samplesTable_EWI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec',
                'Rest time on Bed for Bedload sample, seconds',
                'Horizontal width of Vertical, feet'
              ],
              [
                '',
                '',
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_OTHER_Bedload: {
            id: 'samplesTable_OTHER',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec',
                'Rest time on Bed for Bed load sample, seconds',
                'Horizontal width of Vertical, feet'
              ],
              [
                '',
                '',
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EDI_Bottom: {
            id: 'samplesTable_EDI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            invalidMessage: 'Must input number of samples before table will display',
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EWI_Bottom: {
            id: 'samplesTable_EWI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_OTHER_Bottom: {
            id: 'samplesTable_OTHER',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EDI_Suspended: {
            id: 'samplesTable_EDI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            invalidMessage: 'Must input number of samples before table will display',
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EWI_Suspended: {
            id: 'samplesTable_EWI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_OTHER_Suspended: {
            id: 'samplesTable_OTHER',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          analysedFor_Bedload: {
            id: 'analysedFor_Bedload',
            label: 'Analyze Set/Group for',
            XMLTag: 'Analyses',
            type: 'MultipleChoice',
            options: {
              'Sand-Fine break': 'SF',
              'Sand Analysis': 'SA',
              'Loss-on-ignition': 'LOI',
              'Full-size Fractions*': 'Z',
              'Fines Only': 'FO'
            },
            value: {
              'Sand-Fine break': false,
              'Sand Analysis': false,
              'Loss-on-ignition': false,
              'Full-size Fractions': false,
              'Fines Only': false
            },
            width_xs: 2,
            width_lg: 2
          },
          analysedFor_Bottom: {
            id: 'analysedFor_Bottom',
            label: 'Analyze Set/Group for',
            XMLTag: 'Analyses',
            type: 'MultipleChoice',
            options: {
              'Sand-Fine break*': 'SF',
              'Fines Only': 'FO',
              'Sand Analysis*': 'SA',
              'Loss-on-ignition*': 'LOI',
              'Bulk Density': 'BD',
              'Full-size Fractions*': 'Z'
            },
            value: {
              'Sand-Fine break': false,
              'Fines Only': false,
              'Sand Analysis': false,
              'Loss-on-ignition': false,
              'Bulk Density': false,
              'Full-size Fractions': false
            },
            width_xs: 2,
            width_lg: 2
          },
          analysedFor_Suspended: {
            id: 'analysedFor_Suspended',
            label: 'Analyze Set/Group for',
            XMLTag: 'Analyses',
            type: 'MultipleChoice',
            helperText: '* possible add-on analysis for individual samples.',
            options: {
              Concentration: 'C',
              'Sand-Fine break*': 'SF',
              'Sand Analysis*': 'SA',
              Turbidity: 'T',
              'Loss-on-ignition*': 'LOI',
              'Dissolved Solids': 'DS',
              'Specific Conductance': 'SC',
              'Full-size Fractions*': 'Z'
            },
            value: {
              C: false,
              SF: false,
              SA: false,
              T: false,
              LOI: false,
              DS: false,
              SC: false,
              Z: false
            },
            width_xs: 2,
            width_lg: 2
          }
        },
        'DataEntry::Suspended&&SetInfo::B': {
          id: 'DataEntry::Suspended&&SetInfo::B',
          label: 'Set Information',
          setName: 'B',
          type: 'SetInformation',
          includeBlank: true,
          tabName: 'Data Entry',
          layoutGroup: 'Set B',
          width_xs: 12,
          width_lg: 12,
          options: {},
          value: {},
          startTime: {
            id: 'startTime',
            label: 'Start Time',
            type: 'TimeInput',
            value: '',
            width_xs: 5,
            width_lg: 2
          },
          endTime: {
            id: 'endTime',
            label: 'End Time',
            type: 'TimeInput',
            value: '',
            width_xs: 5,
            width_lg: 2
          },
          startGageHeight: {
            id: 'startGageHeight',
            label: 'Start Gage Ht',
            placeholder: 'feet',
            type: 'Text',
            value: '',
            width_xs: 3,
            width_lg: 2
          },
          endGageHeight: {
            id: 'endGageHeight',
            label: 'End Gage Ht',
            placeholder: 'feet',
            type: 'Text',
            value: '',
            width_xs: 3,
            width_lg: 2
          },
          numberOfSamplingPoints: {
            id: 'numberOfSamplingPoints',
            value: '',
            label: 'Sampling Points',
            type: 'Text',
            placeholder: 'Number of Points',
            width_xs: 3,
            width_lg: 3,
            actions: {
              anyValue: 'ShowTab::QWDATA'
            }
          },
          numberOfContainers: {
            id: 'numberOfContainers',
            label: 'Number Of Containers',
            type: 'Text',
            value: '',
            width_xs: 3,
            width_lg: 4
          },
          samplesComposited: {
            id: 'samplesComposited',
            label: 'Samples Composited',
            XMLTag: 'AnalyzeIndSamples',
            type: 'Toggle',
            checkbox: true,
            value: false,
            width_xs: 4,
            width_lg: 3
          },
          groupOfSamples: {
            id: 'groupOfSamples',
            label: 'This is a group of samples',
            type: 'Toggle',
            checkbox: true,
            value: false,
            width_xs: 4,
            width_lg: 3,
            actions: {
              true: 'HideQuestion::showSetB&SetValue::setA_samplesComposited:false',
              false: 'ShowQuestion::showSetB'
            }
          },
          samplesTable_EDI_Bedload: {
            id: 'samplesTable_EDI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            invalidMessage: 'Must input number of samples before table will display',
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec',
                'Rest time on Bed for Bedload sample,seconds',
                'Horizontal width of Vertical, feet'
              ],
              [
                '',
                '',
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EWI_Bedload: {
            id: 'samplesTable_EWI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec',
                'Rest time on Bed for Bedload sample, seconds',
                'Horizontal width of Vertical, feet'
              ],
              [
                '',
                '',
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_OTHER_Bedload: {
            id: 'samplesTable_OTHER',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec',
                'Rest time on Bed for Bed load sample, seconds',
                'Horizontal width of Vertical, feet'
              ],
              [
                '',
                '',
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EDI_Bottom: {
            id: 'samplesTable_EDI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            invalidMessage: 'Must input number of samples before table will display',
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EWI_Bottom: {
            id: 'samplesTable_EWI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_OTHER_Bottom: {
            id: 'samplesTable_OTHER',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EDI_Suspended: {
            id: 'samplesTable_EDI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            invalidMessage: 'Must input number of samples before table will display',
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_EWI_Suspended: {
            id: 'samplesTable_EWI',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          samplesTable_OTHER_Suspended: {
            id: 'samplesTable_OTHER',
            label: 'Samples Table',
            type: 'TableInput',
            colHeaders: true,
            rowHeaders: false,
            value: [
              [
                'Distance from L bank, feet',
                'Sampling Depth, feet',
                'Transit Rate, ft / sec'
              ],
              [
                '',
                '',
                ''
              ]
            ],
            width_xs: 10,
            width_lg: 10
          },
          analysedFor_Bedload: {
            id: 'analysedFor_Bedload',
            label: 'Analyze Set/Group for',
            XMLTag: 'Analyses',
            type: 'MultipleChoice',
            options: {
              'Sand-Fine break': 'SF',
              'Sand Analysis': 'SA',
              'Loss-on-ignition': 'LOI',
              'Full-size Fractions*': 'Z',
              'Fines Only': 'FO'
            },
            value: {
              'Sand-Fine break': false,
              'Sand Analysis': false,
              'Loss-on-ignition': false,
              'Full-size Fractions': false,
              'Fines Only': false
            },
            width_xs: 2,
            width_lg: 2
          },
          analysedFor_Bottom: {
            id: 'analysedFor_Bottom',
            label: 'Analyze Set/Group for',
            XMLTag: 'Analyses',
            type: 'MultipleChoice',
            options: {
              'Sand-Fine break*': 'SF',
              'Fines Only': 'FO',
              'Sand Analysis*': 'SA',
              'Loss-on-ignition*': 'LOI',
              'Bulk Density': 'BD',
              'Full-size Fractions*': 'Z'
            },
            value: {
              'Sand-Fine break': false,
              'Fines Only': false,
              'Sand Analysis': false,
              'Loss-on-ignition': false,
              'Bulk Density': false,
              'Full-size Fractions': false
            },
            width_xs: 2,
            width_lg: 2
          },
          analysedFor_Suspended: {
            id: 'analysedFor_Suspended',
            label: 'Analyze Set/Group for',
            XMLTag: 'Analyses',
            type: 'MultipleChoice',
            helperText: '* possible add-on analysis for individual samples.',
            options: {
              Concentration: 'C',
              'Sand-Fine break*': 'SF',
              'Sand Analysis*': 'SA',
              Turbidity: 'T',
              'Loss-on-ignition*': 'LOI',
              'Dissolved Solids': 'DS',
              'Specific Conductance': 'SC',
              'Full-size Fractions*': 'Z'
            },
            value: {
              C: false,
              SF: false,
              SA: false,
              T: false,
              LOI: false,
              DS: false,
              SC: false,
              Z: false
            },
            width_xs: 2,
            width_lg: 2
          }
        }
      }
    }
}





export function SamplingEvents(state = initialState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case CREATE_NEW_SAMPLING_EVENT:
			newState[action.event.eventID] = action.event;
			return newState;
		case SE_QUESTION_VALUE_CHANGE:
			newState[action.eventID].questionsValues[action.questionID] = action.newValue;
			return newState;
		case SE_QUESTION_VALUE_DELETE:
			delete newState[action.eventID].questionsValues[action.questionID];
			return newState;
		case ADD_QUESTION_TO_EVENT:
			newState[action.eventID].questionsData[action.question.id] = action.question;
			return newState;
		case DELETE_QUESTION_FROM_EVENT:
			delete newState[action.eventID].questionsData[action.QID];
			return newState;
		case SAMPLING_EVENT_BANK_CHANGE:
			newState[action.eventID].waterwayInfo.bank = action.bank;
			return newState;
		default:
			return state;
	}
}
