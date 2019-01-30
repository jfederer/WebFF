import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


import { styles } from '../style';
import 'typeface-roboto';
import {
	Route,
	Switch
} from 'react-router-dom';

import { isReasonablyValidUsernameInLS, isReasonableUsername, ensureProgramVersionUpToDate } from '../Utils/ValidationUtilities';

import { questionsData, dialogQuestions, defaultHiddenTabs, defaultHiddenPanels } from '../Utils/DefaultConfig';
import {
	USER_DB_NODES, SAMPLING_EVENT_IDENTIFIER,
	QUESTION_ID_STRINGS_THAT_FORCE_PROPAGATION, MAX_NUM_OF_SETS, QIDS_LINKED_TO_STATION_NAME
} from '../Utils/Constants';   //TODO: create a 'settings' node with things like 'usePaper' and 'syncDelay'.  In the future, include other settings like "availableSamplers" } from '../Utils/Constants';


import { setSysMenuExpand, setNavMenuExpand, setLoginDialogVisibility } from '../Actions/UI';
import { setCurrentUser, loadUserData, loadUserDataToo } from '../Actions/SedFF';


//dialogs
import ExportDialog from './Dialogs/ExportDialog';
import SwitchUserDialog from './Dialogs/SwitchUserDialog';
import SettingsDialog from './Dialogs/SettingsDialog';
import AboutDialog from './Dialogs/AboutDialog';
import AddRemoveQuestionDialog from './Dialogs/AddRemoveQuestionDialog';
import AddRemoveStationDialog from './Dialogs/AddRemoveStationDialog';

// menus 
import SystemMenu from './Menus/SystemMenu.js';
import NavMenu from './Menus/NavMenu.js';

// pages
import Dashboard from './Pages/Dashboard';
import FieldForm from './Pages/FieldForm';
import DataEntry from './Pages/DataEntry';
import Parameters from './Pages/Parameters';
import QWDATA from './Pages/QWDATA';
import ErrorPage from './Errors/ErrorPage';



const FUNCDEBUG = false;

var needToSyncStationDataToQuestionData = true;

class WebFF extends React.Component {

	constructor(props) {
		if (FUNCDEBUG) console.log("FUNC: WebFF Constructor");

		super(props);
		var allItemsToSyncToLS = USER_DB_NODES.slice();
		
		allItemsToSyncToLS.push("loggedInUser", "curSamplingEventName", "needsToUpdateDB");

		this.state = {

			// system config
			questionsData: questionsData,
			dialogQuestions: dialogQuestions,

			itemsToSyncToLS: allItemsToSyncToLS,

			syncIntervalFunction: null,

			itemsLoaded: [],
			usePaper: false,
			syncDelay: 300000,

			questionDialogOpen: false,

			dialogValues: {},
			dialogOpen: false,
			curDialogDescription: "",
			curDialogName: "",
			curDialogQuestions: [],

			defaultQuestionsData: questionsData.slice(),

			hiddenTabs: defaultHiddenTabs,
			hiddenPanels: defaultHiddenPanels,

			appBarText: "Sediment Field Forms",

			stations: [],
			customQuestions: [],

			// loggedInUser:
			needsToUpdateDB: (localStorage.getItem('needsToUpdateDB')) ? JSON.parse(localStorage.getItem('needsToUpdateDB')) : [],
			curSamplingEventName: JSON.parse(localStorage.getItem('curSamplingEventName')) //TODO: multiple reloads mess this up if it starts null

		};

		if (isReasonablyValidUsernameInLS()) {
			// load all events from LS if the user is logged in. // TODO: this is a kludge bugfix for when people refresh the page
			let allNodeNames = Object.keys(localStorage);
			for (let i = 0; i < allNodeNames.length; i++) {
				if (allNodeNames[i].startsWith(SAMPLING_EVENT_IDENTIFIER)) {
					let SE = JSON.parse(localStorage.getItem(allNodeNames[i]));
					if (SE.user === this.state.loggedInUser) {
						this.state[allNodeNames[i]] = SE;
					}
				}
			}
		}

		// 	this.navigationControl = this.navigationControl.bind(this);
		// 	this.handleDialogOpen = this.handleDialogOpen.bind(this);
		// 	// this.handleSystemMenuItemClicked = this.handleSystemMenuItemClicked.bind(this);
		// 	this.questionChangeSystemCallback = this.questionChangeSystemCallback.bind(this);
		// 	this.dialogQuestionChangeSystemCallback = this.dialogQuestionChangeSystemCallback.bind(this);
		// 	this.setLoggedInUser = this.setLoggedInUser.bind(this);
		// 	this.addStation = this.addStation.bind(this);
		// 	this.removeStation = this.removeStation.bind(this);
		// 	this.createNewSamplingEvent = this.createNewSamplingEvent.bind(this);
		// 	this.loadSamplingEvent = this.loadSamplingEvent.bind(this);
		// 	this.getQuestionValueFromEvent = this.getQuestionValueFromEvent.bind(this);
		// 	this.getQuestionValue = this.getQuestionValue.bind(this);
		// 	this.getQuestionData = this.getQuestionData.bind(this);
		// 	this.setQuestionValue = this.setQuestionValue.bind(this);
		// 	this.setTableColumn = this.setTableColumn.bind(this);
		// 	this.getEventDetails = this.getEventDetails.bind(this);
		// 	this.deleteSamplingEvent = this.deleteSamplingEvent.bind(this);
		// 	this.getNumberOfSetsInCurrentSamplingEvent = this.getNumberOfSetsInCurrentSamplingEvent.bind(this);
		// 	this.getNumberOfSamplesInSet = this.getNumberOfSamplesInSet.bind(this);
		// 	this.getCurrentSampleEventMethod = this.getCurrentSampleEventMethod.bind(this);  //FUTURE: move all these to a utility class and pass it the global state
		// 	this.getTableQuestionValue = this.getTableQuestionValue.bind(this);  //FUTURE: move all these to a utility class and pass it the global state
		// 	this.setShippedStatus = this.setShippedStatus.bind(this);  //FUTURE: move all these to a utility class and pass it the global state
		// 	this.getSedLOGINcompatibleXML = this.getSedLOGINcompatibleXML.bind(this);  //FUTURE: move all these to a utility class and pass it the global state
		// 	this.getDescriptiveColumnForTable = this.getDescriptiveColumnForTable.bind(this);  //FUTURE: move all these to a utility class and pass it the global state

	}

	//TODO: //FIXME: changes to stream characteritics blanks out value in EWI table
	//TODO: if critical element for Bridge Wizard is removed from Field Form, what should we do?
	//TODO: dynamic pier additions (perhaps do this via an action -- drop down or number input for # of piers.  Cheap, easy, dirty.)
	//TODO: split analysis source code into check boxes
	//TODO: Change labels or any question value as an 'action'.
	//TODO: generalize EWI_setInfo_table
	//TODO: not a fan of just handing around global state.
	//TODO: regex to remove spaces in computation string
	//TODO: computeValue calculate TIME values correctly?
	//TODO: set 'value' of TimeInput questions correctly.
	//TODO: pass state change handlers to dialogs so questions don't yell
	//TODO: table width to contents? Wrap? No wrap but have min size?  Sub-questions and fields need sizes as well.
	//TODO: vertical gridding or vertical panels? (might be able to solve with 'layout table' stuff)
	//TODO: optional column headers for tables
	//TODO: //FIXME: system dialogs need different state change handler because their values are stored elsewhere
	//TODO: Question order priority
	//TODO: read-only columns in table
	//TODO: refactor network tasks to UTIL
	//TODO: standardize tooltips within questions
	//TODO: standardize 'styles' within questions
	//TODO: standardize 'placeholder' within questions
	//TODO: utilize isLoaded to hold off processing until done loading
	//TODO: clear all tables when changing samplingMethod ?
	//TODO: data entry 'table' should be an image or message or something else until sampling point is entered.
	//TODO: allow to 'remove set' (not just hide, but actively remove it so it doesn't end up in xml or anywhere)
	//TODO: add "resetQuestion" action... for helping with sticky values in questionTables


	// }
	componentWillMount() { //FUTURE: could load just the missing parts insted of everything if just a single node is missing
		if (FUNCDEBUG) console.log("FUNC: componentWillMount()");
		// this.setState({ showLoadingApp: true }); //TODO: redux, leading sign, false after load complete.

		if (navigator.onLine) {
			ensureProgramVersionUpToDate();
		}



		if (isReasonableUsername(this.props.user.username)) {
			console.log(this.props.user.username + "is logged in");
			// this.gatherUserConfig(USER_DB_NODES); // after setting loggedInUser, load user configuration);
		} else {
			console.log("No one is logged in... requesting user id");
			// this.buildRoutesAndRenderPages(); // router handles showing the login
		}

		// if (this.state.curSamplingEventName) {  // this is likely a page refresh
		// 	this.setState({ hiddenTabs: [] }); //TODO: KLUDGE
		// } else {
		// 	this.setState({ hiddenTabs: defaultHiddenTabs });
		// }
	}

	// componentWillUpdate(nextProps, nextState) { // when state updates, write it to LS
	// 	// if (FUNCDEBUG) console.log("FUNC: componentWillUpdate(", nextProps, nextState, ")");
	// 	nextState.itemsToSyncToLS.forEach((item) => {
	// 		localStorage.setItem(item, JSON.stringify(nextState[item]));
	// 	});

	// 	// check if "stations" value changed.
	// 	// update options in questionsData appropriately if it did... 
	// 	if (needToSyncStationDataToQuestionData) {
	// 		if (nextState && this.state.questionsData !== nextState.questionData) {
	// 			this.attemptToSyncStationDataToQuestionData();
	// 		}
	// 	}
	// 	if (nextState && this.state.stations !== nextState.stations) {
	// 		//console.log("Stations updated");
	// 		needToSyncStationDataToQuestionData = true;
	// 		this.attemptToSyncStationDataToQuestionData(nextState.stations);
	// 	}
	// }

	// attemptToSyncStationDataToQuestionData(stationsIn) {
	// 	if (FUNCDEBUG) console.log("FUNC: attemptToSyncStationDataToQuestionData(", stationsIn, ")");

	// 	let stationNameQ = this.getQuestionData("stationName");
	// 	if (stationNameQ === null) {
	// 		return;
	// 	}

	// 	let newOptions = {};
	// 	let stationsToSync;
	// 	if (stationsIn) {
	// 		stationsToSync = stationsIn;
	// 	} else {
	// 		stationsToSync = this.state.stations.slice();
	// 	}

	// 	for (let i = 0; stationsToSync !== null && i < stationsToSync.length; i++) {
	// 		newOptions[stationsToSync[i].id] = stationsToSync[i].id;
	// 	}

	// 	this.setQuestionData("deleteStation_stationName", "options", newOptions);
	// 	this.setQuestionData("stationName", "options", newOptions, this.buildRoutesAndRenderPages);

	// 	needToSyncStationDataToQuestionData = false;
	// }


	// buildCombinedQuestionsData(CB) {
	// 	if (FUNCDEBUG) console.log("FUNC: buildCombinedQuestionsData(", CB, ")");
	// 	if (this.state.customQuestions === null || this.state.customQuestions.length === 0) {
	// 		// no custom questions
	// 		return;
	// 	}


	// 	let newQuestionsData = this.state.defaultQuestionsData.slice();
	// 	for (let i = 0; i < this.state.customQuestions.length; i++) {
	// 		// console.log("Looking to add: ", this.state.customQuestions[i]);
	// 		let matchFound = false;
	// 		newQuestionsData.filter((Q) => {
	// 			if (Q.id === this.state.customQuestions[i].id) {
	// 				console.log("Found a match, not adding: ", Q.id);
	// 				matchFound = true;
	// 			}
	// 			return true;
	// 		});
	// 		if (!matchFound) {
	// 			// console.log("pushing");
	// 			newQuestionsData.push(this.state.customQuestions[i]);
	// 		}
	// 	}
	// 	// console.log("Setting: ", newQuestionsData);
	// 	this.setState({ questionsData: newQuestionsData }, () => {
	// 		this.buildRoutesAndRenderPages();
	// 		if (typeof CB === "function") CB();
	// 	});
	// }


	// gatherUserConfig(nodesToGather) {
	// 	if (FUNCDEBUG) console.log("FUNC: gatherUserConfig(", nodesToGather, ")");
	// 	let DEBUG = false;

	// 	// if data is in both DB and LS -- LS version is considered authoritative
	// 	// should not be called unless this.state.loggedInUser is set to something like jfederer@usgs.gov

	// 	//FIXME: likely bug source, as all these setStates happen async...  perhaps find a way to chain/batch them.


	// 	//first, attempt to pull all conifg and sampling event info from DB
	// 	// pull config info from DB
	// 	// TODO: check if online and skip if not.

	// 	if (navigator.onLine) { //TODO: host reachable: https://stackoverflow.com/questions/2384167/check-if-internet-connection-exists-with-javascript
	// 		if (DEBUG) console.log("Online!... going to fetch from DB.");
	// 		this.getUserConfigFromLS(nodesToGather, null, () => console.log("Done gathering from LS, looking at DB"));

	// 		this.fetchDBInfo(this.state.loggedInUser, 'users',
	// 			(JSONresponse) => {
	// 				if (DEBUG) console.log("JSONresponse: ", JSONresponse);

	// 				// check that this user even exists in database
	// 				if (JSONresponse.length > 1) {
	// 					throw new Error("User query for '" + this.state.loggedInUser + "' returned more than one result.  Please contact jfederer@usgs.gov to resolve.");
	// 				}

	// 				if (JSONresponse.length === 0) {
	// 					// this user did not exist in the database - we must create their entry
	// 					this.createNewUser(this.state.loggedInUser);
	// 				};

	// 				if (JSONresponse.length === 1) {
	// 					// this user exists in the database
	// 					let userData = JSONresponse[0];

	// 					//  exact nodesToGather from the user data into nodeArr
	// 					for (let i = 0; i < nodesToGather.length; i++) {
	// 						let nodeArr = [];
	// 						if (DEBUG) console.log("Extracting: ", nodesToGather[i]);

	// 						userData[nodesToGather[i]].forEach((configNode) => {
	// 							if (DEBUG) console.log("userData[" + nodesToGather[i] + "]: ", configNode);
	// 							// yes, this is basically destructing and reconstructing an array.  This is being done for easier error checking in the future. (perhaps not actually easier)
	// 							//TODO: error and duplication checking 
	// 							nodeArr.push(configNode);
	// 						});

	// 						// put nodeArr (the data extracted from userData) into approparite place in state
	// 						this.setState({ [nodesToGather[i]]: nodeArr }, () => {
	// 							this.buildCombinedQuestionsData(() => {
	// 								this.buildRoutesAndRenderPages();
	// 							});
	// 						});
	// 					}

	// 					// pull sampling events from DB response
	// 					let allNodeNames = Object.keys(userData);
	// 					for (let i = 0; i < allNodeNames.length; i++) {
	// 						if (allNodeNames[i].startsWith(SAMPLING_EVENT_IDENTIFIER)) {
	// 							console.log("Attempting to load " + allNodeNames[i] + " from DB.");
	// 							// if (localStorage.getItem(allNodeNames[i])) {
	// 							// 	console.log(allNodeNames[i] + " is in LS.  Ignoring DB values for this.");
	// 							// 	continue;
	// 							// }
	// 							if (userData[allNodeNames[i]].deleted) {
	// 								console.log(allNodeNames[i] + " is a previously-deleted event. Ignoring DB values for this.");
	// 								continue;
	// 							}

	// 							this.conditionallyIngestSE(userData[allNodeNames[i]], () => {
	// 								// this.addToItemsToSyncToLS(allNodeNames[i]);
	// 								this.buildRoutesAndRenderPages();
	// 							});

	// 							// loading Event from DB into LS
	// 							// this.setState({ [allNodeNames[i]]: userData[allNodeNames[i]] }, () => {
	// 							// 	this.addToItemsToSyncToLS(allNodeNames[i]);
	// 							// 	this.buildRoutesAndRenderPages();
	// 							// });
	// 						}
	// 					}
	// 				} // end one user found in DB

	// 				// after loading everything we can from DB 
	// 				// (This is still the callback from the fetchDB call), 
	// 				// let's load everything we can from LS.
	// 				this.getUserConfigFromLS(nodesToGather);
	// 			},
	// 			() => {
	// 				console.warn("Call to DB failed, attempting to gather from LS");
	// 				this.getUserConfigFromLS(nodesToGather)
	// 			}
	// 		); // end fetchDB callback

	// 	} else {
	// 		// not online
	// 		this.getUserConfigFromLS(nodesToGather, null, () => console.log("TODO: redirect to Error page with 'not online and not enough data in LS to function' error"));

	// 	}
	// 	// set syncInterval for database backups
	// 	var syncInterval = setInterval(() => this.updateDatabase(), this.state.syncDelay);
	// 	this.setState({ syncIntervalFunction: syncInterval });
	// }


	// getUserConfigFromLS(nodesToGather, successCB, failureCB) {
	// 	if (FUNCDEBUG) console.log("FUNC: getUserConfigFromLS(", nodesToGather, ")");
	// 	// LS is the 'authoritative version' and will overwrite info that got pulled from DB by default.  //FUTURE: allow reconstruction from DB info via 'settings' panel.
	// 	let DEBUG = false;
	// 	if (DEBUG) console.log("getUserConfigFromLS");
	// 	if (nodesToGather) {
	// 		for (let i = 0; i < nodesToGather.length; i++) {
	// 			console.log("Parsing LS: ", nodesToGather[i]);
	// 			let node = localStorage.getItem(nodesToGather[i]);
	// 			if (!node || node !== "null" || node !== [] || node.length !== 0) {
	// 				this.setState({
	// 					[nodesToGather[i]]: JSON.parse(localStorage.getItem(nodesToGather[i]))
	// 				}, () => {

	// 					this.buildCombinedQuestionsData(() => {
	// 						this.buildRoutesAndRenderPages();
	// 					});
	// 				});
	// 			} else {
	// 				failureCB;
	// 			}
	// 		}
	// 	}
	// 	// see what sampling events might be in LS and add them to our list of samplingEvents:
	// 	this.loadSamplingEventsFromLS();

	// }

	// loadSamplingEventsFromLS() {
	// 	if (FUNCDEBUG) console.log("FUNC: loadSamplingEventsFromLS()");

	// 	let allNodeNames = Object.keys(localStorage);
	// 	for (let i = 0; i < allNodeNames.length; i++) {
	// 		if (allNodeNames[i].startsWith(SAMPLING_EVENT_IDENTIFIER)) {
	// 			let SE = JSON.parse(localStorage.getItem(allNodeNames[i]));
	// 			if (SE.user === this.state.loggedInUser) {
	// 				// SE is reasonable.  Check if it should be added
	// 				console.log("Attempting to load " + allNodeNames[i] + " from Local Storage.");
	// 				this.conditionallyIngestSE(SE);
	// 			}
	// 		}
	// 	}
	// }

	// conditionallyIngestSE(SE, CB) {
	// 	let shouldAdd = false;
	// 	let reason = "";
	// 	if (!this.state[SAMPLING_EVENT_IDENTIFIER + SE.id]) { // if this event isn't already loaded, load it
	// 		console.log("Event not in state, loading.");
	// 		shouldAdd = true;
	// 	} else {
	// 		reason += "Event already existed in state and "
	// 		// this event is already loaded, see which is newer
	// 		if (!this.state[SAMPLING_EVENT_IDENTIFIER + SE.id].dateModified) { // if existing event does not have modified date, overwrite it (it's likely old and/or mal-formed, overwrite it)
	// 			console.log("the sampling event in state has no modified date, loading");
	// 			shouldAdd = true;
	// 		} else {
	// 			let LSModDate = new Date(SE.dateModified);
	// 			let ExistModDate = new Date(this.state[SAMPLING_EVENT_IDENTIFIER + SE.id].dateModified);
	// 			if (LSModDate > ExistModDate) { // if the version in LS is newer, load that
	// 				shouldAdd = true;
	// 			} else {
	// 				reason += "the event was not newer";
	// 			}
	// 		}
	// 	}

	// 	if (shouldAdd) {
	// 		this.setState({
	// 			[SAMPLING_EVENT_IDENTIFIER + SE.id]: SE
	// 		}, () => {
	// 			this.addToItemsToSyncToLS(SAMPLING_EVENT_IDENTIFIER + SE.id);
	// 			if (typeof CB === "function") CB();
	// 		});
	// 	} else {
	// 		console.log("Not loading ", SE.id, " because " + reason);
	// 		this.addToItemsToSyncToLS(SAMPLING_EVENT_IDENTIFIER + SE.id);
	// 	}
	// }

	// createNewUser(username) {
	// 	console.warn("Creating a new user must be done online"); //TODO: allow this to be done offline
	// 	//TODO: probably okay to just do this in LS and then add it to the sync list
	// 	this.updateDBInfo("id", username, { "stations": [], "customQuestions": [] });
	// }


	// deleteSamplingEvent(eventName) {
	// 	if (FUNCDEBUG) console.log("FUNC: deleteSamplingEvent(", eventName, ")");
	// 	let newEvent = safeCopy(this.state[eventName]);
	// 	newEvent.deleted = true;
	// 	this.setState({ [eventName]: newEvent }, () => {
	// 		this.markForDBUpdate(eventName);

	// 		//TODO: directly update sampling events list?

	// 		this.buildRoutesAndRenderPages();
	// 	}
	// 	);

	// }

	// createNewSamplingEvent(optionalName, CB) {
	// 	// console.log("TRACK DATE: createNewSamplingEvent:");
	// 	if (FUNCDEBUG) console.log("FUNC: createNewSamplingEvent(", optionalName, ")");
	// 	let newSamplingEventID = optionalName;

	// 	if (!newSamplingEventID) {
	// 		newSamplingEventID = this.getDateTimeString();
	// 	}

	// 	let samplingEventName = SAMPLING_EVENT_IDENTIFIER + newSamplingEventID;

	// 	// load initial values from questionsData  
	// 	//FUTURE: needed?  Could just write them as they are needed rather than writing a bunch that might never get used
	// 	let newQuestionsValues = {};
	// 	this.state.questionsData.forEach((Q, i) => {
	// 		newQuestionsValues[Q.id] = safeCopy(Q.value);
	// 	});

	// 	let newSamplingEvent = {
	// 		id: newSamplingEventID,
	// 		user: this.state.loggedInUser,
	// 		shippedStatus: false,
	// 		questionsValues: newQuestionsValues,
	// 		dateModified: new Date().toString()
	// 	}


	// 	//ensure this sampling event will be sync'd to LS
	// 	this.addToItemsToSyncToLS(samplingEventName);

	// 	// console.log("TRACK DATE: createNewSamplingEvent: NEW SE sampleDate: ", newSamplingEvent.questionsValues.sampleDate);


	// 	//save it to the state  
	// 	this.setState({
	// 		[samplingEventName]: newSamplingEvent,
	// 		curSamplingEventName: samplingEventName,
	// 		hiddenTabs: defaultHiddenTabs.slice(),
	// 		hiddenPanels: defaultHiddenPanels.slice()
	// 	}, () => {

	// 		// console.log("TRACK DATE: NEW SE IN STATE: ", this.state[samplingEventName].questionsValues.sampleDate);

	// 		this.runAllActionsForCurrentSamplingEvent();
	// 		// this.collectRunAndPropagateSamplePointData();
	// 		this.markForDBUpdate(samplingEventName);  //TODO: move this to after setState completes?
	// 		this.buildRoutesAndRenderPages(); //TODO: move this to after setState completes?
	// 		if (typeof CB === "function") CB();
	// 	});



	// }


	// fetchDBInfo(_query, _collection, successCB, failureCB) {


	// 	const DEBUG = true;
	// 	if (DEBUG) console.log("fetchDBInfo(", _query, ", ", _collection, ")");

	// 	// sort out differences in local dev server and production server calls
	// 	const API = PHP_FILE_LOCATION + 'dbFetch.php/';
	// 	let query = '';

	// 	if (_query !== '') {
	// 		query = 'needleID=' + encodeURIComponent(_query);
	// 	}

	// 	if (_collection !== '') {
	// 		if (query !== '') {
	// 			query += '&';
	// 		}
	// 		query += "collection=" + _collection;
	// 	}

	// 	// if (isDEV) {
	// 	// 	const API = 'https://localhost:3004/';
	// 	// 	query = encodeURIComponent(_query);
	// 	// }

	// 	function handleErrors(response) {
	// 		// fetch only throws an error if there is a networking or permission problem (often due to offline).  A "ok" response indicates we actually got the info
	// 		if (!response.ok) {
	// 			throw Error(response.statusText);
	// 		}
	// 		//note 404 is not found and 400 is a mal-formed request
	// 		return response;
	// 	}

	// 	if (DEBUG) console.log("Function: fetchDBInfo @ " + API + query);
	// 	fetch(API, {
	// 		method: 'POST',
	// 		headers: new Headers({
	// 			'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
	// 		}),
	// 		body: query
	// 	})
	// 		.then(handleErrors)
	// 		.then(response =>
	// 			response.json()
	// 			//  response.text()
	// 		)
	// 		.then(parsedJSON => {
	// 			if (DEBUG) console.log("Parsed JSON: ", parsedJSON);
	// 			// // setTimeout(() => {
	// 			successCB(parsedJSON);
	// 			// }, 1200);
	// 		})
	// 		// .catch(error => {  });
	// 		.catch(error => {
	// 			console.log(failureCB);
	// 			if (typeof failureCB === "function") {
	// 				failureCB(error);
	// 			}
	// 			else {
	// 				console.error("Error fetching " + API + query + "\n" + error);
	// 			}
	// 		});
	// }

	// handleDialogOpen() {
	// 	this.setState({ dialogOpen: true });
	// };

	// handleDialogClose = () => {
	// 	this.setState({ dialogOpen: false });
	// };

	// handleQuestionDialogOpen = (CB) => {
	// 	this.setState({ questionDialogOpen: true }, () => {
	// 		if (typeof CB === "function") {
	// 			CB();
	// 		}
	// 	});
	// }

	// handleQuestionDialogClose = () => {
	// 	this.setState({ questionDialogOpen: false });
	// }


	// actionExecuter = (actionString) => { //****   //performance - are we building routes and needlessly rendering pages?
	// 	//actionString: string in format: 'ACTION_NAME::PARAMETER' where...
	// 	//   ACTION_NAME is one of the switch options below and
	// 	//   PARAMETER is the parameter string to said action, generally this will be a questionID, though panels are identified like PAGENAME:PANELNAME.
	// 	// note, actionExecuter does NOT check for validity of the PARAMETER part of the actionString.
	// 	// void return
	// 	// note, does not throw errors and instead only warns.  

	// 	// if (true) console.log("actionExecuter(", actionString, ")");
	// 	let splitActionString = actionString.split('::');
	// 	if (splitActionString.length !== 2) {
	// 		console.warn("Requested action string '" + actionString + "' is malformed.  Must only have one '::' per action.  Separate actions with '&'.");
	// 	}
	// 	switch (splitActionString[0]) {
	// 		case "ShowTab":
	// 			this.showTabOrPanel(splitActionString[1], true, true, this.buildRoutesAndRenderPages);
	// 			break;
	// 		case "HideTab":
	// 			this.showTabOrPanel(splitActionString[1], false, true, this.buildRoutesAndRenderPages);
	// 			break;
	// 		case "ShowQuestion":
	// 			this.showQuestion(splitActionString[1], true);
	// 			this.buildRoutesAndRenderPages();
	// 			break;
	// 		case "HideQuestion":
	// 			this.showQuestion(splitActionString[1], false);
	// 			this.buildRoutesAndRenderPages();
	// 			break;
	// 		case "ShowPanel":
	// 			this.showTabOrPanel(splitActionString[1], true, false, this.buildRoutesAndRenderPages);
	// 			break;
	// 		case "HidePanel":
	// 			this.showTabOrPanel(splitActionString[1], false, false, this.buildRoutesAndRenderPages);
	// 			break;
	// 		case "AddRowToTable":
	// 			this.updateNumRowsOfTable(splitActionString[1], 1);
	// 			break;
	// 		case "RemoveRowFromTable":
	// 			this.updateNumRowsOfTable(splitActionString[1], -1);
	// 			break;
	// 		case "AddColumnToTable":
	// 			this.addColumnToTable(splitActionString[1]);
	// 			break;
	// 		case "RemoveColumnFromTable":
	// 			this.removeColumnFromTable(splitActionString[1]);
	// 			break;
	// 		case "SetValue":
	// 			let qid = splitActionString[1].split(":")[0];
	// 			let val = splitActionString[1].split(":")[1];

	// 			this.setQuestionValue(qid, val, () => console.log("Set Value!"));
	// 			break;
	// 		default:
	// 			console.warn("Requested action '" + splitActionString[0] + "' not recognized");
	// 	}
	// }

	// updateNumRowsOfTable(q_id, numToAdd, CB) {
	// 	//q_id: questionID of the table
	// 	//numToAdd: number of rows to add to the table. If a negative value is passed, will subtract rows from end
	// 	//CB: callback function after setQuestionValue is called.
	// 	//note, new rows are copies of last row.  //TODO: make this copying optional by passing in array of columns to copy
	// 	//note, TODO: if would be replicating colHeaders, just puts in blanks instead
	// 	console.log("updateNumRowsOfTable(" + q_id + ", " + numToAdd + ")");

	// 	let valArr = this.getQuestionValue(q_id).slice();

	// 	console.log("Starting valArr: ", valArr);

	// 	let newRow = new Array(valArr[0].length).fill("");

	// 	if (numToAdd > 0)  // add rows
	// 		for (let i = 0; i < numToAdd; i++) {
	// 			valArr.push(newRow.slice());
	// 		}
	// 	else
	// 		for (let i = numToAdd; i < 0; i++) {
	// 			valArr.pop();
	// 		}
	// 	// console.log("setting questoin value at end of update Num Rows Of Table: ", valArr);
	// 	this.setQuestionValue(q_id, valArr, () => {
	// 		if (typeof CB === "function") CB();
	// 	});
	// 	// console.log("leaving updateNumRowsOfTable");
	// }

	// addColumnToTable(q_id) { //TODO: numToAdd
	// 	let valArr = this.getQuestionValue(q_id).slice();
	// 	valArr.forEach((row) => {
	// 		row.push(row[row.length - 1]);
	// 	});
	// 	this.setQuestionValue(q_id, valArr, () => this.buildRoutesAndRenderPages());
	// }

	// removeColumnFromTable(q_id) { //TODO: numToRemove
	// 	let valArr = this.getQuestionValue(q_id).slice();
	// 	valArr.forEach((row) => {
	// 		row.pop();
	// 	});
	// 	this.setQuestionValue(q_id, valArr, () => this.buildRoutesAndRenderPages());
	// }

	// setTableColumn(q_id, colNum, arr, CB) {
	// 	// console.log("setTableColumn(" + q_id + ", " + colNum + ", ", arr, ")");
	// 	// WARNING: expands or shrinks the entire table to match the number of rows in the given column
	// 	let valArr = this.getQuestionValue(q_id).slice();
	// 	// console.log("setTableColumn value", valArr); //TOOD: somehow the values from propagate are already in here at this point (but it's the wrong size)
	// 	//console.log("setTableColumn Existing valArr.length: ", valArr.length);
	// 	//console.log("setTableColumn Incoming arr length: ", arr.length);

	// 	this.updateNumRowsOfTable(q_id, arr.length - valArr.length, () => this.insertColumnValuesAfterItHasBeenResized(q_id, colNum, arr, CB));
	// 	//CB;
	// 	// console.log("leaving setTableColumn");
	// }

	// insertColumnValuesAfterItHasBeenResized(q_id, colNum, arr, CB) {
	// 	// console.log("insertColumnValuesAfterItHasBeenResized(", q_id, colNum, arr, ")");
	// 	let newValArr = this.getQuestionValue(q_id).slice();
	// 	// console.log("insertColumnValuesAfterItHasBeenResized: valArr (before insert): ", newValArr);
	// 	for (let rowNum = 0; rowNum < newValArr.length; rowNum++) {
	// 		newValArr[rowNum][colNum] = arr[rowNum];
	// 	}
	// 	// console.log("insertColumnValuesAfterItHasBeenResized: valArr (after insert): ", newValArr);
	// 	this.setQuestionValue(q_id, newValArr, () => { if (typeof CB === "function") CB(); });
	// 	// console.log("leaving insertColumnValuesAfterItHasBeenResized");
	// }

	// navigationControl(tabName, add) { //TODO: remove and fix... it's just a pass-along and might not be needed given we navigate from state now
	// 	this.showTabOrPanel(tabName, add, true);
	// }

	// showTabOrPanel(name, toShow, isTab, CB) {  //*****
	// 	// name: name of tab, formatted 'PAGE_NAME:PANEL_NAME"... whitespacing doesn't not matter.
	// 	// toShow: whether to show the panel or not (done by adding or removing panelName from from this.state.hiddenPanels)
	// 	// isTab: boolean... if true, name is a tab (and we'll use hiddenTabs), if false, name is a panel (and we'll use hiddenPanels)
	// 	// CB: callback function after the state has been set.
	// 	// void return

	// 	// note, this does not warn or error if nothing was found.  This is the expected bahavior, as it's expected questions might be set to 'remove' things that are alrady removed.

	// 	const processHidden = (hiddenArr) => {
	// 		let cleanName = name.replace(/ /g, '');
	// 		if (toShow) {
	// 			hiddenArr = hiddenArr.filter((item) => item.replace(/ /g, '') !== cleanName)
	// 		} else {
	// 			hiddenArr.push(cleanName)
	// 		}
	// 		return hiddenArr;
	// 	}

	// 	let listName = "hiddenTabs";
	// 	if (!isTab) {
	// 		listName = "hiddenPanels";
	// 	}

	// 	this.setState((prevState, props) => ({ [listName]: processHidden([...prevState[listName]]) }), () => { if (typeof CB === "function") CB(); })
	// }

	// showQuestion(questionID, toShow) {
	// 	// find the specific question in this.state.questionData based on the id, then update the hidden property

	// 	let DEBUG = false;
	// 	if (DEBUG) console.log("Show Question: ", questionID, " toShow: ", toShow);

	// 	let anyFound = false;  // if this remains false, let's check the dialogQuestions...
	// 	let updatedQuestionsData = this.state.questionsData.filter(questionData => {
	// 		if (questionData.id === questionID) {
	// 			if (DEBUG) console.log("------FOUND!--------");
	// 			if (DEBUG) console.log(questionData);
	// 			questionData['hidden'] = !toShow;
	// 			anyFound = true;
	// 		} else {
	// 			if (DEBUG) console.log("questionData.id :", questionData.id, " and questionID: ", questionID, " do not match");
	// 		}
	// 		return questionData;
	// 	});

	// 	if (anyFound) {
	// 		if (DEBUG) console.log("updatedQuestionsData: ", updatedQuestionsData);  // note, this is the entire questionsData set...//performance
	// 		this.setState({ questionsData: updatedQuestionsData });
	// 	} else {
	// 		// Q_id was not found in questionsData
	// 		let updatedCurDialogQuestions = this.state.curDialogQuestions.filter(questionData => {
	// 			if (questionData.id === questionID) {
	// 				if (DEBUG) console.log("------FOUND!--------");
	// 				if (DEBUG) console.log(questionData);
	// 				questionData['hidden'] = !toShow;
	// 			} else {
	// 				if (DEBUG) console.log("questionData.id :", questionData.id, " and questionID: ", questionID, " do not match");
	// 			}
	// 			return questionData;
	// 		});
	// 		this.setState({ curDialogQuestions: updatedCurDialogQuestions });
	// 	}

	// 	// replace the questionData in localStorage
	// 	//		localStorage.setItem('questionsData', JSON.stringify(rawData));
	// }




	// parseActionsFromQuestion(Q, actionExecuter) {  //****
	// 	// Q can be a Question Component OR questionData object -- differentiated by the presence of 'props'.
	// 	// actionExecuter: function to pass each action to.
	// 	// finds the 'actions' within Q and if they exist, runs the appropriate action string.
	// 	// note, if questionData is passed (which may or may not include a valid value), we get the value from the currentSamplingEvent
	// 	let actionsExist = false;
	// 	let q_id;
	// 	let actions;
	// 	if (Q.props) {
	// 		// this Q is a Question component
	// 		actionsExist = Q.props.actions;
	// 		q_id = Q.props.id;
	// 		actions = Q.props.actions;
	// 	} else {
	// 		// this Q is questionData object
	// 		actionsExist = Q.actions;
	// 		q_id = Q.id;
	// 		actions = Q.actions;
	// 	}

	// 	if (actionsExist) {
	// 		let q_val = this.getQuestionValue(q_id);

	// 		let anyValueCommandString = actions["anyValue"];
	// 		if (anyValueCommandString && q_val !== "" && q_val != null) {
	// 			let actionsToDo = anyValueCommandString.split('&');
	// 			actionsToDo.forEach((action) => {
	// 				actionExecuter(action);
	// 			});
	// 		}

	// 		let commandString = actions[q_val];
	// 		if (commandString) {
	// 			let actionsToDo = commandString.split('&');
	// 			actionsToDo.forEach((action) => {
	// 				actionExecuter(action);
	// 			});
	// 		}

	// 	}
	// }

	// dialogQuestionChangeSystemCallback(Q) {
	// 	this.questionChangeSystemCallback(Q, true);
	// }

	// questionChangeSystemCallback(Q, dialogQuestion) {
	// 	// Q: Question COMPONENT (presumably that just called this)
	// 	// dialogQuestoin: Boolean of if Q is a 'dialogQuestion'. Optional (missing value will be treated as normal question by setQuestionValue)
	// 	// updates value of Q in state, checks for action string, executes any actions

	// 	let DEBUG = false;
	// 	if (DEBUG) console.log("questionChangeSystemCallback: ", Q, "   dialogQuestion: ", dialogQuestion);
	// 	if (DEBUG) console.log("this.state.curSamplingEventName: ", this.state.curSamplingEventName);
	// 	if (DEBUG) console.log("this.state[this.state.curSamplingEventName]: ", this.state[this.state.curSamplingEventName]);

	// 	if (Q == null) {
	// 		throw new Error("questionChangeSystemCallback required field, question, is null");
	// 	}

	// 	//HARDCODE for paper settings:
	// 	if (Q.props.id === "settings_paper") {
	// 		this.setState({ usePaper: Q.state.value });
	// 		this.handleSystemMenuItemClicked("Settings");
	// 	}

	// 	//HARDCODE for settings_syncDelay
	// 	if (Q.props.id === "settings_syncDelay") {
	// 		clearInterval(this.state.syncIntervalFunction);
	// 		if (Q.state.value < 1) {
	// 			alert("Sync Interval must be greater than 1 minute");
	// 		}
	// 		this.setState({ syncDelay: Q.state.value * 60 * 1000 }, () => {
	// 			var syncInterval = setInterval(() => this.updateDatabase(), this.state.syncDelay);
	// 			// store intervalId in the state so it can be accessed later:
	// 			this.setState({ syncIntervalFunction: syncInterval });
	// 		});
	// 		this.handleSystemMenuItemClicked("Settings");
	// 	}

	// 	//HARDCODE for sampleDate
	// 	if (Q.props.id === "sampleDate") {
	// 		// console.log("CHANGING SAMPLE DATE", Q);
	// 	}

	// 	//HARDCODE for stationName drop down
	// 	if (Q.props.id === "stationName") {
	// 		if (DEBUG) console.log("stationName: ", Q.state.value);
	// 		// find the station we are talking about
	// 		let stationIndex = 0;
	// 		for (let i = 0; i < this.state.stations.length; i++) {
	// 			if (this.state.stations[i].id === Q.state.value) {
	// 				stationIndex = i;
	// 			}
	// 		}
	// 		let stationData = this.state.stations[stationIndex];
	// 		if (DEBUG) console.log("stationData", stationData);

	// 		for (let i = 0; i < QIDS_LINKED_TO_STATION_NAME.length; i++) {
	// 			let q_id = QIDS_LINKED_TO_STATION_NAME[i];
	// 			this.setQuestionValue(q_id, stationData[q_id], this.buildRoutesAndRenderPages);
	// 		}
	// 	}

	// 	let propagateSamplePointData = false;
	// 	//HARDCODE for numberOfSamplingPoints
	// 	if (Q.props.id.includes("numberOfSamplingPoints")) {
	// 		propagateSamplePointData = true; // want to run it later because we want values to propagate through teh system first
	// 		this.showTabOrPanel("Parameters", true, true)
	// 	}

	// 	QUESTION_ID_STRINGS_THAT_FORCE_PROPAGATION.forEach((qIDIncludeString) => {
	// 		if (Q.props.id.includes(qIDIncludeString)) {
	// 			propagateSamplePointData = true;
	// 		}
	// 	});

	// 	if (DEBUG) console.log(Q.props.id, Q.state.value);
	// 	this.setQuestionValue(Q.props.id, safeCopy(Q.state.value), () => {

	// 		this.parseActionsFromQuestion(Q, this.actionExecuter);
	// 		if (propagateSamplePointData) {
	// 			this.collectRunAndPropagateSamplePointData(Q.props.id);
	// 		}
	// 		this.buildRoutesAndRenderPages();
	// 		this.updateCurrentEventDateModified();
	// 		this.markForDBUpdate(this.state.curSamplingEventName);
	// 	});
	// }

	// updateCurrentEventDateModified() {
	// 	let newEvent = safeCopy(this.state[this.state.curSamplingEventName]);
	// 	newEvent.dateModified = new Date().toString();
	// 	this.setState({ [this.state.curSamplingEventName]: newEvent }, () => {
	// 		this.markForDBUpdate(this.state.curSamplingEventName);
	// 	}
	// 	);
	// }

	// loadSamplingEvent(samplingEventName) {
	// 	if (FUNCDEBUG) console.log("loadSamplingEvent(" + samplingEventName + ")");

	// 	//TODO: return all items to default state BEFORE loading and running?
	// 	this.setState({ curSamplingEventName: samplingEventName }, () => {
	// 		this.runAllActionsForCurrentSamplingEvent();
	// 		this.setState({ hiddenTabs: [] }); //TODO: KLUDGE
	// 	}
	// 	);

	// }


	// runAllActionsForCurrentSamplingEvent() { //***   not a fan of the use of getQuestionData
	// 	if (FUNCDEBUG) console.log("runAllActionsForCurrentSamplingEvent()");
	// 	// runs through every question in questionsData, if that question has actions checks the value of said question and runs appropraite actions
	// 	let DEBUG = false;
	// 	this.state.questionsData.forEach((questionData) => { // for each question
	// 		if (questionData.actions) { // check if it has an actions node
	// 			// it does! let's check the value of this question in our current event
	// 			if (DEBUG) {
	// 				let q_val = this.state[this.state.curSamplingEventName].questionsValues[questionData.id];
	// 				console.log("questionData.id: ", questionData.id, "q_val: ", q_val);
	// 			}
	// 			this.parseActionsFromQuestion(this.getQuestionData(questionData.id), this.actionExecuter);
	// 		}

	// 	});
	// }

	// removeStation(stationIDToDelete) {
	// 	let newStations = this.state.stations.filter((station) => {
	// 		if (station.id !== stationIDToDelete) {
	// 			return true;
	// 		}
	// 		return false;
	// 	});

	// 	this.setState({ stations: newStations }, () => {
	// 		this.attemptToSyncStationDataToQuestionData();
	// 		this.markForDBUpdate('stations');
	// 	});
	// }

	// addStation(stationName, stationNumber, projectName, projectID, agencyCode) {
	// 	let newStation = {
	// 		id: stationName,
	// 		stationNumber: stationNumber,
	// 		projectName: projectName,
	// 		projectID: projectID,
	// 		agencyCode: agencyCode
	// 	}
	// 	let newStations = this.state.stations.slice();
	// 	newStations.push(newStation);
	// 	//	console.log("newStations: ", newStations);
	// 	//	console.log("this.state.stations: ", this.state.stations);
	// 	//TODO: validation

	// 	this.setState({ stations: newStations }, () => {
	// 		this.attemptToSyncStationDataToQuestionData();
	// 		this.markForDBUpdate('stations');
	// 	});
	// }

	// buildRoutesAndRenderPages = () => {   //TODO:  move to the render function -- currently needs to be called any time content on question pages needs to be modified.  Suspect structural issue with a nested setState inside the questionPage
	// 	// if (FUNCDEBUG) console.log("FUNC: buildRoutesAndRenderPages()");

	// 	// console.log("TRACK DATE: BRARP: sampleDate:", this.state[this.state.curSamplingEventName].questionsValues.sampleDate );
	// 	// console.log("TRACK DATE: BRARP: curSamplingEventName:", this.state.curSamplingEventName);
	// 	// let questionsValues = null;
	// 	// if (this.state[this.state.curSamplingEventName]) { //todo: not sure what this is doing... remove?
	// 	// 	console.log("TRACK DATE: BRARP: doing the safecopy");
	// 	// 	questionsValues = safeCopy(this.state[this.state.curSamplingEventName].questionsValues);
	// 	// }

	// 	// get sampling events to help render eventsManager
	// 	let allSamplingEvents = Object.keys(this.state).filter((key) => key.startsWith(SAMPLING_EVENT_IDENTIFIER));
	// 	let thisUsersSamplingEvents = allSamplingEvents.filter((SEname) => {
	// 		return this.state[SEname].user === this.state.loggedInUser && !this.state[SEname].deleted;
	// 	});
	// 	this.setState({ thisUsersSamplingEvents: thisUsersSamplingEvents }, () => {

	// 		// console.log("THIS USERES SAMPLING EVENTS: ", this.state.thisUsersSamplingEvents);


	// 		var newRoutesAndPages = (
	// 			<Switch> {/* only match ONE route at a time */}
	// 				<Route exact path="/" render={() => {
	// 					// console.log("ROUTE");

	// 					return <Login
	// 						setLoggedInUser={this.setLoggedInUser}
	// 					/>
	// 				}} />
	// 				<Route path="/Dashboard" render={() => <Dashboard
	// 					appBarTextCB={this.setAppBarText}
	// 					navControl={this.navigationControl}
	// 					createNewSamplingEvent={this.createNewSamplingEvent}
	// 					loadSamplingEvent={this.loadSamplingEvent}
	// 					samplingEvents={this.state.thisUsersSamplingEvents}
	// 					getEventDetails={this.getEventDetails}
	// 					deleteSamplingEvent={this.deleteSamplingEvent}
	// 					samplingEventIdentifier={SAMPLING_EVENT_IDENTIFIER}
	// 				/>} />
	// 				{/* <Route path="/EventsManager" render={() => <EventsManager
	// 					appBarTextCB={this.setAppBarText}
	// 					navControl={this.navigationControl}
	// 					createNewSamplingEvent={this.createNewSamplingEvent}
	// 					loadSamplingEvent={this.loadSamplingEvent}
	// 					samplingEvents={thisUsersSamplingEvents}
	// 					getEventDetails={this.getEventDetails}
	// 					deleteSamplingEvent={this.deleteSamplingEvent}
	// 				/>} /> */}
	// 				<Route render={() => {
	// 					// console.log("QP");

	// 					return <QuestionPage
	// 						appBarTextCB={this.setAppBarText}
	// 						tabName={this.props.location.pathname.slice(1)}
	// 						navControl={this.navigationControl}
	// 						systemCB={this.questionChangeSystemCallback}
	// 						questionsData={this.state.questionsData}
	// 						questionsValues={safeCopy(this.state[this.state.curSamplingEventName].questionsValues)}
	// 						hiddenPanels={this.state.hiddenPanels}
	// 						globalState={this.state}
	// 						getNumberOfSetsInCurrentSamplingEvent={this.getNumberOfSetsInCurrentSamplingEvent}
	// 						getNumberOfSamplesInSet={this.getNumberOfSamplesInSet}
	// 						getCurrentSampleEventMethod={this.getCurrentSampleEventMethod}
	// 						getTableQuestionValue={this.getTableQuestionValue}
	// 						getQuestionValue={this.getQuestionValue}
	// 						getQuestionData={this.getQuestionData}
	// 						getDescriptiveColumnForTable={this.getDescriptiveColumnForTable}

	// 					/>
	// 				}} />
	// 				{/* {this.state.navMenu} */}
	// 				{/* //FUTURE: do some processing on pathname to give good human-readable tabnames */}
	// 				<Route render={() => <ErrorPage
	// 					errMsg="Route was not found"
	// 					appBarTextCB={this.setAppBarText}
	// 					navControl={this.navigationControl}
	// 				/>} />
	// 			</Switch>
	// 		); //performance

	// 		this.setState({ routesAndPages: newRoutesAndPages });
	// 	});
	// };


	// collectRunAndPropagateSamplePointData(q_id) {
	// 	let DEBUG = false;
	// 	console.log("collectRunAndPropagateSamplePointData(" + q_id + ")");
	// 	//TODO: check that everything is loaded before trying


	// 	if (DEBUG) console.log("CRAPSPD: ", this.state);
	// 	if (DEBUG) console.log("q_id: ", q_id);

	// 	// if the q_id includes edgeOfSamplingZone ... run the below for each set that has numberOfSamplingPoints...
	// 	if (q_id.includes("edgeOfSamplingZone")) {
	// 		//if both edges are set...

	// 		for (let i = 0; i < MAX_NUM_OF_SETS; i++) {
	// 			let setName = String.fromCharCode(65 + i);
	// 			let sampQID = "set" + setName + "_numberOfSamplingPoints";
	// 			this.propagateNumSamplesData(sampQID);
	// 		}
	// 	}

	// 	if (q_id.includes("numberOfSamplingPoints")) {
	// 		this.propagateNumSamplesData(q_id);
	// 	}

	// 	this.propagateQWDATAInfo();
	// 	//console.log("leaving collectRunAndPropagateSamplePointData");
	// }


	// propagateNumSamplesData(q_id) {
	// 	let DEBUG = false;
	// 	let numSampPoints = this.getQuestionValue(q_id);
	// 	if (DEBUG) console.log("propagateNumSamplesData: numSampPoints: ", numSampPoints);

	// 	if (numSampPoints !== null && numSampPoints !== "" && numSampPoints > 0) {
	// 		// build the appropriate samples table on EDI and/or EWI and/or OTHER pages 

	// 		let sampMethod = this.getCurrentSampleEventMethod();
	// 		//note, the exact name of these questions must match.  Tightly coupled. Don't like.  Easy.
	// 		let tempValArr = [];
	// 		if (sampMethod === "EWI") {
	// 			if (DEBUG) console.log("Building EWI first column");
	// 			// pull variables from fields
	// 			let LESZ = this.getQuestionValue("edgeOfSamplingZone_Left");
	// 			let RESZ = this.getQuestionValue("edgeOfSamplingZone_Right");
	// 			if (DEBUG) console.log("Left Edge SZ: ", LESZ);
	// 			if (DEBUG) console.log("Right Edge SZ: ", RESZ);
	// 			let pierlocs = [];
	// 			let pierWids = [];
	// 			for (let i = 0; i < 6; i++) {
	// 				pierlocs.push(this.getQuestionValue("pier" + (i + 1) + "_start"));

	// 				let pierWidth = this.getQuestionValue("pier" + (i + 1) + "_end") - pierlocs[i];
	// 				pierWids.push(pierWidth);
	// 			}

	// 			tempValArr = provideEWISamplingLocations(LESZ, RESZ, pierlocs, pierWids, numSampPoints);
	// 			tempValArr.unshift("Distance from L bank, feet"); //push past header

	// 		} else if (sampMethod === "EDI") { //EDI
	// 			if (DEBUG) console.log("Building EDI first column");
	// 			tempValArr = provideEDISamplingPercentages(numSampPoints);
	// 			tempValArr.unshift("EDI %"); //push past header

	// 		} else { // Generic 'OTHER' table
	// 			if (DEBUG) console.log("Building OTHER first column");
	// 			// fill out "Group" table values
	// 			for (let i = 0; i < numSampPoints; i++) {
	// 				tempValArr.push(i + 1);
	// 			}
	// 			tempValArr.unshift("Sample #"); //push past header
	// 		}

	// 		if (DEBUG) console.log("First column values: ", tempValArr);

	// 		let tableToSetName = q_id.replace("numberOfSamplingPoints", "samplesTable") + "_" + sampMethod;

	// 		this.setTableColumn(tableToSetName, 0, tempValArr, this.buildRoutesAndRenderPages);
	// 	}
	// }

	// propagateQWDATAInfo() {
	// 	//console.log("propagateQWDATAInfo");
	// }


	// addToItemsToSyncToLS(toSync, CB) {
	// 	if (this.state.itemsToSyncToLS.includes(toSync)) {
	// 		if (typeof CB === "function") CB();
	// 		return;
	// 	} else {
	// 		let newitemsToSyncToLS = this.state.itemsToSyncToLS.slice();
	// 		newitemsToSyncToLS.push(toSync);
	// 		this.setState({ itemsToSyncToLS: newitemsToSyncToLS }, () => { if (typeof CB === "function") CB(); });
	// 	}
	// }

	// customQuestionAdder = (q_obj, CB) => {
	// 	let newCustomQuestions = this.state.customQuestions.slice();
	// 	newCustomQuestions.push(q_obj);
	// 	this.setState({ customQuestions: newCustomQuestions }, () => {
	// 		this.markForDBUpdate('customQuestions'); this.buildCombinedQuestionsData(CB);
	// 	});
	// }
	// customQuestionDeleter = (q_id, CB) => {
	// 	let newCustomQuestions = this.state.customQuestions.slice();
	// 	newCustomQuestions = newCustomQuestions.filter((Q) => Q.id !== q_id)
	// 	this.setState({ customQuestions: newCustomQuestions }, () => {
	// 		this.markForDBUpdate('customQuestions');
	// 		this.buildCombinedQuestionsData(CB);
	// 	});
	// }


	// //.......GGG.........................................................
	// //......G...S...EEEEE...EEEEEEE......................................
	// //......GSS.....E..........E.........................................
	// //.........GGG..EEEEE......E.........................................
	// //......G...G...E..........E.........................................
	// //.......GGG....EEEEE......E.........................................



	// setQuestionData(q_id, key, value, CB) { //**
	// 	// q_id: string question ID associated with a question
	// 	// key: string used as key in questionData object
	// 	// value: value that key will be set to
	// 	// CB: callback function to be called after the value has been set
	// 	// void return

	// 	// sets the 'key' element to 'value' for the question with question id of q_id ... 
	// 	// when looking for q_id, searches default questions (questionsData) first, TODO: then dialog questions, then TODO: user/station questions
	// 	// TODO: if the key is 'value', offload to "setQuestionValue" function

	// 	// TODO: throws error if no question matching q_id is found

	// 	// TODO: performance: rebuilds entire questionsData... needlessly?

	// 	if (key === "value") { // updating value is special and has it's own storage locations.  Call appropriate function that handles it well.
	// 		this.setQuestionValue(q_id, value, CB);
	// 		return;
	// 	}

	// 	let anyFound = false;
	// 	var newQuestionsData = this.state.questionsData.filter(questionData => {
	// 		if (questionData.id === q_id) {
	// 			questionData[key] = value;
	// 			anyFound = true;
	// 		}
	// 		return questionData;
	// 	});

	// 	if (anyFound) {
	// 		this.setState({ questionsData: newQuestionsData }, () => { if (typeof CB === "function") CB(); });
	// 	} else {
	// 		let newDialogQuestions = this.state.dialogQuestions.slice();

	// 		function ifIDMatchSetValue(questionData) {
	// 			if (questionData.id === q_id) {
	// 				questionData[key] = value;
	// 				anyFound = true;
	// 			}
	// 			return questionData;
	// 		}

	// 		for (let i = 0; i < newDialogQuestions.length && !anyFound; i++) {
	// 			var specificDialogQuestions = newDialogQuestions[i].questions.map(ifIDMatchSetValue);
	// 			if (anyFound) {
	// 				newDialogQuestions[i].questions = specificDialogQuestions;
	// 				this.setState({ dialogQuestions: newDialogQuestions }, () => { if (typeof CB === "function") CB(); });
	// 			}
	// 		}
	// 	}
	// }

	// setQuestionValue(q_id, value, CB) { //**** // return should be better
	// 	// q_id: string question ID associated with a question
	// 	// value: value that should be saved in state
	// 	// CB: function that should be called after setState
	// 	// returns void (TODO: return questoinData format associated with the q_id WITH the updated value inserted)
	// 	// sets the value of the first question it finds while searching in this order: dialogQuestions, currentSamplingEvent.
	// 	// note, given currentSamplingEvent is built from questionsData, the instances where a value would be in questionsData and NOT in current sampling event are very exotic and throws an error
	// 	// throws error if no question is found

	// 	let DEBUG = false;
	// 	if (DEBUG) console.log("setQuestionValue(" + q_id + ", ", value, ")");

	// 	// sometimes boolean values are coming in as strings, fix that.
	// 	if (value === "true") {
	// 		value = true;
	// 	}
	// 	if (value === "false") {
	// 		value = false;
	// 	}

	// 	// search in dialog questions  (note, if we search current sampling event first -- and we try to modify a dialog before loading an event, things crash... so we search the dialog questions first)
	// 	let newDQ = this.state.dialogQuestions.slice();
	// 	for (let i = 0; newDQ && i < newDQ.length; i++) {
	// 		for (let k = 0; newDQ[i] && k < newDQ[i].questions.length; k++) {
	// 			if (newDQ[i].questions[k].id === q_id) {
	// 				newDQ[i].questions[k].value = value;
	// 				this.setState({ "dialogQuestions": newDQ }, () => { if (typeof CB === "function") CB(); });
	// 				return;
	// 			}
	// 		}
	// 	}

	// 	// search in current Sampling Event
	// 	let curSE = this.isCurrentSamplingEventReady("setQuestionValue(" + q_id + ", " + value + ")");
	// 	if (q_id in curSE.questionsValues) {
	// 		let newQuestionsValues = curSE.questionsValues;
	// 		newQuestionsValues[q_id] = value;
	// 		let newCurSE = { ...curSE, questionsValues: newQuestionsValues };
	// 		this.setState({ [this.state.curSamplingEventName]: newCurSE }, () => { if (typeof CB === "function") CB(); });
	// 		return;
	// 	}



	// 	// search in questions data - if it's hear, that means it's a new custom question since this sample event was made.  given this should be very rare, give a warning.
	// 	let newQD = this.state.questionsData.slice();
	// 	for (let i = 0; newQD && i < newQD.length; i++) {
	// 		if (newQD[i].id === q_id) {
	// 			console.warn("Attempting to set value (" + value + ") on " + q_id + " and it only exists in questionsData.  This should be investigated, as it should be very rare.  Only expected when this is a custom question newer than the sampling event.")
	// 			// set value in the sampling event, making a new key
	// 			//				console.log(curSE);//let newCurSE
	// 			curSE.questionsValues[q_id] = value;
	// 			this.setState({ [this.state.curSamplingEventName]: curSE }, () => { if (typeof CB === "function") CB(); });
	// 			return;
	// 		}
	// 	}

	// 	throw new Error("Question not found in current sampling event, dialog questions, user custom or default config questions.  WebFF.setQuestionValue(" + q_id + ")");
	// }

	// setLoggedInUser(username) {

	// 	this.setState({
	// 		loggedInUser: username,
	// 		hiddenTabs: defaultHiddenTabs.slice(),
	// 		hiddenPanels: defaultHiddenPanels.slice()
	// 	}, () => {
	// 		this.setUserConfigToDefault();
	// 		this.componentWillMount();
	// 		this.buildRoutesAndRenderPages();
	// 		this.props.history.push('/Dashboard');
	// 	});

	// }

	// setUserConfigToDefault() {
	// 	// tabs back to default hidden
	// 	//TODO: tabs back to default hidden on create sampling event too

	// 	USER_DB_NODES.forEach((nodeName) => {
	// 		console.log("resetting: ", nodeName);
	// 		this.setState({ nodeName: [] });
	// 	});
	// }

	// setAppBarText = (txt) => {
	// 	this.setState({ appBarText: txt });
	// };

	// setShippedStatus(eventName, status) {
	// 	let realEventName = eventName;
	// 	if (!eventName) {
	// 		realEventName = this.state.curSamplingEventName;
	// 	}
	// 	if (!this.state[realEventName]) {
	// 		throw new Error("Attempting to set shipped status on event that is not loaded. -- setShippedStatus(" + eventName + ", " + status + ")");
	// 	}

	// 	let newEvent = this.state[realEventName];
	// 	newEvent.shippedStatus = status;
	// 	this.setState({ [realEventName]: newEvent }, this.markForDBUpdate(realEventName));

	// }


	// isCurrentSamplingEventReady(caller) {
	// 	if (FUNCDEBUG) console.log("isCurrentSamplingEventReady(" + caller + ")");

	// 	if (this.state.curSamplingEVentName === "" || this.state.curSamplingEventName === null) {
	// 		throw new Error("current sampling event is not set.  --  " + caller);
	// 	}

	// 	let curSE = Object.assign({}, this.state[this.state.curSamplingEventName]);


	// 	if ((Object.keys(curSE).length === 0 && curSE.constructor === Object)) { // current sampling event is not loaded or is malformed.
	// 		// try to load sampling events from LS
	// 		this.loadSamplingEventsFromLS();
	// 		// then recheck:
	// 		let curSE = Object.assign({}, this.state[this.state.curSamplingEventName]);
	// 		if ((Object.keys(curSE).length === 0 && curSE.constructor === Object)) {
	// 			throw new Error("current sampling event, " + this.state.curSamplingEventName + " is not loaded -- " + caller);
	// 		}
	// 	}

	// 	if (!curSE.questionsValues) {
	// 		throw new Error("current sampling event, " + this.state.curSamplingEventName + ", has missing or malformed questionsValues -- " + caller);
	// 	}
	// 	return curSE;
	// }



	// //.......GGG.........................................................
	// //......G...G...EEEEE...EEEEEEE......................................
	// //......G.......E..........E.........................................
	// //......G..GGG..EEEEE......E.........................................
	// //......G...G...E..........E.........................................
	// //.......GGG....EEEEE......E.........................................

	// getQuestionValueFromEvent(eventName, q_id) {
	// 	//TODO: merge with the real getQuestionValue
	// 	if (q_id in this.state[eventName].questionsValues) {
	// 		let ret = this.state[eventName].questionsValues[q_id];
	// 		if (Array.isArray(ret)) {
	// 			return ret.slice();
	// 		}
	// 		return ret;
	// 	}
	// 	throw new Error("get data (", q_id, ") from specific event (", eventName, ")");
	// }

	// getQuestionValue(q_id) { //****  //TODO: error reasonably when  curSamplingEvent is undefined
	// 	// q_id: string question ID associated with a question
	// 	// returns VALUE associated with the q_id... first searching dialogQuestions, then searching the currentSamplingEvent, then, finally, questionsData.
	// 	// note, given currentSamplingEvent is built from questionsData, the instances where a value would be in questionsData and NOT in current sampling event are very exotic
	// 	// throws error if no question is found

	// 	//note: searched first because if we search for a dialog question before loading a current sampling event, it would throw an error
	// 	for (let i = 0; this.state.dialogQuestions && i < this.state.dialogQuestions.length; i++) {
	// 		for (let k = 0; this.state.dialogQuestions[i] && k < this.state.dialogQuestions[i].questions.length; k++) {
	// 			if (this.state.dialogQuestions[i].questions[k].id === q_id) {
	// 				let ret = this.state.dialogQuestions[i].questions[k].value;
	// 				if (Array.isArray(ret)) {
	// 					return ret.slice();
	// 				}
	// 				return ret;
	// 			}
	// 		}
	// 	}

	// 	let curSE = this.isCurrentSamplingEventReady("getQuestionValue(" + q_id + ")");

	// 	if (q_id in curSE.questionsValues) {
	// 		let ret = curSE.questionsValues[q_id];
	// 		if (Array.isArray(ret)) {
	// 			return ret.slice();
	// 		}
	// 		return ret;
	// 	}

	// 	for (let i = 0; i < this.state.questionsData.length; i++) {
	// 		if (this.state.questionsData[i].id === q_id) {
	// 			let ret = this.state.questionsData[i].value;
	// 			if (Array.isArray(ret)) {
	// 				return ret.slice();
	// 			}
	// 			return ret;
	// 		}
	// 	}

	// 	throw new Error("Question not found in current sampling event, dialog questions, or default config questions.  WebFF.getQuestionValue(" + q_id + ")");
	// }

	// getEventDetails(eventName, node) {
	// 	// console.log("Event: ", this.state[eventName]);
	// 	// console.log("Node/"+node+": ", this.state[eventName][node]);
	// 	if (typeof this.state[eventName][node] === "undefined") {
	// 		return this.getQuestionValueFromEvent(eventName, node);
	// 	} else {
	// 		return this.state[eventName][node];
	// 	}
	// }

	// getDateTimeString() {
	// 	let d = new Date();
	// 	let hoursString = ('0' + d.getHours()).slice(-2);
	// 	let minutesString = ('0' + (d.getMinutes())).slice(-2);
	// 	let secondsString = ('0' + (d.getSeconds())).slice(-2);
	// 	let timeString = hoursString + ":" + minutesString + ":" + secondsString;
	// 	return this.getDateString(d) + "@" + timeString;
	// }

	// getDateString(d) {
	// 	let dateOfMonthString = ('0' + d.getDate()).slice(-2);
	// 	let monthString = ('0' + (d.getMonth() + 1)).slice(-2);
	// 	return d.getFullYear() + "-" + monthString + "-" + dateOfMonthString;
	// }

	// getQuestionData(q_id) {
	// 	if (FUNCDEBUG) console.log("FUNC: getQuestionData(" + q_id + ")");

	// 	// returns question from questionsData that has q_id.  If none is found, return null
	// 	// WARNING: DO NOT USE THIS TO ACCESS "VALUE" unless you are aware it might be wrong (the value stored in questionsData is the default... the real 'value' is stored in the samplingEvent)
	// 	// TODO: verify all uses of this function are safe and/or depricate and/or remove this function
	// 	let retArr = this.state.questionsData.filter(questionData => {
	// 		if (questionData.id === q_id) {
	// 			return questionData;
	// 		}
	// 		return null;
	// 	});

	// 	if (retArr.length === 1) {
	// 		return retArr[0];
	// 	} else {
	// 		return null;
	// 		//throw new Error("getQuestionData found " + retArr.length + " matching values when looking for question data - getQuestionData("+q_id+")");
	// 	}
	// }

	// getDescriptiveColumnForTable() {
	// 	let sampleEventLocations = [];
	// 	let numSets = this.getNumberOfSetsInCurrentSamplingEvent();
	// 	let setType = this.getCurrentSampleEventMethod(); //EDI, EWI, or OTHER

	// 	for (let i = 0; i < numSets; i++) {
	// 		let setName = String.fromCharCode(65 + i);
	// 		let numSamps = this.getNumberOfSamplesInSet(setName);
	// 		let ai = !this.getQuestionValue("set" + setName + "_samplesComposited");
	// 		let setLocations = [];
	// 		if (ai) {
	// 			let table_q_id = "set" + String.fromCharCode(65 + i) + "_samplesTable_" + setType;
	// 			for (let k = 1; k <= numSamps; k++) {
	// 				let location = 0;
	// 				if (setType === "EWI") { //TODO: this is probably a useless conditional now that the headers are the same
	// 					location = this.getTableQuestionValue(table_q_id, 0, k);
	// 				} else {
	// 					location = this.getTableQuestionValue(table_q_id, "Distance from L bank, feet", k);
	// 					//	console.log("LOCATION for " + table_q_id + ": ", location);
	// 				}

	// 				setLocations.push(location);
	// 			}
	// 		} else {
	// 			setLocations.push("Comp"); // for a composite, there isn't really a 'location'
	// 		}
	// 		sampleEventLocations.push(setLocations);
	// 	}

	// 	let firstColumn = [];

	// 	// fill out the firstColumn based on the sampleEventLoations generated above
	// 	for (let i = 0; i < sampleEventLocations.length; i++) {
	// 		let setName = String.fromCharCode(65 + i)
	// 		for (let k = 0; k < sampleEventLocations[i].length; k++) {

	// 			switch (sampleEventLocations[i][k]) {
	// 				case '':
	// 					firstColumn.push(setName + "-" + (k + 1));
	// 					break;
	// 				case "Comp":
	// 					firstColumn.push(setName + " Comp");
	// 					break;
	// 				default:
	// 					firstColumn.push(setName + "-" + (k + 1) + " @ " + sampleEventLocations[i][k]);
	// 			}
	// 		}
	// 	}
	// 	// push below the header
	// 	firstColumn.unshift("Set-Sample @ Dist");

	// 	// console.log("FIRST COLUMN: ", firstColumn);
	// 	return firstColumn;

	// }


	// getTableQuestionValue(q_id, header, rowNum) {
	// 	console.log("getTableQuestionValue(",
	// 		q_id,
	// 		", ",
	// 		header,
	// 		", ",
	// 		rowNum,
	// 		")"
	// 	)
	// 	// q_id: string question ID associated with a tableInput question
	// 	// header: string matching the item in row 0.  If header is a number, will grab that column.
	// 	// returns VALUE in table q_id in column with matching header and on row rowNum... 
	// 	// throws error if q_id value is not an array (which is must be in order to be a table's value)
	// 	if (!(this.getQuestionData(q_id).type === "TableInput" || this.getQuestionData(q_id).type === "ParametersTable" || this.getQuestionData(q_id).type === "QWDATATable")) {
	// 		throw new Error("Question (" + q_id + ") not of required 'TableInput' type.  WebFF.getTableQuestionValue(" + q_id + ", " + header + ", " + rowNum + ")");
	// 	}

	// 	let QV = this.getQuestionValue(q_id);
	// 	//console.log("QV: ", QV);
	// 	// headers are located in the first row...
	// 	let col = QV[0].indexOf(header);

	// 	if (col < 0) { /// if the header wasn't found, let's assume we are a number...
	// 		if (!Number.isNaN(header)) {
	// 			col = header;
	// 		}
	// 	}

	// 	if (col < 0) {
	// 		throw new Error("Header (" + header + ") not found in first row of Question (" + q_id + ") value.  WebFF.getTableQuestionValue(" + q_id + ", " + header + ", " + rowNum + ")");
	// 	}

	// 	return QV[rowNum][col];
	// }


	// getQuestionsDataWithUpdatedValue(Q, dialogQuestions) {
	// 	//this function saves updated question "values" (must be located at "Q.state.value")
	// 	// returns updated questionsData object
	// 	var DEBUG = false;
	// 	if (true) console.log("getQuestionsDataWithUpdatedValue: Q: ", Q);
	// 	if (Q == null) { //POC
	// 		console.log("Question passed to getQuestionsDataWithUpdatedValue was null or undefined");
	// 		return;
	// 	}

	// 	// find the specific question in questionsData  or curDialogQuestions based on the id,then update the value property
	// 	let questionsToFilter = this.state.curDialogQuestions;
	// 	if (!dialogQuestions) {
	// 		questionsToFilter = this.state.questionsData;
	// 	}

	// 	var newQuestionsData = questionsToFilter.filter(questionData => {
	// 		//console.log("QuestionData: ", questionData);
	// 		if (questionData.id === Q.props.id) {
	// 			if (DEBUG) console.log("------FOUND!--------");
	// 			if (DEBUG) console.log("getQuestionsDataWithUpdatedValue: questionData (pre): ", questionData);
	// 			if (DEBUG) console.log("getQuestionsDataWithUpdatedValue: Q.state.value", Q.state.value);

	// 			questionData.value = Q.state.value;

	// 			if (DEBUG) console.log("getQuestionsDataWithUpdatedValue: questionData (post)", questionData);
	// 		} else {
	// 			if (DEBUG) console.log("getQuestionsDataWithUpdatedValue: no");
	// 		}
	// 		return questionData;
	// 	});

	// 	if (DEBUG) console.log("getQuestionsDataWithUpdatedValue: newQuestionsData: ", newQuestionsData);

	// 	return newQuestionsData;
	// }

	// getNumberOfSetsInCurrentSamplingEvent() {
	// 	if (this.state.curSamplingEventName === null) {
	// 		return 0;
	// 	}
	// 	let howMany = 0;
	// 	for (let i = 0; i < MAX_NUM_OF_SETS; i++) {
	// 		if (this.getQuestionValue('set' + String.fromCharCode(65 + i) + '_numberOfSamplingPoints')) {
	// 			howMany++;
	// 		}
	// 	}
	// 	return howMany;
	// }

	// getNumberOfSamplesInSet(setName) {
	// 	return parseInt(this.getQuestionValue('set' + setName + '_numberOfSamplingPoints'), 10);
	// }

	// getSamplerTypeQuestionIDString() { // yes, this and the one below should be combined somehow
	// 	let samplTypeQuestionIDString = "samplerType";
	// 	switch (this.getQuestionValue("sedimentType")) {  //TODO: this needn't be a conditional...
	// 		case 'bedload':
	// 			samplTypeQuestionIDString += "_bedload";
	// 			break;
	// 		case 'bottom':
	// 			samplTypeQuestionIDString += "_bottom";
	// 			break;
	// 		default: //suspended
	// 			samplTypeQuestionIDString += "_suspended";
	// 			break;
	// 	}
	// 	return samplTypeQuestionIDString;
	// }

	// getSamplingMethodQuestionIDString() {
	// 	let samplingMethodQuestionIDString = "samplingMethod";
	// 	switch (this.getQuestionValue("sedimentType")) {  //TODO: this needn't be a conditional...
	// 		case 'bedload':
	// 			samplingMethodQuestionIDString += "_bedload";
	// 			break;
	// 		case 'bottom':
	// 			samplingMethodQuestionIDString += "_bottom";
	// 			break;
	// 		default: //suspended
	// 			samplingMethodQuestionIDString += "_suspended";
	// 			break;
	// 	}
	// 	return samplingMethodQuestionIDString;
	// }

	// getCurrentSampleEventMethod() {
	// 	//note, for SEDLOGIN XML purposes... the string returned from this actually the sampling method not the 'value'.
	// 	// otherwise, this is used for collectRunAndPropagate
	// 	let samplingMethodQuestionIDString = this.getSamplingMethodQuestionIDString();

	// 	//console.log("samplingMethodQuestionIDString", samplingMethodQuestionIDString);
	// 	let sampMethod = "";
	// 	let QV = this.getQuestionValue(samplingMethodQuestionIDString);
	// 	//console.log("QV",QV);
	// 	switch (QV) {  //TODO: renaming 
	// 		case '10':
	// 			sampMethod = "EWI";
	// 			break;
	// 		case '20':
	// 			sampMethod = "EDI";
	// 			break;
	// 		default:
	// 			sampMethod = "OTHER";
	// 			break;
	// 	}
	// 	return sampMethod;
	// }

	// //........BBBB.....BBBB..........................................
	// //........B...B....B...B.........................................
	// //........B....B...B...B.........................................
	// //........B....B...BBBB..........................................
	// //........B....B...B...B.........................................
	// //........B...B....B...B.........................................
	// //........BBBB.....BBBB..........................................

	// updateDBInfo(needleKey, needle, newData, CB) {
	// 	// attempts to update location
	// 	// returns the ENTIRE newly updated data element.

	// 	const DEBUG = true;

	// 	const API = PHP_FILE_LOCATION + 'dbPatch.php/';
	// 	// const API = PHP_FILE_LOCATION + 'mongoPatch_backend.php/';
	// 	const query =
	// 		"needleKey=" + encodeURIComponent(needleKey) + "&" +
	// 		"needle=" + encodeURIComponent(needle) + "&" +
	// 		"newData=" + encodeURIComponent(JSON.stringify(newData));

	// 	let URI = API; // + query;

	// 	if (DEBUG) console.log("Function: fetchDBInfo PATCH @ " + URI);

	// 	fetch(URI, {
	// 		method: 'POST',
	// 		headers: {
	// 			//	'Accept': 'application/json',
	// 			'Content-Type': 'application/x-www-form-urlencoded',
	// 			//	'Content-Type': 'application/json'
	// 		},
	// 		body: query
	// 		//JSON.stringify(newData)
	// 	}).then(function (response) {
	// 		if (response.status === 200) {
	// 			return response.text();
	// 			// might be more useful to return JSON
	// 		}
	// 		return null;
	// 	}).then(function (text) {
	// 		console.log("DB response text: ", text);

	// 		if (typeof CB === "function") CB(text);
	// 	}).catch(error => console.log("Error fetching " + API + query + "\n" + error));
	// }

	// markForDBUpdate(toUpdate) {
	// 	if (this.state.needsToUpdateDB.includes(toUpdate)) {
	// 		return;
	// 	} else {
	// 		let newNeedsToUpdateDB = this.state.needsToUpdateDB.slice();
	// 		newNeedsToUpdateDB.push(toUpdate);
	// 		this.setState({ needsToUpdateDB: newNeedsToUpdateDB });
	// 	}
	// }

	// updateDatabase() {

	// 	let toUpdate = this.state.needsToUpdateDB;
	// 	if (toUpdate.length === 0) {
	// 		console.log("Updating database....nothing to update in DB, skipping");
	// 		return;
	// 	}
	// 	console.log("Updating database...");
	// 	for (let i = 0; i < toUpdate.length; i++) {
	// 		console.log("Updating " + toUpdate[i]);
	// 		let patchData = { [toUpdate[i]]: this.state[toUpdate[i]] };
	// 		this.updateDBInfo("id", this.state.loggedInUser, patchData, (res) => {
	// 			//		console.log(res);
	// 			let newNeedsToUpdateDB = this.state.needsToUpdateDB.slice();
	// 			newNeedsToUpdateDB.splice(newNeedsToUpdateDB.indexOf(toUpdate[i], 1));
	// 			this.setState({ needsToUpdateDB: newNeedsToUpdateDB });
	// 		});
	// 	}
	// }



	// //....B...B...M.......M...M...............................
	// //.....B.B....MM.....MM...M...............................
	// //......B.....M.M...M.M...M...............................
	// //.....B.B....M..M.M..M...M...............................
	// //....B...B...M...M...M...MMMMMM..........................

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


	// buildSampleObj(setName, sampNum) {
	// 	// get total number of samples before this one to know what row we are looking at in QWDATA table
	// 	let setNum = setName.charCodeAt() - 65;
	// 	let totalNumberOfSamplesInPreviousSets = 0;
	// 	for (let i = setNum; i > 0; i--) {
	// 		let previousSetName = String.fromCharCode(i + 64);
	// 		let previousAI = !this.getQuestionValue("set" + previousSetName + "_samplesComposited");
	// 		totalNumberOfSamplesInPreviousSets += previousAI ? this.getNumberOfSamplesInSet(previousSetName) : 1;
	// 	}
	// 	let QWDATARowNum = sampNum + 1 + totalNumberOfSamplesInPreviousSets;

	// 	// build sample object
	// 	let sampleObj = {
	// 		"SampleNumber": sampNum + 1,
	// 		"BeginDate": this.getTableQuestionValue("QWDATATable", "Sample Date", QWDATARowNum) !== ""
	// 			? this.getTableQuestionValue("QWDATATable", "Sample Date", QWDATARowNum)
	// 			: this.getQuestionValue("sampleDate"),
	// 		"BeginTime": this.getTableQuestionValue("QWDATATable", "Sample Time", QWDATARowNum),
	// 		"TimeDatum": this.getQuestionValue("timeDatum"),
	// 		"AddOnAnalyses": this.getTableQuestionValue("QWDATATable", "Add-on Analyses", QWDATARowNum).join(','),
	// 		"CollecAgency": this.getQuestionValue("collectingAgency"),
	// 		"colllectorInitials": this.getQuestionValue("compiledBy"),
	// 		"Hstat": (this.getTableQuestionValue("QWDATATable", "Hydrologic Cond", QWDATARowNum) !== "")
	// 			? this.getTableQuestionValue("QWDATATable", "Hydrologic Cond", QWDATARowNum)
	// 			: this.getQuestionValue("hydrologicCondition"),
	// 		"HydEvent": (this.getTableQuestionValue("QWDATATable", "Hydrologic Event", QWDATARowNum) !== "")
	// 			? this.getTableQuestionValue("QWDATATable", "Hydrologic Event", QWDATARowNum)
	// 			: this.getQuestionValue("hydrologicEvent"),
	// 		"Stype": (this.getTableQuestionValue("QWDATATable", "Sample Type", QWDATARowNum) !== "")
	// 			? this.getTableQuestionValue("QWDATATable", "Sample Type", QWDATARowNum)
	// 			: this.getQuestionValue("sampleType"),
	// 		"Astat": (this.getTableQuestionValue("QWDATATable", "ASTAT Code", QWDATARowNum) !== "")
	// 			? this.getTableQuestionValue("QWDATATable", "ASTAT Code", QWDATARowNum)
	// 			: this.getQuestionValue("analysisStatus"),
	// 		"P71999": this.getQuestionValue("samplePurpose"),
	// 		"P82398": this.getQuestionValue(this.getSamplingMethodQuestionIDString()),
	// 		"P84164": this.getQuestionValue(this.getSamplerTypeQuestionIDString()),
	// 		"M2Lab": this.getTableQuestionValue("QWDATATable", "M2Lab", QWDATARowNum)
	// 	}

	// 	// build param part of sample object from the parameters table headers
	// 	let parametersTableHeaders = this.getQuestionValue("parametersTable")[0];
	// 	if (parametersTableHeaders === null | parametersTableHeaders.length < 4) { // there was no parameters table info or headers
	// 		return sampleObj;  //FIXME: This should either alert or not return... there are other params now.
	// 	}

	// 	let activePCodes = {};
	// 	for (let i = 0; i < parametersTableHeaders.length; i++) {
	// 		activePCodes[parametersTableHeaders[i].split("_")[0]] = true;
	// 	}
	// 	let activePCodesArr = Object.keys(activePCodes).filter((el) => el !== "Set-Sample @ Dist");

	// 	for (let i = 0; i < activePCodesArr.length; i++) {
	// 		sampleObj["Param" + i] = this.buildParamTableParamObj(QWDATARowNum, activePCodesArr[i]);
	// 	}



	// 	//build the param part of the sample object from the pCodes not in the parameters page
	// 	let curParamNum = activePCodesArr.length;

	// 	// REMOVED per KASKACH request that this be a param block instead of a sample-level item.
	// 	//  "Average Gage Height", if calculated, should be written to P00065.
	// 	//  If they DON'T fill in Start and End Gage Ht, they should be able to enter Average Gage Ht P00065 by hand.  
	// 	// QWDATA can also accept this if left blank.
	// 	// sampleObj["Param" + curParamNum++] = this.buildParamObj("P00065", this.getQuestionValue("set" + setName + "_AvgGageHeight"));

	// 	//  - the "Sampling Points" should be written to P00063.  This will be left blank for 'Groups' of samples.
	// 	if (!this.getQuestionValue("groupOfSamples")) {
	// 		sampleObj["Param" + curParamNum++] = this.buildParamObj("P00063", this.getQuestionValue("set" + setName + "_numberOfSamplingPoints"));
	// 	}

	// 	//  - the Distance from L Bank should be written to P00009.
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P00009", this.getTableQuestionValue("set" + setName + "_samplesTable_" + this.getCurrentSampleEventMethod(), "Distance from L bank, feet", sampNum + 1));

	// 	//  - Transit rate, sampler, feet per second  should be written to P50015.
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P50015", this.getTableQuestionValue("set" + setName + "_samplesTable_" + this.getCurrentSampleEventMethod(), "Transit Rate, ft/sec", sampNum + 1));

	// 	//  - Start Time should be written to P82073, 
	// 	//  - End Time should be written to P82074.  
	// 	//  These should be written in 24-hour military time, with NO colon between the hour & minutes.
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P82073", this.getQuestionValue("set" + setName + "_StartTime").replace(":", ""));
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P82074", this.getQuestionValue("set" + setName + "_EndTime").replace(":", ""));

	// 	// - the "Stream Width", if calculated, should be written to P00004.  
	// 	// TODO: If they DON'T fill in Waterway Info, they should be able to enter Stream Width P00004 by hand.  QWDATA can also accept this if left blank.
	// 	//	try {
	// 	let streamWidth = Math.abs(this.getQuestionValue("streamWidth"));
	// 	if (streamWidth !== 0) {
	// 		sampleObj["Param" + curParamNum++] = this.buildParamObj("P00004", streamWidth);
	// 	}

	// 	// } catch (e) {
	// 	// 	console.warn("Stream Width not added to XML");
	// 	// }


	// 	// - - Mean Depth of Stream (00064), 
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P00064", this.getQuestionValue("meanStreamDepth"));

	// 	// - - Stream Velocity (00055)
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P00055", this.getQuestionValue("streamVelocity"));


	// 	// IET testing
	// 	// - - Stream Velocity (ft) - - should be written to P72196
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P72196", this.getQuestionValue("streamVelocity_IET")); //TODO: stream velocity question name collision 
	// 	// - - Seconds Sampler collected water - - should be written to P72217
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P72217", this.getQuestionValue("duration_IET"));
	// 	// - - Sample Volume for Test (mL) - - should be written to P72218
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P72218", this.getQuestionValue("sampleVolume_IET"));
	// 	// - - Nozzle Material - - should be written to P72219
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P72219", this.getQuestionValue("nozzleMaterial_IET"));
	// 	// - - Nozzle Diameter - - should be written to P72220
	// 	sampleObj["Param" + curParamNum++] = this.buildParamObj("P72220", this.getQuestionValue("nozzleDiameter_IET"));



	// 	// for Bedload samples only:  
	// 	if (this.getQuestionValue("sedimentType") === "bedload") {
	// 		//  - - Bag Mesh Size, in mm - - should be P30333.
	// 		sampleObj["Param" + curParamNum++] = this.buildParamObj("P30333", this.getQuestionValue("bagMesh"));

	// 		//  - - Tether Line Used - -  should be P04117.
	// 		sampleObj["Param" + curParamNum++] = this.buildParamObj("P04117", this.getQuestionValue("tetherLine") ? 1 : 0);

	// 		//  - - Composited samples in cross sectional bedload measurement, a number - - should be P04118.
	// 		sampleObj["Param" + curParamNum++] = this.buildParamObj("P04118", this.getQuestionValue("compositeSamplesInCrossSection"));

	// 		//  - - Verticals in composite sample, a number - - should be P04119. 
	// 		sampleObj["Param" + curParamNum++] = this.buildParamObj("P04119", this.getQuestionValue("verticalsInComposite"));

	// 		//  - - Rest time on Bed (for Bed load sample), seconds - - should be P04120.
	// 		sampleObj["Param" + curParamNum++] = this.buildParamObj("P04120", this.getTableQuestionValue("set" + setName + "_samplesTable_" + this.getCurrentSampleEventMethod(), "Rest time on Bed for Bed load sample, seconds", sampNum + 1));//TODO: test

	// 		//  - - Horizontal width of Vertical (for Bed load sample), feet - - should be P04121
	// 		sampleObj["Param" + curParamNum++] = this.buildParamObj("P04121", this.getTableQuestionValue("set" + setName + "_samplesTable_" + this.getCurrentSampleEventMethod(), "Horizontal width of Vertical, feet", sampNum + 1)); //TODO: test
	// 	}

	// 	return sampleObj;
	// }



	// buildSetObj(setName) {
	// 	let setObj = {
	// 		"Name": this.getQuestionValue('groupOfSamples') ? "Sngl" : setName,
	// 		"NumberOfSamples": this.getQuestionValue("set" + setName + "_numberOfSamplingPoints"),
	// 		"AnalyzeIndSamples": this.getQuestionValue("set" + setName + "_samplesComposited") ? 'N' : 'Y',
	// 		"Analyses": this.getQuestionValue("set" + setName + "_AnalysedFor_" + this.getQuestionValue("sedimentType")).join(","),
	// 		"SetType": this.getCurrentSampleEventMethod()
	// 	}

	// 	let ai = !this.getQuestionValue("set" + setName + "_samplesComposited");
	// 	let numOfSampleBlocks = ai ? this.getQuestionValue("set" + setName + "_numberOfSamplingPoints") : 1;

	// 	for (let i = 0; i < numOfSampleBlocks; i++) {
	// 		setObj["Sample" + i] = this.buildSampleObj(setName, i);
	// 	}

	// 	return setObj;
	// }

	// buildSampleEventtObj() {
	// 	let SEObj = {
	// 		"SedFF_version": PROGRAM_VERSION,
	// 		"Event": {
	// 			"EventNumber": 1,
	// 			"SiteId": this.getQuestionValue('stationNumber'),
	// 			"AgencyCd": this.getQuestionValue('agencyCode'),
	// 			"SedTranspMode": this.getQuestionValue('sedimentType'),
	// 			"SmplMediumCode": this.getQuestionValue('sampleMedium'),
	// 			"AvgRepMeasures": this.getQuestionValue('avgRepMeasures') ? 'Y' : 'N'
	// 		}
	// 	}

	// 	let numberOfSets = this.getNumberOfSetsInCurrentSamplingEvent();

	// 	for (let i = 0; i < numberOfSets; i++) {
	// 		let setName = String.fromCharCode(65 + i);
	// 		SEObj.Event["Set" + i] = this.buildSetObj(setName);
	// 	}
	// 	return SEObj;
	// }

	// getSelectedText(elementId) {
	// 	var elt = document.getElementById(elementId);

	// 	if (!elt || elt.selectedIndex === -1)
	// 		return null;

	// 	return elt.options[elt.selectedIndex].text;
	// }

	// getSedLOGINcompatibleXML() {
	// 	let SLCXML = {
	// 		"SedWE_data": this.buildSampleEventtObj()
	// 	}

	// 	var options = { compact: true, ignoreComment: true, spaces: 4 };
	// 	var result = xmljs.json2xml(SLCXML, options);

	// 	// remove numbers from "set"
	// 	var reg = /<Set\d+/g;
	// 	let cleanXML = result.replace(reg, "<Set")
	// 	reg = /<\/Set\d+/g;
	// 	cleanXML = cleanXML.replace(reg, "</Set")

	// 	// remove numbers from "sample"
	// 	reg = /<Sample\d+/g;
	// 	cleanXML = cleanXML.replace(reg, "<Sample")
	// 	reg = /<\/Sample\d+/g;
	// 	cleanXML = cleanXML.replace(reg, "</Sample")

	// 	// remove numbers from "param"
	// 	reg = /<Param\d+/g;
	// 	cleanXML = cleanXML.replace(reg, "<Param")
	// 	reg = /<\/Param\d+/g;
	// 	cleanXML = cleanXML.replace(reg, "</Param")

	// 	return cleanXML;
	// }



	// isFunction(functionToCheck) {
	// 	return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
	// }


	render() {
		const { classes, UI } = this.props;
		// 	{ (isReasonablyValidUsernameInLS())
		// 		? <div><Login setLoggedInUser={this.setLoggedInUser} />No one is logged in</div> 
		// }


		return (
			<React.Fragment>

				<div className={classes.root} >
					<AppBar
						position="absolute"
						className={classNames(classes.appBar, UI.visibility.expandedNavMenu && classes.appBarShift)}
					>
						<Toolbar disableGutters={!UI.visibility.expandedNavMenu}>
							<IconButton
								color="inherit"
								aria-label="expand drawer"
								onClick={() => this.props.setNavMenuExpand(true)}
								className={classNames(classes.menuButton, UI.visibility.expandedNavMenu && classes.hide)}
							>
								<ChevronRightIcon />
							</IconButton>

							<Typography variant="title" color="inherit" noWrap>
								{this.state.appBarText}
							</Typography>

							<IconButton
								color="inherit"
								aria-label="System Menu"
								onClick={() => this.props.setSysMenuExpand(true)}
								className={classNames(classes.menuButton, classes.rightJustify, UI.visibility.expandedSysMenu && classes.hide)}
							>
								<MenuIcon />
							</IconButton>
						</Toolbar>
					</AppBar>

					<NavMenu />

					<SystemMenu />
					<ExportDialog
					//TODO: REDUX
						setShippedStatus={this.setShippedStatus}
						getSedLOGINcompatibleXML={this.getSedLOGINcompatibleXML}
						username={this.state.loggedInUser}
						globalState={this.state}
					/>
					{/* <SyncDataDialog /> */}
					<AddRemoveQuestionDialog 
						//TODO: REDUX
						handleQuestionDialogClose={this.handleQuestionDialogClose}
						customQuestionAdder={this.customQuestionAdder}
						customQuestionDeleter={this.customQuestionDeleter} />
					<AddRemoveStationDialog /> 
					<SettingsDialog />
					<AboutDialog />
					<SwitchUserDialog />

					

					{/* <SystemDialog isOpen={this.state.dialogOpen}
						closeHandler={this.handleDialogClose}
						dialogQuestions={this.state.curDialogQuestions}
						dialogName={this.state.curDialogName}
						dialogDescription={this.state.curDialogDescription}
						stateChangeHandler={this.dialogQuestionChangeSystemCallback}
						dialogValues={this.state.dialogValues}
						globalState={this.state}
						setLoggedInUser={this.setLoggedInUser}
						addStation={this.addStation}
						removeStation={this.removeStation}
					/> */}



					
					{/* <QuestionDialog isOpen={this.state.questionDialogOpen}
						
					/> */}

					<main className={classes.content} >
						<div className={classes.toolbar} />  {/*to push down the main content the same amount as the app titlebar */}

						{/* {this.state.routesAndPages} */}
						<Switch>
							<Route exact path="/" component={Dashboard} />
							<Route path="/Dashboard" component={Dashboard} />
							<Route path="/FieldForm" component={FieldForm} />
							<Route path="/DataEntry" component={DataEntry} />
							<Route path="/Parameters" component={Parameters} />
							<Route path="/QWDATA" component={QWDATA} />
							<Route path="/error" component={ErrorPage} />
						</Switch>


						{/* {!isReasonablyValidUsernameInLS() && this.props.location.pathname !== '/'
							? <Redirect to='/' />
							: null} */}

					</main>
				</div >
				<button onClick={() => console.log(this.props)}>Print Props</button>
				<button onClick={() => this.props.setLoginDialogVisibility(true)}>Set True</button>
				{this.props.user.settings.backupInterval}
				{/* <pre>{JSON.stringify(this.props.user)}</pre> */}
				{/* <pre>{JSON.stringify(this.props.UI.visibility)}</pre> */}
			</React.Fragment>
		);
	}
}

WebFF.propTypes = {
	classes: PropTypes.object.isRequired
};

const mapStateToProps = function (state) {
	return {
		UI: state.UI,
		users: state.Users,
		sedff: state.SedFF
	}
}

const mapDispatchToProps = {
	setLoginDialogVisibility: setLoginDialogVisibility,
	setCurrentUser: setCurrentUser,
	setNavMenuExpand: setNavMenuExpand,
	setSysMenuExpand: setSysMenuExpand,
	loadUserData: loadUserData
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles, { withTheme: true })(WebFF)));