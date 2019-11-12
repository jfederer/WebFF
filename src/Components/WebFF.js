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
import loading from '../Images/loading.gif';
import _ from 'lodash';

import { styles } from '../style';
import 'typeface-roboto';
import {
	Route,
	Switch,
	Redirect
} from 'react-router-dom';

// import { isReasonableUsername, ensureProgramVersionUpToDate } from '../Utils/ValidationUtilities';
import { isReasonableUsername } from '../Utils/ValidationUtilities';

// import { DATA_ENTRY_INFORMATION_IDENTIFIER } from '../Constants/Config';

import { setSysMenuExpand, setNavMenuExpand, setLoginDialogVisibility, hideQuestion } from '../Actions/UI';
import { loadAndSetCurrentUser } from '../Actions/SedFF';

//utils
// import { getDescriptiveColumnForTable, getQuestionValue } from '../Utils/QuestionUtilities';

//dialogs
import ExportDialog from './Dialogs/ExportDialog';
import SwitchUserDialog from './Dialogs/SwitchUserDialog';
import SettingsDialog from './Dialogs/SettingsDialog';
import LoginDialog from './Dialogs/LoginDialog';

// import SettingsDialog from './Dialogs/SettingsDialog';
import AboutDialog from './Dialogs/AboutDialog';
import AddRemoveQuestionDialog from './Dialogs/AddRemoveQuestionDialog';
import AddRemoveStationDialog from './Dialogs/AddRemoveStationDialog';

// menus 
import SystemMenu from './Menus/SystemMenu.js';
import NavMenu from './Menus/NavMenu.js';

// pages
import Dashboard from './Pages/Dashboard/Dashboard';
import FieldForm from './Pages/FieldForm';
import DataEntry from './Pages/DataEntry/DataEntry';
import Parameters from './Pages/Parameters';
import QWDATA from './Pages/QWDATA';
import EventSummary from './Pages/EventSummary';
import ErrorPage from './Errors/ErrorPage';

//TEST
import { setDBInfo, fetchDBInfo } from '../Utils/NetworkUtilities';
import { EVENTS_LINK_TABLE_TYPE, STATIONS_LINK_TABLE_TYPE } from '../Constants/Dictionary';
import { getEventFromID, getStationFromID, getStationIDsFromName } from '../Utils/StoreUtilities';
import { loadAllUserEventsFromDB, loadAllUserStationsFromDB, pushEventToDB, pushLinkTableToDB, pushStationToDB } from '../Actions/DB';
import { getQuestionValue } from '../Utils/QuestionUtilities';
const FUNCDEBUG = false;


class WebFF extends React.Component {


	//Waiting on KEN:
	//TODO: test save sedlogin compat xml


	//Q:  Should "bank" be required in station setup?
	//Q:  custom question -> answered -> something occurs so it doens't apply (station change, for example) ... what do I do with that data?
	//Q:  event summary --> conceptualize for me.
	//Q: can I convert?? --> compare to providing access
	//Q: "start/end edge of water / sampling zones ...  do they have specific pcodes? transpose Pcodes for start/end edge/sampling zones?
	//Q: should EWI distance be editable?

	//BREAKING:
	//TODO: webserver, network loads
	//TODO: push event to sedlogin
	//TODO: date modified on all stations, linkTables, events, user modifications
	//TODO: add checks for uploads/downloads on all stations/links/events/user

	//BUGS: 
	//MAke event (event1) using staton1 ... at some point outside that event, remove station1 ... when going back to event1, the station will switch to next available in list
	//Remove currently-active station in event using dialog.
	//BUG: Dashboard -> EventManger -> Event Summary -> BAck Button ... sends you to the FF page.
	//BUG: average rep measures (from adding a second set) sticks around on a new event....  (Should get fixed if we reset UI before loading event)
	//BUG: why is are we getting samples composited and "this is a group of samples" in an undefind panel on event summary (the problem is not event summary, the problem is that these are undefined)
	//BUG: not correctly estimating time on first load of qwdata page...
	//BUG: cleanup missing events from link table?
	//BUG: USER_STATIONS_LIST_LOAD_COMPLETE fires (adn presumably the similar event function) before the inside of the promise -- learn about nested promises  (non-user-affecting at this point)
	//BUG: when current event is deleted, should reset nav...
	
	//TEST:
	//TODO: does getQuestionsData not include [DATA_ENTRY_INFORMATION_IDENTIFIER + SUSPENDED_TEXT]: ... (the DE stuff)
	// hide/show panel button
	// Add/REmove station
	// remove station that is set as the station for a different event
	//TODO: switching events (load event) doesn't re-build/re-generate/re-default the questionsData
	//TODO: add icons (setting) / check scrolling for sediemnt type tabs
	//TODO: loading from secondary pages in event manager
	//TODO: check implications of removing station that was used on previous event... (ie: new event A, set station to X, new event B, remove station X, load original event A.... ?)

	//SHOULD:
	//TODO: Questions data is really large for each event... shrink somehow?
	//TODO: import/export
	//TODO: Style sheet
	//TODO: auto-estimate time on first load of QWDATA
	//TODO: new event from old... (pseudo-event)
	//TODO: template manager/event copy
	//TODO: system menu rebuild  (import/export move?)
	//TODO: disable system menu buttons when they can't apply
	//TODO: avgrepmeas -> alert/confirm
	//TODO: rememver current sediment type from page to page
	//TODO: single-page view 
	//TODO: single-page view saveable as pdf (ingest pdf??)
	//TODO: save entire event as xml
	//TODO: switching events doesn't do the nav bar right
	//TODO: user/site settings (station names, remember what sediment type tab, etc)
	//TODO: validators (numSampPoints not allowing alpha might be good test case)
	//TODO: templates	
	//TODO: Warn/notify when selecting composite on a set (will remove data from QWDATA and parameters table)
	//TODO: duplicate just stationing (vs all - optionally) from set to set ... even existing?
	// TODO: If they DON'T fill in Waterway Info, they should be able to enter Stream Width (P00004) by hand.  QWDATA can also accept this if left blank.

	//TODO: create a 'settings' node with things like 'usePaper' and 'syncDelay'.  In the future, include other settings like "availableSamplers" } from '../Utils/Constants';
	//TODO: verify my dbResponse are returning wtih upsert info vs failure messages
	//TODO: "remove set" button on sets

	//Would be nice:
	//TODO: "Station manager" - include extra waterway info, include "duplicate", include 'edit'
	//TODO: "question manager" - include "duplicate" (Saved elsewhere), include 'edit'
	//tODO: default value for custom questions
	//TODO: Bridge wizard 
	//TODO: "recalculate" button appears in EWI table if data doesn't match calculated
	//TODO: Auto-estimate on first load of QWDATA table...  (Setting?)
	//TODO: settings: 
	// paper vs no... 
	// auto-estimate vs no ...
	// add/remove sampler types from lists  (and other long drop-downs)
	//TODO: settings dialog
	//TODO: remove set (delete question does this... but make it easier with button from DE page)
	//TODO: rename sets
	//TODO: station editor
	//TODO: QWDATA page, time estimate -> optionally overwrite
	//TODO: QWDATA page, duplicate date for remaining...
	//TODO: set orders in QD
	//TODO: settings -> auto fill out avaialble station information from station values
	//TODO: NEXT: Do not allow duplicate station names (add/remove dialog... disable add button when duplicate name exists)
	//TODO: no duplicate station names for a given user
	//TODO: add-on analysis keeps options for things that apply to entire set... should filter them out (did at one point... bug)
	//TODO: different summary settings (different layouts, etc)
	//BUG: have add/remove station drop down not actually change the value to add/remove...    start
	//TODO: export dialog allows event selection...   (revampe to import/export dialog?)
	//TODO: auto-add first set as setting
	// allow custom set names in settings
	// warning for estimating time on QW pag eshould change if there aren't times available on DE page
	// option to copy custom questions from station / user / event to another station / user / event
	// secure setDBInfo ... (could be used nefariously)
	// add "didInvalidate" to User...

	//Cleanup
	//TODO: Set-Sample-Dist column gives "NAN"...
	//TODO: why is tabbed pages setting values in paramters and qwdata pages?
	//TODO: move bag/bottle/nozzel actions from actions to DEChangeHandler like with IET panel
	//TODO: Multiple Sampling evnts at same time...
	//TODO: move checkForValidSedimentType to QuestionUtilities or Utilites
	//TODO: disable bag material / size / nozzel until after sampler type is selected?  ("Disable question" action?)
	//OPTIMIZE default set infomration stroage in store (storing full questisonsdata for sets repeatedly... not great)
	//TODO: Nozzle material and diameter show 'value' rather than display value... niceity.
	//TODO: Drop down for 'Panel name' on add question. include blank/typing option too.. type-ahead might be enough
	//OPTIMIZE: getNumberOfSamplesInSet, getQuestionValue, and others are called a lot in dialog on parameters table... looks like reconstructing descriptive column each update
	//TODO: add 'options' argument to createComponents so we can add parentComponentNames (and other items) to it rather than assuming parent of a set is a data entry sheet (which is is, but still)...
	//FIXME: Look at passed questions data on question page render... from DataEntry object, the questions all appear to be doubled up...
	//TODO: removing the last user link to a station... remove the station.




	constructor(props) {
		if (FUNCDEBUG) console.log("FUNC: WebFF Constructor");

		super(props);

		this.state = {
			usr: {}
		};

		// if (isReasonablyValidUsernameInLS()) {
		// 	// load all events from LS if the user is logged in. // TODO: this is a kludge bugfix for when people refresh the page
		// 	let allNodeNames = Object.keys(localStorage);
		// 	for (let i = 0; i < allNodeNames.length; i++) {
		// 		if (allNodeNames[i].startsWith(SAMPLING_EVENT_IDENTIFIER)) {
		// 			let SE = JSON.parse(localStorage.getItem(allNodeNames[i]));
		// 			if (SE.user === this.state.loggedInUser) {
		// 				this.state[allNodeNames[i]] = SE;
		// 			}
		// 		}
		// 	}
		// }
	}

	componentWillMount() { //FUTURE: could load just the missing parts insted of everything if just a single node is missing
		if (FUNCDEBUG) console.log("FUNC: componentWillMount()");
		// this.setState({ showLoadingApp: true }); //TODO: redux, leading sign, false after load complete.

		if (navigator.onLine) {
			// ensureProgramVersionUpToDate();
		}

		if (isReasonableUsername(this.props.sedff.currentUsername)) {
			console.log(this.props.sedff.currentUsername + "is logged in");
			this.props.loadAndSetCurrentUser(this.props.sedff.currentUsername);
			// this.gatherUserConfig(USER_DB_NODES); // after setting loggedInUser, load user configuration);
		} else {
			console.log("No one is logged in... requesting user id");
			this.props.setLoginDialogVisibility(true);
			// this.buildRoutesAndRenderPages(); // router handles showing the login
		}

	}


	render() {
		const { classes,
			appBarText,
			expandedSysMenu,
			expandedNavMenu,
			currentUser,
			isFetchingUserData,
			fetchingUserDataComplete } = this.props;

		if (currentUser === undefined && this.props.location.pathname !== '/') {
			// if (currentUser === undefined) {
			console.log("There is no currentuser...going to login page");
			return <Redirect to='/' />;
		}

		return (
			<React.Fragment>
				{isFetchingUserData === true
					? <img src={loading} alt="LOADING"></img>  //TODO:  better behavior
					: null}

				<React.Fragment>
					<div className={classes.root} >
						<AppBar
							position="absolute"
							className={classNames(classes.appBar, expandedNavMenu && classes.appBarShift)}
						>
							<Toolbar disableGutters={!expandedNavMenu}>
								<IconButton
									color="inherit"
									aria-label="expand drawer"
									onClick={() => this.props.setNavMenuExpand(true)}
									className={classNames(classes.menuButton, expandedNavMenu && classes.hide)}
								>
									<ChevronRightIcon />
								</IconButton>

								<Typography variant="h4" color="inherit" noWrap>
									{appBarText}
								</Typography>

								<IconButton
									color="inherit"
									aria-label="System Menu"
									onClick={() => this.props.setSysMenuExpand(true)}
									className={classNames(classes.menuButton, classes.rightJustify, expandedSysMenu && classes.hide)}
								>
									<MenuIcon />
								</IconButton>
							</Toolbar>
						</AppBar>

						<NavMenu />

						<SystemMenu />
						<LoginDialog />
						{fetchingUserDataComplete === true ? <React.Fragment>
							<ExportDialog
								//TODO: REDUX
								eventID={this.props.currentSamplingEventID}
								setShippedStatus={this.setShippedStatus}
								username={this.state.loggedInUser}
								globalState={this.state}
							/>
							<AddRemoveQuestionDialog />
							<AddRemoveStationDialog />
							<SettingsDialog />
							<AboutDialog />
							<SwitchUserDialog />
						</React.Fragment>
							: null}


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
								<Route path="/EventSummary/:eventID" component={EventSummary} />

								<Route path="/error" component={ErrorPage} />
							</Switch>


							{/* {!isReasonablyValidUsernameInLS() && this.props.location.pathname !== '/'
							? <Redirect to='/' />
							: null} */}

						</main>
					</div >
				</React.Fragment>

				<button onClick={this.doTestPull}>TEST PULL</button>
				<button onClick={this.usrMod}>INT to 300</button>
				<button onClick={this.doTestPush}>TEST PUSH</button>
				<button onClick={this.doTestPushUser}>TEST PUSH USER</button>
				<button onClick={this.doTestEventTable}>TEST PUSH EVENT TABLE</button>
				<button onClick={this.doTestStationTable}>TEST PUSH STATION TABLE</button>
				<button onClick={this.doTestPushEvent}>TEST PUSH EVENT</button>
				<button onClick={this.doTestPushStation}>TEST PUSH STATION</button>
				<br></br>
				Actions
				<br></br>
				<button onClick={this.doTestPushEvent_Action}>TEST PUSH USER EVENT</button>
				<button onClick={this.doTestPushEventsTable_Action}>TEST PUSH EVENT TABLE</button>
				<button onClick={this.doTestAllUserEvents_Action}>TEST GET ALL USER EVENTS</button>
				<br></br>
				<button onClick={this.doTestPushStation_Action}>TEST PUSH STATION</button>
				<button onClick={this.doTestPushStationsTable_Action}>TEST PUSH STATIONS TABLE</button>
				<button onClick={this.doTestAllUserStations_Action}>TEST GET ALL USER STATIONS</button>
				<button onClick={this.doTestPushAllUserStations_Action}>TEST PUSH ALL USER STATIONS</button>
				<br>
				</br>	
				<br>
				</br>	
				<br>
				</br>	
			</React.Fragment>

		);
	}


	doTestPushEvent_Action = () => {  //DONE  (push all events)
		console.log("doTestPushEvent_Action");
		this.props.pushEventToDB(getEventFromID(this.props.currentSamplingEventID));
	}

	doTestPushEventsTable_Action = () => { //DONE
		console.log("doTestPushEventsTable_Action");
		this.props.pushLinkTableToDB(EVENTS_LINK_TABLE_TYPE, 'jfederer@usgs.gov');
	}

	doTestAllUserEvents_Action = () => { //DONE
		console.log("doTestAllUserEvents_Action");
		this.props.loadAllUserEventsFromDB('jfederer@usgs.gov');
	}

	doTestPushStation_Action = () => { //DONE
		console.log("doTestPushStation_Action");
		let stationName = getQuestionValue(this.props.currentSamplingEventID, 'stationName');
		this.props.pushStationToDB(getStationFromID(getStationIDsFromName('jfederer@usgs.gov', stationName)[0]));  // need to get the station object itself, first
	}

	doTestPushStationsTable_Action = () => { //DONE
		console.log("doTestPushStationsTable_Action");
		this.props.pushLinkTableToDB(STATIONS_LINK_TABLE_TYPE, 'jfederer@usgs.gov');
	}

	doTestAllUserStations_Action = () => {
		console.log("doTestAllUserStations_Action");
		this.props.loadAllUserStationsFromDB("jfederer@usgs.gov");
	}

////////////////////////////////

	// usrMod = () => {
	// 	let newUsr = _.cloneDeep(this.state.usr);
	// 	newUsr.settings.backupInterval = 300;
	// 	this.setState({ usr: newUsr });
	// }

	// doTestPull = () => {
	// 	fetchDBInfo({ key: "username", value: "jfederer@usgs.gov" },
	// 		"Users",
	// 		(dbResponse) => {
	// 			if (Array.isArray(dbResponse) && dbResponse.length === 1) {
	// 				this.setState({ usr: dbResponse[0] })
	// 			} else {
	// 				console.log("dbResponse did not return user"); //TODO: do check for username/etc..
	// 			}
	// 		},
	// 		(res) => alert("TEST FAILURE" + res));
	// }
	// doTestPush = () => {
	// 	setDBInfo({ key: "username", value: "jfederer@usgs.gov" },
	// 		"Users",
	// 		this.state.usr,
	// 		(res) => alert("TEST SUCCESS! " + JSON.stringify(res)),
	// 		(res) => alert("TEST FAILURE" + res));
	// }
	// doTestPushUser = () => {
	// 	let username = "jfederer@usgs.gov";
	// 	setDBInfo({ key: "username", value: username },
	// 		"Users",
	// 		this.props.users[username],
	// 		(res) => alert("TEST SUCCESS! " + JSON.stringify(res)),
	// 		(res) => alert("TEST FAILURE" + res));
	// }
	// doTestEventTable = () => {
	// 	let username = "jfederer@usgs.gov";
	// 	linkTablePush(EVENTS_LINK_TABLE_TYPE, 
	// 		username, 
	// 		{username: username,
	// 			events: this.props.eventLinkTables[username]},
	// 		(res) => alert("WEBFF SUCCESS CB! " + res),
	// 		(res) => alert("WEBFF FAILURE CB! " + res)
	// 	);
	// }
	// doTestStationTable = () => {
	// 	let username = "jfederer@usgs.gov";
	// 	linkTablePush(STATIONS_LINK_TABLE_TYPE, 
	// 		username, 
	// 		{username: username,
	// 			events: this.props.stationLinkTables[username]},
	// 		(res) => alert("WEBFF SUCCESS CB! " + res),
	// 		(res) => alert("WEBFF FAILURE CB! " + res)
	// 	);
	// }
	// doTestStationTable = () => {
	// 	let username = "jfederer@usgs.gov";
	// 	linkTablePush(STATIONS_LINK_TABLE_TYPE, 
	// 		username, 
	// 		{username: username,
	// 			events: this.props.stationLinkTables[username]},
	// 		(res) => alert("WEBFF SUCCESS CB! " + res),
	// 		(res) => alert("WEBFF FAILURE CB! " + res)
	// 	);
	// }
	// doTestPushEvent = () => {
	// 	let username = "jfederer@usgs.gov";
	// 	eventPush(username, 
	// 		getEventFromID(this.props.currentSamplingEventID),
	// 		(res) => alert("WEBFF SUCCESS CB! " + res),
	// 		(res) => alert("WEBFF FAILURE CB! " + res)
	// 	);
	// }






	// if (navigator.onLine) { //TODO: host reachable: https://stackoverflow.com/questions/2384167/check-if-internet-connection-exists-with-javascript
	// 			if (DEBUG) console.log("Online!... going to fetch from DB.");
	// 			this.getUserConfigFromLS(nodesToGather, null, () => console.log("Done gathering from LS, looking at DB"));

	// 			this.fetchDBInfo(this.state.loggedInUser, 'users',
	// 				(JSONresponse) => {
	// 					if (DEBUG) console.log("JSONresponse: ", JSONresponse);

	// 					// check that this user even exists in database
	// 					if (JSONresponse.length > 1) {
	// 						throw new Error("User query for '" + this.state.loggedInUser + "' returned more than one result.  Please contact jfederer@usgs.gov to resolve.");
	// 					}

	// 					if (JSONresponse.length === 0) {
	// 						// this user did not exist in the database - we must create their entry
	// 						this.createNewUser(this.state.loggedInUser);
	// 					};

	// 					if (JSONresponse.length === 1) {
	// 						// this user exists in the database
	// 						let userData = JSONresponse[0];

	// 						//  exact nodesToGather from the user data into nodeArr
	// 						for (let i = 0; i < nodesToGather.length; i++) {
	// 							let nodeArr = [];
	// 							if (DEBUG) console.log("Extracting: ", nodesToGather[i]);

	// 							userData[nodesToGather[i]].forEach((configNode) => {
	// 								if (DEBUG) console.log("userData[" + nodesToGather[i] + "]: ", configNode);
	// 								// yes, this is basically destructing and reconstructing an array.  This is being done for easier error checking in the future. (perhaps not actually easier)
	// 								//TODO: error and duplication checking 
	// 								nodeArr.push(configNode);
	// 							});

	// 							// put nodeArr (the data extracted from userData) into approparite place in state
	// 							this.setState({ [nodesToGather[i]]: nodeArr }, () => {
	// 								this.buildCombinedQuestionsData(() => {
	// 									this.buildRoutesAndRenderPages();
	// 								});
	// 							});
	// 						}

	// 						// pull sampling events from DB response
	// 						let allNodeNames = Object.keys(userData);
	// 						for (let i = 0; i < allNodeNames.length; i++) {
	// 							if (allNodeNames[i].startsWith(SAMPLING_EVENT_IDENTIFIER)) {
	// 								console.log("Attempting to load " + allNodeNames[i] + " from DB.");
	// 								// if (localStorage.getItem(allNodeNames[i])) {
	// 								// 	console.log(allNodeNames[i] + " is in LS.  Ignoring DB values for this.");
	// 								// 	continue;
	// 								// }
	// 								if (userData[allNodeNames[i]].deleted) {
	// 									console.log(allNodeNames[i] + " is a previously-deleted event. Ignoring DB values for this.");
	// 									continue;
	// 								}

	// 								this.conditionallyIngestSE(userData[allNodeNames[i]], () => {
	// 									// this.addToItemsToSyncToLS(allNodeNames[i]);
	// 									this.buildRoutesAndRenderPages();
	// 								});

	// 								// loading Event from DB into LS
	// 								// this.setState({ [allNodeNames[i]]: userData[allNodeNames[i]] }, () => {
	// 								// 	this.addToItemsToSyncToLS(allNodeNames[i]);
	// 								// 	this.buildRoutesAndRenderPages();
	// 								// });
	// 							}
	// 						}
	// 					} // end one user found in DB

	// 					// after loading everything we can from DB 
	// 					// (This is still the callback from the fetchDB call), 
	// 					// let's load everything we can from LS.
	// 					this.getUserConfigFromLS(nodesToGather);
	// 				},
	// 				() => {
	// 					console.warn("Call to DB failed, attempting to gather from LS");
	// 					this.getUserConfigFromLS(nodesToGather)
	// 				}
	// 			); // end fetchDB callback

	// 		} else {
	// 			// not online
	// 			this.getUserConfigFromLS(nodesToGather, null, () => console.log("TODO: redirect to Error page with 'not online and not enough data in LS to function' error"));

	// 		}
	// 		// set syncInterval for database backups
	// 		var syncInterval = setInterval(() => this.updateDatabase(), this.state.syncDelay);
	// 		this.setState({ syncIntervalFunction: syncInterval });
	// 	}


}

WebFF.propTypes = {
	classes: PropTypes.object.isRequired
};

const mapStateToProps = function (state) {
	return {
		expandedSysMenu: state.UI.visibility.expandedSysMenu,
		expandedNavMenu: state.UI.visibility.expandedNavMenu,
		appBarText: state.UI.appBarText,
		users: state.Users,
		sedff: state.SedFF,
		isFetchingUserData: state.SedFF.isFetchingUserData,
		fetchingUserDataComplete: state.SedFF.fetchingUserDataComplete,
		events: state.Events,
		currentUser: state.Users[state.SedFF.currentUsername],
		currentSamplingEventID: state.SedFF.currentSamplingEventID,
		eventLinkTables: state.SamplingEventsLinkTables,
		stationLinkTables: state.StationsLinkTables

	}
}

const mapDispatchToProps = {
	setLoginDialogVisibility,
	loadAndSetCurrentUser,
	setNavMenuExpand,
	setSysMenuExpand,
	hideQuestion,

	loadAllUserEventsFromDB,
	loadAllUserStationsFromDB,
	pushEventToDB,
	pushStationToDB,
	pushLinkTableToDB
	
}


export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(WebFF)));