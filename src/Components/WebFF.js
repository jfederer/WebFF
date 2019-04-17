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

import { isReasonablyValidUsernameInLS, isReasonableUsername, ensureProgramVersionUpToDate } from '../Utils/ValidationUtilities';

import { questionsData, dialogQuestions, defaultHiddenTabs, defaultHiddenPanels } from '../Utils/DefaultConfig';
import {
	USER_DB_NODES, SAMPLING_EVENT_IDENTIFIER,
	QUESTION_ID_STRINGS_THAT_FORCE_PROPAGATION, MAX_NUM_OF_SETS, QIDS_LINKED_TO_STATION_NAME
} from '../Utils/Constants';   //TODO: create a 'settings' node with things like 'usePaper' and 'syncDelay'.  In the future, include other settings like "availableSamplers" } from '../Utils/Constants';


import { setSysMenuExpand, setNavMenuExpand, setLoginDialogVisibility } from '../Actions/UI';
import { loadAndSetCurrentUser } from '../Actions/SedFF';


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
import Dashboard from './Pages/Dashboard/Dashboard';
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


	render() {
		const { classes, sedff, UI, currentUser } = this.props;
		const { isFetchingUserData} = sedff;

		if (currentUser === undefined && this.props.location.pathname !== '/') {
			console.log("There is no currentuser...going to login page");
			return <Redirect to='/' />;
		}
		
		return (
			<React.Fragment>
			{ isFetchingUserData==true 
			? <img src={loading}></img>  //TODO:  better behavior
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

							<Typography variant="title" color="inherit" noWrap>
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
					{/* <SettingsDialog /> */}
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
				<button onClick={() => console.log(this.props)}>Print Props</button><br />
				{/* <button onClick={() => this.props.loadAndSetCurrentUser("username@email.com")}>LASCU</button><br /> */}
				{JSON.stringify(currentUser)}
				{/* <pre>{JSON.stringify(this.props.user)}</pre> */}
				{/* <pre>{JSON.stringify(this.props.UI.visibility)}</pre> */}
				</React.Fragment>
			}
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
		currentUser: state.Users[state.SedFF.currentUsername]
	}
}

const mapDispatchToProps = {
	setLoginDialogVisibility,
	loadAndSetCurrentUser,
	setNavMenuExpand,
	setSysMenuExpand
}


export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(WebFF)));