import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SystemMenu from './SystemMenu.js';
import NavMenu from './NavMenu.js';
import Dashboard from './Dashboard.js';
import { styles } from '../style';
import 'typeface-roboto';
import {
	Route,
	Switch
} from 'react-router-dom';
import ErrorPage from './Errors/ErrorPage';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import OpacityIcon from '@material-ui/icons/Opacity';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ReorderIcon from '@material-ui/icons/Reorder';
import ColorizeIcon from '@material-ui/icons/Colorize';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import FilterDramaIcon from '@material-ui/icons/FilterDrama';
import StraightenIcon from '@material-ui/icons/Straighten';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/PersonAdd';
import CompareIcon from '@material-ui/icons/Compare';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import QuestionPage from './QuestionPage';
import { provideEWISamplingLocations } from '../Utils/CalculationUtilities';
import SystemDialog from './SystemDialog';

// import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';

const criticalUserNodes = ['stations'];
const criticalDefaultSystemNodes = ['navMenuInfo', 'dialogQuestions', 'questionsData', 'hiddenPanels', 'hiddenTabs'];
var itemsToSyncToLS = criticalDefaultSystemNodes.concat(criticalUserNodes);
itemsToSyncToLS.push("loggedInUser");

const questionIDsLinkedToStationName = ["stationNumber", "projectName", "projectID", "agencyCode"];
var needToSyncStationDataToQuestionData = false;


const SAMPLING_EVENT_IDENTIFIER = "SamplingEvent:";


class WebFF extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			itemsLoaded: [],
			usePaper: false,

			navMenuInfo: [],
			navMenuExpanded: false,

			isDialogQuestionsLoaded: false,
			dialogQuestions: [],
			dialogOpen: false,
			curDialogDescription: "",
			curDialogName: "",
			curDialogQuestions: [],

			isQuestionsDataLoaded: false,
			questionsData: [],

			hiddenPanels: [],

			systemMenuOpen: false,

			appBarText: "Sediment Field Forms",

			hiddenTabs: [],
			stations: [],

			loggedInUser: "jfederer@usgs.gov",

			samplingEvents: []
		};

		this.navigationControl = this.navigationControl.bind(this);
		this.handleDialogOpen = this.handleDialogOpen.bind(this);
		this.handleSystemMenuItemClicked = this.handleSystemMenuItemClicked.bind(this);
		this.questionChangeSystemCallback = this.questionChangeSystemCallback.bind(this);
		this.dialogQuestionChangeSystemCallback = this.dialogQuestionChangeSystemCallback.bind(this);
		this.setLoggedInUser = this.setLoggedInUser.bind(this);
		this.addStation = this.addStation.bind(this);
		this.createNewSamplingEvent = this.createNewSamplingEvent.bind(this);
	}

	componentWillUpdate(nextProps, nextState) { // when state updates, write it to LS
		//console.log("CWU");
		itemsToSyncToLS.forEach((item) => localStorage.setItem(item, JSON.stringify(nextState[item])));

		// check if "stations" value changed update options in questionsData appropriately if it did... checking that questionData might not actually be fully loaded yet
		//console.log("NEXTSTATIONS: ", nextState.stations);
		//console.log("STATIONS: ", this.state.stations);
		if (needToSyncStationDataToQuestionData) {
			if (nextState && this.state.questionsData !== nextState.questionData) {
				this.attemptToSyncStationDataToQuestionData();
			}
		}
		if (nextState && this.state.stations !== nextState.stations) {
			//console.log("Stations updated");
			needToSyncStationDataToQuestionData = true;
			this.attemptToSyncStationDataToQuestionData(nextState.stations);
		}
		
	}

	attemptToSyncStationDataToQuestionData(stationsIn) {
		//console.log("Attempting");
		let stationNameQ = this.getQuestionData("stationName");
		if (stationNameQ === null) {
			return;
		}

		let newOptions = {};
		let stationsToSync;
		if(stationsIn) {
			stationsToSync = stationsIn;
		} else {
			stationsToSync = this.state.stations.slice();
		}


		for (let i = 0; stationsToSync !== null && i < stationsToSync.length; i++) {
			newOptions[stationsToSync[i].id] = stationsToSync[i].id;
		}

		//console.log("New Options: ", newOptions);

		this.updateQuestionData("stationName", "options", newOptions,  this.buildRoutesAndRenderPages);

		needToSyncStationDataToQuestionData = false;
	}


	componentWillMount() { //FUTURE: could load just the missing parts insted of everything if just a single node is missing
		this.gatherSystemConfig(criticalDefaultSystemNodes, "defaultConfig");  //load default configurations
		this.gatherUserConfig(criticalUserNodes, "users/" + this.state.loggedInUser); //load user configuration

		//TODO: collect station info and combine with default questions and data

	}

	gatherSystemConfig(nodesToGather, query) {
		// first looks in LS for every element in nodes.  If not found, pulls everything from DB.
		let DEBUG = false;

		if (DEBUG) console.log("gatherConfig: ", nodesToGather, query);
		// check if ALL critical items are loaded into LS
		// FUTURE: empty arrays count.... and we might want to double-check that against the DB
		let allLoadedInLS = true;
		for (let i = 0; i < nodesToGather.length; i++) {
			if (DEBUG) console.log(localStorage.getItem(nodesToGather[i]));
			if (!localStorage.getItem(nodesToGather[i]) || localStorage.getItem(nodesToGather[i]) === "null") {
				allLoadedInLS = false;
			}
			if (nodesToGather[i] === "stations" && localStorage.getItem(nodesToGather[i]) === "[]") {  //KLUDGE to allow for extra searching for stations given it's non-null in the constructor
				allLoadedInLS = false;
			}
		}
		if (DEBUG) console.log("allLoadedInLS: ", allLoadedInLS);

		if (allLoadedInLS) {
			if (DEBUG) console.log("pulling from LS");

			// pull everything from LS
			for (let i = 0; i < nodesToGather.length; i++) {
				let newItemsLoaded = this.state.itemsLoaded;
				if (!newItemsLoaded.includes(nodesToGather[i])) {
					newItemsLoaded.push(nodesToGather[i])
				}
				this.setState({
					[nodesToGather[i]]: JSON.parse(localStorage.getItem(nodesToGather[i])),
					itemsLoaded: newItemsLoaded
				}, this.buildRoutesAndRenderPages);
			}
		} else {
			// pull everything from DB

			this.fetchDBInfo(query, (JSONresponse) => {
				if (DEBUG) console.log("JSONresponse: ", JSONresponse);
				JSONresponse.forEach((configNode) => {
					if (DEBUG) console.log("ConfigNode: ", configNode);
					let nodeName = configNode.id;
					if (DEBUG) console.log("NodeName: ", nodeName);
					let nodeArrName = nodeName + "Arr";
					if (DEBUG) console.log("NodeArrName: ", nodeArrName)
					let nodeArr = configNode[nodeArrName];
					if (DEBUG) console.log("nodeArr: ", nodeArr);
					if (DEBUG) console.log("this.state.itemsLoaded: ", this.state.itemsLoaded);

					this.setState({ [nodeName]: nodeArr }, () => {
						if (DEBUG) console.log("STATE: ", this.state);
						if (DEBUG) console.log("ITEMSLOADED: ", this.state.itemsLoaded);
						let newItemsLoaded = this.state.itemsLoaded;
						newItemsLoaded.push(nodeName);
						this.setState({ "itemsLoaded": newItemsLoaded }, this.buildRoutesAndRenderPages); //performance
					});
				});
			});
		}
	}


	gatherUserConfig(nodesToGather, query) {
		// first looks in LS for every element in nodes.  If not found, pulls everything from DB.
		let DEBUG = false;

		if (DEBUG) console.log("gatherConfig: ", nodesToGather, query);
		// check if ALL critical items are loaded into LS
		// FUTURE: empty arrays count.... and we might want to double-check that against the DB
		let allLoadedInLS = true;
		for (let i = 0; i < nodesToGather.length; i++) {
			if (DEBUG) console.log(localStorage.getItem(nodesToGather[i]));
			if (!localStorage.getItem(nodesToGather[i]) || localStorage.getItem(nodesToGather[i]) === "null") {
				allLoadedInLS = false;
			}
			if (nodesToGather[i] === "stations" && localStorage.getItem(nodesToGather[i]) === "[]") {  //KLUDGE to allow for extra searching for stations given it's non-null in the constructor
				allLoadedInLS = false;
			}
		}
		if (DEBUG) console.log("allLoadedInLS: ", allLoadedInLS);

		if (allLoadedInLS) {
			if (DEBUG) console.log("pulling from LS");

			// pull everything from LS
			for (let i = 0; i < nodesToGather.length; i++) {
				let newItemsLoaded = this.state.itemsLoaded;
				if (!newItemsLoaded.includes(nodesToGather[i])) {
					newItemsLoaded.push(nodesToGather[i])
				}
				this.setState({
					[nodesToGather[i]]: JSON.parse(localStorage.getItem(nodesToGather[i])),
					itemsLoaded: newItemsLoaded
				}, this.buildRoutesAndRenderPages);
			}
		} else {
			// pull everything from DB

			this.fetchDBInfo(query, (JSONresponse) => {
				if (DEBUG) console.log("JSONresponse: ", JSONresponse);
				let nodeArr = [];
				for (let i = 0; i < nodesToGather.length; i++) {
					JSONresponse[nodesToGather[i]].forEach((configNode) => {
						if (DEBUG) console.log("ConfigNode: ", configNode);
						// let nodeName = configNode.id;
						//TODO: error and duplication checking -- particularly important as custom questions exist
						// yes, this is basically destructing and reconstructing an array.  This is being done for easier error checking. (perhaps not actually easier)
						nodeArr.push(configNode);
					});
					this.setState({ [nodesToGather[i]]: nodeArr }, () => {
						if (DEBUG) console.log("STATE: ", this.state);
						if (DEBUG) console.log("ITEMSLOADED: ", this.state.itemsLoaded);
						let newItemsLoaded = this.state.itemsLoaded;
						newItemsLoaded.push(nodesToGather[i]);
						this.setState({ "itemsLoaded": newItemsLoaded }, this.buildRoutesAndRenderPages); //performance
					});
				}

			});
		}
	}


	getDateTimeString() {
		let d = new Date();
		let dateOfMonthString = ('0' + d.getDate()).slice(-2);
		let monthString = ('0' + (d.getMonth()+1)).slice(-2);
		let dateString = d.getFullYear() + "-" + monthString +"-" + dateOfMonthString;
		let hoursString = ('0' + d.getHours()).slice(-2);
		let minutesString = ('0' + (d.getMinutes())).slice(-2);
		let secondsString = ('0' + (d.getMinutes())).slice(-2);
		let timeString = hoursString + ":" + minutesString + ":" + secondsString;
		return dateString + "@" + timeString;
	}


	createNewSamplingEvent() {
		console.log("creating new event");

		// create new sampling event 
		let newSamplingEventID = this.getDateTimeString();
				
		// load initial values from questionsData
		let questionValues = this.state.questionsData.map((Q)=>{
			return {[Q.id]:Q.value}
		});

		let newSamplingEvent = {
			id: newSamplingEventID,
			questionValues: questionValues
		}

		//ensure this sampling event will be sync'd to LS
		itemsToSyncToLS.push(SAMPLING_EVENT_IDENTIFIER+newSamplingEventID);

		//save it to the state   (note, we'll use Object.keys(localStorage) to get this later)
		this.setState({[SAMPLING_EVENT_IDENTIFIER+newSamplingEventID]:newSamplingEvent});
	}

	materialIcon(icon) {
		switch (icon) {
			case 'DashboardIcon': return <DashboardIcon />
			case 'ImportContactsIcon': return <ImportContactsIcon />
			case 'OpacityIcon': return <OpacityIcon />
			case 'ReorderIcon': return <ReorderIcon />
			case 'ColorizeIcon': return <ColorizeIcon />
			case 'FilterDramaIcon': return <FilterDramaIcon />
			case 'StraightenIcon': return <StraightenIcon />
			case 'LibraryAddIcon': return <LibraryAddIcon />
			case 'PlaylistAddIcon': return <PlaylistAddIcon />
			case 'PersonAddIcon': return <PersonAddIcon />
			case 'GroupAddIcon': return <GroupAddIcon />
			case 'PlaylistAddCheckIcon': return <PlaylistAddCheckIcon />
			case 'NoteAddIcon': return <NoteAddIcon />
			case 'EditIcon': return <EditIcon />
			case 'CompareIcon': return <CompareIcon />
			case 'SaveIcon': return <SaveIcon />

			//TODO: additional good ones:  blur*, edit* (gives editor options...)
			default: return <SettingsInputComponentIcon />
		}
	}

	fetchDBInfo(_query, successCB) {
		const DEBUG = false;
		const API = 'http://localhost:3004/';
		const query = _query;

		function handleErrors(response) {
			// fetch only throws an error if there is a networking or permission problem (often due to offline).  A "ok" response indicates we actually got the info
			if (!response.ok) {
				throw Error(response.statusText);
			}
			//note 404 is not found and 400 is a mal-formed request
			return response;
		}

		if (DEBUG) console.log("Function: fetchDBInfo @ " + API + query);
		fetch(API + query)
			.then(handleErrors)
			.then(response => response.json())
			.then(
				parsedJSON => {
					if (DEBUG) console.log("Parsed JSON: ");
					if (DEBUG) console.log(parsedJSON);
					// // setTimeout(() => {
					successCB(parsedJSON);
					if (DEBUG) console.log("CurrentState: ");
					if (DEBUG) console.log(this.state);
					// }, 1200);
				})
			.catch(error => console.log("Error fetching " + API + query + "\n" + error));
	}

	handleDialogOpen() {
		this.setState({ dialogOpen: true });
	};

	handleDialogClose = () => {
		this.setState({ dialogOpen: false });
	};

	handleLeftDrawerOpen = () => {
		this.setState({ navMenuExpanded: true });
	};

	handleLeftDrawerClose = () => {
		this.setState({ navMenuExpanded: false });
	};

	handleSystemMenuIconClicked = () => {
		this.setState({ systemMenuOpen: true });
	};

	handleSystemMenuClose = () => {  //FUTURE: this seems tightly coupled.
		this.setState({ systemMenuOpen: false });
	};

	setAppBarText = (txt) => {
		this.setState({ appBarText: txt });
	};

	actionExecuter = (actionString) => {
		let splitActionString = actionString.split('::');
		if (splitActionString.length !== 2) {
			//TODO: Throw error
		}
		switch (splitActionString[0]) {
			case "ShowTab":
				this.showTab(splitActionString[1], true, this.buildRoutesAndRenderPages());
				break;
			case "HideTab":
				this.showTab(splitActionString[1], false, this.buildRoutesAndRenderPages());
				break;
			case "ShowQuestion":
				this.showQuestion(splitActionString[1], true);
				this.buildRoutesAndRenderPages();
				break;
			case "HideQuestion":
				this.showQuestion(splitActionString[1], false);
				this.buildRoutesAndRenderPages();
				break;
			case "ShowPanel":
				this.showQuestionPanel(splitActionString[1], true);
				this.buildRoutesAndRenderPages();
				break;
			case "HidePanel":
				this.showQuestionPanel(splitActionString[1], false);
				this.buildRoutesAndRenderPages();
				break;
			default:
				//TODO: throw error
				console.log("Requested action '" + splitActionString[0] + "' not recognized");
		}
	}

	navigationControl(tabName, add) { //TODO: remove and fix... it's just a pass-along and might not be needed given we navigate from state now
		this.showTab(tabName, add);
	}

	jsonToNavMenu(jsonNavData) {
		// this function filters tabs based on the "showXYZ" items in state
		// console.log(jsonNavData);
		var retMenu = [];
		for (var i = 0; i < jsonNavData.length; i++) {
			var menuItem = jsonNavData[i];
			var shouldInclude = !this.state.hiddenTabs.includes(menuItem.text.replace(/ /g, ''));

			// use icon?
			let useIcon = true;
			if (menuItem.icon === "") {
				useIcon = false;
			}

			if (shouldInclude) retMenu.push(
				<ListItem key={menuItem.route + "_key"} button component={Link} to={menuItem.route}>
					{(useIcon) ? <ListItemIcon>
						{this.materialIcon(menuItem.icon)}
					</ListItemIcon> : null}
					<ListItemText className={styles.navMenuText} primary={menuItem.text} />
				</ListItem>
			);
		}
		return retMenu;
	}

	showTab(tabName, toShow, CB) {
		
		// let newHiddenTabs = this.state.hiddenTabs.slice();
		let newHiddenTabs = this.state.hiddenTabs;
		// console.log("After copy: ", newHiddenTabs);
		let cleanTabName = tabName.replace(/ /g, '');
		if (toShow) {
			// remove all instances from newHiddenTabs
			while (newHiddenTabs.includes(cleanTabName)) {
				let index = newHiddenTabs.indexOf(cleanTabName);
				if (index > -1) {
					newHiddenTabs.splice(index, 1);
				}
			}
			// console.log("After removal: ", newHiddenTabs);
		} else {
			// add tabName to newHiddenTabs
			newHiddenTabs.push(cleanTabName);
			// console.log("After addition: ", newHiddenTabs);

		}
		// console.log("Before setting state: ", newHiddenTabs);
		this.setState({ hiddenTabs: newHiddenTabs }, ()=> {
			// console.log("STATE after setting state: ", this.state.hiddenTabs);
			CB;
		}
		);
	}

	showQuestion(questionID, toShow) {
		// find the specific question in this.state.questionData based on the id, then update the hidden property

		let DEBUG = false;
		if (DEBUG) console.log("Show Question: ", questionID, " toShow: ", toShow);

		let updatedQuestionsData = this.state.questionsData.filter(questionData => {
			if (questionData.id === questionID) {
				if (DEBUG) console.log("------FOUND!--------");
				if (DEBUG) console.log(questionData);
				questionData['hidden'] = !toShow;
			} else {
				if (DEBUG) console.log("questionData.id :", questionData.id, " and questionID: ", questionID, " do not match");
			}
			return questionData;
		});

		if (DEBUG) console.log(updatedQuestionsData);
		this.setState({ questionsData: updatedQuestionsData });
		// replace the questionData in localStorage
		//		localStorage.setItem('questionsData', JSON.stringify(rawData));
	}

	showQuestionPanel(panelName, toShow) {
		// add or remove the panelName from this.state.hiddenPanels
		// console.log("this.state.hiddenPanels:", this.state.hiddenPanels);
		let newHiddenPanels = this.state.hiddenPanels;
		// console.log("toShow: ", toShow);
		if (toShow) {  // remove all instances of panelName from hiddenPanels
			while (newHiddenPanels.includes(panelName)) {
				let index = newHiddenPanels.indexOf(panelName);
				if (index > -1) {
					newHiddenPanels.splice(index, 1);
				}
			}
		} else { // not toShow:  add panelName to newHiddenPanels
			if (!newHiddenPanels.includes(panelName)) {
				newHiddenPanels.push(panelName);
			}
		}
		// console.log("showQuestionPanel: newHiddenPanels: ", newHiddenPanels);
		this.setState({ hiddenPanels: newHiddenPanels }); 
	}

	getQuestionsDataWithUpdatedValue(Q, dialogQuestions) {
		//this function saves updated question "values" (must be located at "Q.state.value")
		// returns updated questionsData object
		var DEBUG = false;
		if (DEBUG) console.log("getQuestionsDataWithUpdatedValue: Q: ", Q);
		if (Q == null) { //POC
			console.log("Question passed to getQuestionsDataWithUpdatedValue was null or undefined");
			return;
		}

		// find the specific question in questionsData  or curDialogQuestions based on the id,then update the value property
		let questionsToFilter = this.state.curDialogQuestions;
		if(!dialogQuestions) {
			questionsToFilter = this.state.questionsData; 
		} 

		var newQuestionsData = questionsToFilter.filter(questionData => {
			//console.log("QuestionData: ", questionData);
			if (questionData.id === Q.props.id) {
				if (DEBUG) console.log("------FOUND!--------");
				if (DEBUG) console.log("getQuestionsDataWithUpdatedValue: questionData (pre): ", questionData);
				if (DEBUG) console.log("getQuestionsDataWithUpdatedValue: Q.state.value", Q.state.value);
				
					questionData.value = Q.state.value;
				
				if (DEBUG) console.log("getQuestionsDataWithUpdatedValue: questionData (post)", questionData);
			} else {
				if (DEBUG) console.log("getQuestionsDataWithUpdatedValue: no");
			}
			return questionData;
		});

		if (DEBUG) console.log("getQuestionsDataWithUpdatedValue: newQuestionsData: ", newQuestionsData);

		return newQuestionsData;
	}



	updateQuestionData(q_id, key, value, CB) {
		// sets the 'key' element to 'value' for question with question id of q_id
		// returns just the matching, updated, question
		let retQ;
		var newQuestionsData = this.state.questionsData.filter(questionData => {
			if (questionData.id === q_id) {
				retQ = questionData;
				questionData[key] = value;
			}
			return questionData;
		});

		this.setState({ questionsData: newQuestionsData }, CB);
		
		return retQ;
	}

	getQuestionData(q_id) {
		// returns question from questionsData that has q_id.  If none is found, return null
		let retArr = this.state.questionsData.filter(questionData => {
			if (questionData.id === q_id) {
				return questionData;
			}
			return null;
		});

		if (retArr.length === 1) {
			return retArr[0];
		} else {
			// console.log("WebFF: getQuestionData(" + q_id + ") returned " + retArr.length + " questions");
			//TODO: throw error
			return null;
		}
	}

	setLoggedInUser(username) {
		console.log(this);
		this.setState({ loggedInUser: username }, this.buildRoutesAndRenderPages);
	}


	dialogQuestionChangeSystemCallback(Q) {
		console.log(Q);
		console.log(this.state.curDialogQuestions);

		this.questionChangeSystemCallback(Q, true);

	}

	questionChangeSystemCallback(Q, dialogQuestion) {
		// updates current state of questionsData, checks for action string, executes any actions

		// console.log(Q);

		//HARDCODE for paper settings:
		if (Q.props.id === "settings_paper") {
			this.setState({ usePaper: Q.state.value });
			this.handleSystemMenuItemClicked("Settings");
		}

		//HARDCODE for stationName drop down
		if(Q.props.id === "stationName") {
			console.log("stationName: ", Q.state.value);
			// find the station we are talking about
			let stationIndex = 0;
			for(let i=0; i<this.state.stations.length; i++) {
				if(this.state.stations[i].id===Q.state.value) {
					stationIndex = i;
				}
			}
			let stationData = this.state.stations[stationIndex];
			console.log("stationData", stationData);

			for(let i=0; i<questionIDsLinkedToStationName.length; i++) {
				let q_id = questionIDsLinkedToStationName[i];
				this.updateQuestionData(q_id, "value", stationData[q_id], this.buildRoutesAndRenderPages);
			}
		}

		if (Q == null) {
			//TODO: throw error
			console.log("questionChangeSystemCallback required field, question, is null");
		}

		let stateKey = "questionsData";
		if(dialogQuestion) {
			stateKey = "curDialogQuestions";
		}

		// save updated value to state:
		let updatedQuestionData = this.getQuestionsDataWithUpdatedValue(Q, dialogQuestion);
		this.setState({ [stateKey]: updatedQuestionData }, () => {
		// after state is set, check if there are additional actions needed based on the actionOptions or other special needs in this question, Q
		// when done, rebuild routs and render pages // performance

		
			if (Q.props.actions) {
				let { actions } = Q.props;
				let qval = Q.state.value;
				let commandString = actions[qval];
				if (commandString) {
					let actionsToDo = commandString.split('&');
					actionsToDo.forEach((action) => {
						this.actionExecuter(action);
					});
				}
			}

			this.buildRoutesAndRenderPages();
		});
	}


	addStation(stationName, stationNumber, projectName, projectID, agencyCode) {
		let newStation = {
			id:stationName,
			stationNumber:stationNumber,
			projectName:projectName,
			projectID:projectID,
			agencyCode:agencyCode
		}
		let newStations = this.state.stations.slice();
		newStations.push(newStation);
		console.log("newStations: ", newStations);
		console.log("this.state.stations: ", this.state.stations);
		//TODO: validation

		
		this.setState({stations:newStations}, this.attemptToSyncStationDataToQuestionData);
	}

	buildRoutesAndRenderPages = () => {   //TODO:  move to the render function -- currently needs to be called any time content on question pages needs to be modified.  Suspect structural issue with a nested setState inside the questionPage
		//  console.log("BAR");
		var newRoutesAndPages = (
			<Switch> {/* only match ONE route at a time */}
				<Route exact path="/" render={() => <h1>HOME</h1>} />

				<Route path="/Dashboard" render={() => <Dashboard
					appBarTextCB={this.setAppBarText}
					text="Dashboard"
					navControl={this.navigationControl}
					globalState={this.state}
					createNewSamplingEvent={this.createNewSamplingEvent}
				/>} />
				<Route render={() => <QuestionPage
					appBarTextCB={this.setAppBarText}
					tabName={this.props.location.pathname.slice(1)}
					navControl={this.navigationControl}
					systemCB={this.questionChangeSystemCallback}
					questionsData={this.state.questionsData}
					hiddenPanels={this.state.hiddenPanels}
					globalState={this.state}
				/>} />
				{/* {this.state.navMenu} */}
				{/* //FUTURE: do some processing on pathname to give good human-readable tabnames */}
				<Route render={() => <ErrorPage
					errMsg="Route was not found"
					appBarTextCB={this.setAppBarText}
					navControl={this.navigationControl}
				/>} />
			</Switch>
		); //performance

		this.setState({ routesAndPages: newRoutesAndPages }, () => this.collectRunAndPropagateSamplePointData());
	};

	collectRunAndPropagateSamplePointData() {
		//FIXME:  This overwrites values in the table if any exist //TODO: check current value and insert
		let numSampPoints = null;
		//console.log(this.state);
		if (this.state.itemsLoaded.includes('questionsData')) {
			numSampPoints = this.getQuestionData("samplingPoints").value;
		}


		if (numSampPoints !== null && numSampPoints !== "" && numSampPoints > 0) {
			// pull variables from fields
			let LESZ = this.getQuestionData("edgeOfSamplingZone_Left").value;
			let RESZ = this.getQuestionData("edgeOfSamplingZone_Right").value;

			let pierlocs = [];
			let pierWids = [];
			for (let i = 0; i < 6; i++) {
				pierlocs.push(this.getQuestionData("pier" + (i + 1) + "_start").value);

				let pierWidth = this.getQuestionData("pier" + (i + 1) + "_end").value - pierlocs[i];
				pierWids.push(pierWidth);
			}


			let tempValArr = provideEWISamplingLocations(LESZ, RESZ, pierlocs, pierWids, numSampPoints);

			// turn this into an array of 1-length array values for ingestion to table 
			let newVal = new Array(tempValArr.length);
			for (let i = 0; i < tempValArr.length; i++) {
				newVal[i] = [tempValArr[i]];
			}

			this.updateQuestionData("EWI_samples_table", "value", newVal);
		}
	}


	updateDBInfo(location, data, CB) {
		// attempts to update location
		// returns the ENTIRE newly updated data element.

		const DEBUG = true;
		const API = 'http://localhost:3004/';
		const query = location;
		// function handleErrors(response) {
		// 	// fetch only throws an error if there is a networking or permission problem (often due to offline).  A "ok" response indicates we actually got the info
		// 	if (!response.ok) {
		// 		throw Error(response.statusText);
		// 	}
		// 	return response;
		// }

		let URI = API + query;

		if (DEBUG) console.log("Function: fetchDBInfo PATCH @ " + URI);

		fetch(URI, {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then(function (response) {
			if (response.status === 200) {
				return response.json();
			}
			return null;
		}).then(function (json) {
			CB(json);
		}).catch(error => console.log("Error fetching " + API + query + "\n" + error));
	}

	// createDBInfo(location, data) {
	// 	// attempts to update location
	// 	// returns the ENTIRE newly updated data element.

	// 	const DEBUG = true;
	// 	const API = 'http://localhost:3004/';
	// 	const query = location;
	// 	// function handleErrors(response) {
	// 	// 	// fetch only throws an error if there is a networking or permission problem (often due to offline).  A "ok" response indicates we actually got the info
	// 	// 	if (!response.ok) {
	// 	// 		throw Error(response.statusText);
	// 	// 	}
	// 	// 	return response;
	// 	// }

	// 	let URI=API + query;

	// 	fetch(URI, {
	// 		method: 'PUT',
	// 		headers: {
	// 			'Accept': 'application/json',
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(data)
	// 	}).then(function (response) {
	// 		if(response.status===404 && !putAlreadyAttempted) {
	// 			// the resource didn't exist and needs to be 'put' instead of 'patched'.
	// 			console.log("this was a 404");
	// 			this.putDBInfo(location, data, true, put);
	// 		}
	// 		console.log("Response: ", response);
	// 		return response.json();
	// 	}).then(function (json) {
	// 		return "dsfsdf";
	// 	}).catch(error => console.log("Error fetching " + API + query + "\n" + error));
	// }


	handleSystemMenuItemClicked(menuText) {
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


		// this.putDBInfo("generatedQuestions",
		// [{"testName":"Joe", "id":"smelven"},
		// {"testName":"Mark", "id":"tensie"},
		// {"testName":"Jan", "id":"oldest"}]
		// );

		if (menuText === "Test Connection") {
			// console.log("Testing  of new Question")
			// let newQuestion = {
			// 	"id": "ThisisThefirstID",
			// 	"label": "Station Number",
			// 	"XMLValue": "",
			// 	"type": "Text",
			// 	"tabName": "Add Station",
			// 	"value": "",
			// 	"layoutGroup": "Basic",
			// 	"width_xs": 5,
			// 	"width_lg": 5
			// }
			// this.updateDBInfo("customQuestions", newQuestion, (resp) => console.log("EXPECT NULL: Response: ", resp));

			// let patchData =
			// 	{ "id": "CSN", "testName": "SMister" }
			// this.updateDBInfo("customQuestions/" + patchData.id, patchData, (resp) => console.log("EXPECT FULL OBJECT: Response: ", resp));


		}

		// build the curDialogXXX data
		this.setState({ curDialogName: menuText });


		let filteredDialogInfo = this.state.dialogQuestions.filter((dialogItem) => {
			return dialogItem.dialogName.replace(/ /g, '') === menuText.replace(/ /g, '')
		});

		if (filteredDialogInfo && filteredDialogInfo.length === 1) {
			this.setState({
				curDialogDescription: filteredDialogInfo[0].dialogDescription,
				curDialogName: menuText,
				curDialogQuestions: filteredDialogInfo[0].questions
			}, () => { //open the dialog 
			this.handleDialogOpen();
			}
		);
			
		} else {
			//TODO: ERR
			console.log(menuText + " is not yet implemented");
		}

	}

	render() {
		const { classes } = this.props;
		// console.log("RENDER");

		return (
			<div className={classes.root} >
				<AppBar
					position="absolute"
					className={classNames(classes.appBar, this.state.navMenuExpanded && classes.appBarShift)}
				>
					<Toolbar disableGutters={!this.state.navMenuExpanded}>
						<IconButton
							color="inherit"
							aria-label="expand drawer"
							onClick={this.handleLeftDrawerOpen}
							className={classNames(classes.menuButton, this.state.navMenuExpanded && classes.hide)}
						>
							<ChevronRightIcon />
						</IconButton>

						<Typography variant="title" color="inherit" noWrap>
							{this.state.appBarText}
						</Typography>

						<IconButton
							color="inherit"
							aria-label="System Menu"
							onClick={this.handleSystemMenuIconClicked}
							className={classNames(classes.menuButton, classes.rightJustify, this.state.systemMenuOpen && classes.hide)}
						>
							<MenuIcon />
						</IconButton>
					</Toolbar>

				</AppBar>

				<SystemMenu isOpen={this.state.systemMenuOpen}
					closeHandler={this.handleSystemMenuClose}
					menuItemClickHandler={this.handleSystemMenuItemClicked} />
				<SystemDialog isOpen={this.state.dialogOpen}
					closeHandler={this.handleDialogClose}
					dialogQuestions={this.state.curDialogQuestions}
					dialogName={this.state.curDialogName}
					dialogDescription={this.state.curDialogDescription}
					stateChangeHandler={this.dialogQuestionChangeSystemCallback}
					globalState={this.state}
					setLoggedInUser={this.setLoggedInUser} 
					addStation={this.addStation} />
				<NavMenu isExpanded={this.state.navMenuExpanded}
					closeHandler={this.handleLeftDrawerClose}
					menuItems={this.jsonToNavMenu(this.state.navMenuInfo)} />

				<main className={classes.content} >
					<div className={classes.toolbar} />  {/*to push down the main content the same amount as the app titlebar */}
					
					{this.state.routesAndPages}

				</main>
			</div >
		);
	}
}

WebFF.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles, { withTheme: true })(WebFF));