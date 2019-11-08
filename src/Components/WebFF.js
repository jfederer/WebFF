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

import { styles } from '../style';
import 'typeface-roboto';
import {
	Route,
	Switch,
	Redirect
} from 'react-router-dom';

import { isReasonableUsername, ensureProgramVersionUpToDate } from '../Utils/ValidationUtilities';

import { DATA_ENTRY_INFORMATION_IDENTIFIER } from '../Constants/Config';  

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

const FUNCDEBUG = false;



class WebFF extends React.Component {

	//KEN:
	//TODO: test save sedlogin compat xml
	//TODO: push event to sedlogin
	//TODO: add set automatically

	//Q:  Should "bank" be required in station setup?
	
	

	//USERs:
	// event summary --> conceptualize for me.

	//BREAKING:
	//Q: percentages in distance column, or separate new read-only column?  (READ ONLY COLUMN)
	//TODO: webserver, network loads
		//TODO: Does not check for updated data outside localstorage
	//TODO: custom questions don't render on the tabbed pages anymore because we aren't generating them the same way anymore...
				// on FF page -- user & eventQ's show ... station does not.
				// on FF page -- user and eventQ's 
	//TODO: system menu rebuild
	//TODO: Style sheet
	//TODO: does getQuestionsData not include [DATA_ENTRY_INFORMATION_IDENTIFIER + SUSPENDED_TEXT]: ... (the DE stuff)
	//TODO: import/export
	//TODO: can I convert?? --> compare to providing access
	//TODO: transpose Pcodes for start/end edge/sampling zones

	//BUGS: 
	//TODO: station custom questions didn't render on field form
	//TODO: paramters and qwdata table don't appear to load existing info from loaded event
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
	//BUG: not correctly estimating time on first load of qwdata page...

	//TEST:
	// Add/REmove station
	// remove station that is set as the station for a different event
	//TODO: switching events (load event) doesn't re-build/re-generate/re-default the questionsData
	//TODO: add icons (setting) / check scrolling for sediemnt type tabs
	//TODO: loading from secondary pages in event manager
	//TODO: check implications of removing station that was used on previous event... (ie: new event A, set station to X, new event B, remove station X, load original event A.... ?)

	//SHOULD:
	
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
	//TODO: disable system menu buttons when they can't apply
	 //TODO: create a 'settings' node with things like 'usePaper' and 'syncDelay'.  In the future, include other settings like "availableSamplers" } from '../Utils/Constants';


	//Would be nice:
	//TODO: "remove set" button on sets
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

		// var allItemsToSyncToLS = USER_DB_NODES.slice();

		// allItemsToSyncToLS.push("loggedInUser", "curSamplingEventName", "needsToUpdateDB");

		this.state = {
			//v2




			//unknown use below...

			// system config
			// questionsData: questionsData,
			// dialogQuestions: dialogQuestions,

			// itemsToSyncToLS: allItemsToSyncToLS,

			// syncIntervalFunction: null,

			// itemsLoaded: [],
			// usePaper: false,
			// syncDelay: 300000,

			// questionDialogOpen: false,

			// dialogValues: {},
			// dialogOpen: false,
			// curDialogDescription: "",
			// curDialogName: "",
			// curDialogQuestions: [],

			// hiddenTabs: defaultHiddenTabs,
			// hiddenPanels: defaultHiddenPanels,

			// appBarText: "Sediment Field Forms",

			// stations: [],
			// customQuestions: [],

			// loggedInUser:
			// needsToUpdateDB: (localStorage.getItem('needsToUpdateDB')) ? JSON.parse(localStorage.getItem('needsToUpdateDB')) : [],
			// curSamplingEventName: JSON.parse(localStorage.getItem('curSamplingEventName')) //TODO: multiple reloads mess this up if it starts null

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
			ensureProgramVersionUpToDate();
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


	testFunc(props) {
		props.hideQuestion(["stationNumber"]);
		props.hideQuestion([DATA_ENTRY_INFORMATION_IDENTIFIER + "Suspended", "bagMaterial"]);
	}

	render() {
		const { classes, UI, currentUser, isFetchingUserData, fetchingUserDataComplete } = this.props;

		if (currentUser === undefined && this.props.location.pathname !== '/') {
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
		isFetchingUserData: state.SedFF.isFetchingUserData,
		fetchingUserDataComplete: state.SedFF.fetchingUserDataComplete,
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