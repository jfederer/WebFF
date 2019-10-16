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
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import loading from '../Images/loading.gif';

import { styles } from '../style';
import 'typeface-roboto';
import {
	Route,
	Switch,
	Redirect
} from 'react-router-dom';

import { isReasonablyValidUsernameInLS, isReasonableUsername, ensureProgramVersionUpToDate } from '../Utils/ValidationUtilities';

import {
	USER_DB_NODES, SAMPLING_EVENT_IDENTIFIER,
	dialogQuestions, defaultHiddenTabs, defaultHiddenPanels, DATA_ENTRY_INFORMATION_IDENTIFIER
	// QUESTION_ID_STRINGS_THAT_FORCE_PROPAGATION, MAX_NUM_OF_SETS, QIDS_LINKED_TO_STATION_NAME
} from '../Constants/Config';   //TODO: create a 'settings' node with things like 'usePaper' and 'syncDelay'.  In the future, include other settings like "availableSamplers" } from '../Utils/Constants';

import { setSysMenuExpand, setNavMenuExpand, setLoginDialogVisibility, hideQuestion } from '../Actions/UI';
import { loadAndSetCurrentUser } from '../Actions/SedFF';

//utils
// import { getDescriptiveColumnForTable, getQuestionValue } from '../Utils/QuestionUtilities';

//dialogs
import ExportDialog from './Dialogs/ExportDialog';
import SwitchUserDialog from './Dialogs/SwitchUserDialog';
import SettingsDialog from './Dialogs/SettingsDialog';

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

const FUNCDEBUG = false;



class WebFF extends React.Component {

	//KEN:
	//TODO: test save sedlogin compat xml
	//TODO: push event to sedlong
	//TODO: 'stream depth for IET test' doesn't make it to XML... issue?
	//TODO: 'transit rate for IET test' doesn't make it to XML... issue?
	//TODO: 'ratio of vertical' doesn't make it to XML... issue?
	//TODO: 'intake efficiency' doesn't make it to XML... issue?
	//TODO: "Sampling depth" doesn't go into XML?


	//BREAKING:
	//TODO: switching events (load event) doesn't re-build/re-generate/re-default the questionsData
		//TODO: loading event should reset nav menu (both remove and add items as needed)
	//TODO: custom questions don't render on the tabbed pages anymore because we aren't generating them the same way anymore...
	//TODO: system menu rebuild
	//TODO: Style sheet
		//TODO: getQuestionsData needs to get updated in eventID...
		//TODO: does getQuestionsData not include [DATA_ENTRY_INFORMATION_IDENTIFIER + SUSPENDED_TEXT]: ... (the DE stuff)
	//TODO: webserver, network loads
	//FIXME: link tables fall appart if entry doesn't already exist -- larger concept for when nothing exists... hold up until loaded from network.  Some things can be built on fly (This likely a good example).
	//TODO: Does not check for updated data outside localstorage

	//BUGS: 
	//TODO: paramters and qwdata table don't appear to load existing info from loaded event
	//TODO: FIXME: TODO: FIXME: MUST copy default questions data values into event values... because if questions data changes, future events could change because the default from QD might no longer be accurate
	//TODO: setname can be Sngl - this could break XML
	//BUG: New Event -> DE page -> enter # sampling points -> FF page -> change sampling method -> DE page (bug: empty table)
	//BUG: New Event -> DE page -> enter '1' as sampling points (bug: says table must shrink)
	//BUG: New Event -> Bedload -> DE page -> select some multi-choice options (bug: the options dissapear)
	//BUG: New Event -> DE page -> Add Set -> enter numbe of sampling points -> leave page -> return (bug: table is missing)
	//BUG: New Eent -> DE page -> Add Set -> Dashboard -> New Event -> QWDATA page (bug: nothing there - should hide QWDATA tab on making new event or when pre-reqs aren't met (ditto param))
	//BUG: Add default value in defaultSetInformationQuestionsData to startTime input -> created question has props.value === "" instead of the default value.
	//BUG: New Event -> DE page -> enter # of samp points -> QWDATA page -> Select add-on analysis -> DE page -> select anaysis that includes add-on -> QWDATA page -> select previously-set Add-on button (bug: no options for add-on analysis)
	//BUG: New Event -> Bottom Material -> DE page -> # of samples -> QWDATA page -> descriptive column says 'undefined' 
	//BUG: New Event -> pick sampling methods -> select "Not sampled" for one of them... tab dissapears.  reselecting a non-"not sampled" brings it back.
	//BUG: New Event -> Pick Method -> DE page -> do something -> FF page -> return to DE ... original DE data gone from event in store.
	//Remove currently-active station in event using dialog.
	//BUG: Dashboard -> EventManger -> Event Summary -> BAck Button ... sends you to the FF page.
	//BUG: average rep measures (from adding a second set) sticks around on a new event....  (Should get fixed if we reset UI before loading event)
	//BUG: why is are we getting samples composited and "this is a group of samples" in an undefind panel on event summary (the problem is not event summary, the problem is that these are undefined)

	//TEST:
	// Add/REmove station
	//TODO: add icons (setting) / check scrolling for sediemnt type tabs
	//TODO: loading from secondary pages in event manager
	//TODO: check implications of removing station that was used on previous event... (ie: new event A, set station to X, new event B, remove station X, load original event A.... ?)

	//SHOULD:
	//tODO: waterway info question type
	//TODO: rememver current sediment type from page to page
	//TODO: single-page view 
	//TODO: single-page view saveable as pdf (ingest pdf??)
	//TODO: save entire event as xml
	//TODO: switching events doesn't do the nav bar right
	//TODO: user/site settings (station names, etc)
	//TODO: validators (numSampPoints not allowing alpha might be good test case)
	//TODO: templates	
	//TODO: Warn/notify when selecting composite on a set (will remove data from QWDATA and parameters table)
	//TODO: duplicate just stationing (vs all - optionally) from set to set ... even existing?
	// TODO: If they DON'T fill in Waterway Info, they should be able to enter Stream Width (P00004) by hand.  QWDATA can also accept this if left blank.

	//Would be nice:
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

	//Cleanup
	
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

		var allItemsToSyncToLS = USER_DB_NODES.slice();

		allItemsToSyncToLS.push("loggedInUser", "curSamplingEventName", "needsToUpdateDB");

		this.state = {

			// system config
			// questionsData: questionsData,
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

			// hiddenTabs: defaultHiddenTabs,
			// hiddenPanels: defaultHiddenPanels,

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
	}

	componentWillMount() { //FUTURE: could load just the missing parts insted of everything if just a single node is missing
		if (FUNCDEBUG) console.log("FUNC: componentWillMount()");
		// this.setState({ showLoadingApp: true }); //TODO: redux, leading sign, false after load complete.

		if (navigator.onLine) {
			ensureProgramVersionUpToDate();
		}

		if (isReasonableUsername(this.props.sedff.currentUsername)) {
			console.log(this.props.sedff.currentUsername + "is logged in");
			this.props.loadAndSetCurrentUser(this.props.sedff.currentUsername);
			// this.gatherUserConfig(USER_DB_NODES); // after setting loggedInUser, load user configuration);
		} else {
			console.log("No one is logged in... requesting user id");
			// this.buildRoutesAndRenderPages(); // router handles showing the login
		}

	}


	testFunc(props) {
		props.hideQuestion(["stationNumber"]);
		props.hideQuestion([DATA_ENTRY_INFORMATION_IDENTIFIER + "Suspended", "bagMaterial"]);
	}

	render() {
		const { classes, sedff, UI, currentUser } = this.props;
		const { isFetchingUserData } = sedff;

		if (currentUser === undefined && this.props.location.pathname !== '/') {
			console.log("There is no currentuser...going to login page");
			return <Redirect to='/' />;
		}





		return (
			<React.Fragment>
				{isFetchingUserData === true
					? <img src={loading} alt="LOADING"></img>  //TODO:  better behavior
					: <React.Fragment>
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

									<Typography variant="h4" color="inherit" noWrap>
										{UI.appBarText}
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
								eventID={this.props.currentSamplingEventID}
								setShippedStatus={this.setShippedStatus}
								username={this.state.loggedInUser}
								globalState={this.state}
							/>
							{/* <SyncDataDialog /> */}
							<AddRemoveQuestionDialog />
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
									<Route path="/EventSummary/:eventID" component={EventSummary} />

									<Route path="/error" component={ErrorPage} />
								</Switch>


								{/* {!isReasonablyValidUsernameInLS() && this.props.location.pathname !== '/'
							? <Redirect to='/' />
							: null} */}

							</main>
						</div >
						{/* <button onClick={() => this.props.loadAndSetCurrentUser("username@email.com")}>LASCU</button><br /> */}
						{/* <pre>{JSON.stringify(this.props.user)}</pre> */}
						{/* <pre>{JSON.stringify(this.props.UI.visibility)}</pre> */}
					</React.Fragment>
				}
				{/* <Button onClick={()=>console.log(getActiveSedimentTypes(this.props.currentSamplingEventID))}>TEST</Button> */}
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
		sedff: state.SedFF,
		events: state.Events,
		currentUser: state.Users[state.SedFF.currentUsername],
		currentSamplingEventID: state.SedFF.currentSamplingEventID
	}
}

const mapDispatchToProps = {
	setLoginDialogVisibility,
	loadAndSetCurrentUser,
	setNavMenuExpand,
	setSysMenuExpand,
	hideQuestion
}


export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(WebFF)));