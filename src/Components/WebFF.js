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
import EditIcon from '@material-ui/icons/Edit';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import QuestionPage from './QuestionPage';
import { getQuestionDataWithUpdatedValue } from '../Utils/QuestionUtilities';

import SystemDialog from './SystemDialog';

// import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';

class WebFF extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			itemsLoaded: [],

			navMenuInfo: [],
			navMenuExpanded: false,

			isDialogQuestionsLoaded: false,
			dialogQuestionsInfo: [],
			dialogOpen: false,
			curDialogDescription: "",
			curDialogName: "",
			curDialogQuestionsInfo: [],

			isQuestionsDataLoaded: false,
			questionsData: [],

			hiddenPanels: [],

			systemMenuOpen: false,

			appBarText: "Sediment Field Forms",

			hiddenTabs: [ "EDI", "EWI", "WaterQuality", "FieldForm" ],  //TODO: pull hiddenTabs from LS before overwriting here?
		};	
		this.navigationControl = this.navigationControl.bind(this);
		this.handleDialogOpen = this.handleDialogOpen.bind(this);
		this.handleSystemMenuItemClicked = this.handleSystemMenuItemClicked.bind(this);
		this.questionChangeSystemCallback = this.questionChangeSystemCallback.bind(this);

	};

	componentWillUpdate(nextProps, nextState) { //TODO: Not sure what we are doing here... why don't we set these right when we load them in the fetch?
		localStorage.setItem('navMenuInfo', JSON.stringify(nextState.navMenuInfo));
		localStorage.setItem('dialogQuestionsInfo', JSON.stringify(nextState.dialogQuestionsInfo));
		localStorage.setItem('questionsData', JSON.stringify(nextState.questionsData));
		localStorage.setItem('hiddenPanels', JSON.stringify(nextState.hiddenPanels));
		localStorage.setItem('hiddenTabs', JSON.stringify(nextState.hiddenTabs));
	}

	componentWillMount() {
		let itemsToLoad = ["navMenuInfo", "dialogQuestionsInfo", "questionsData", "hiddenPanels", "hiddenTabs"]

		for (let i = 0; i < itemsToLoad.length; i++) {
			if (localStorage.getItem(itemsToLoad[i])) {
				console.log("using localStorage data for " + itemsToLoad[i]);
				let newItemsLoaded = this.state.itemsLoaded;
				if (!newItemsLoaded.includes(itemsToLoad[i])) {
					newItemsLoaded.push(itemsToLoad[i])
				}
				this.setState({
					[itemsToLoad[i]]: JSON.parse(localStorage.getItem(itemsToLoad[i])),
					itemsLoaded: newItemsLoaded
				}, this.buildRoutesAndRenderPages);
			} else {
				console.log("going to DB for data for " + itemsToLoad[i]);
				this.fetchDBInfo(itemsToLoad[i]);
			}
		}
	}

	navigationControl(tabName, add) {
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

			//TODO: additional good ones:  blur*, edit* (gives editor options...)
			default: return <SettingsInputComponentIcon />
		}
	}

	fetchDBInfo(_query) {
		const DEBUG = false;
		const API = 'http://localhost:3004/';
		const query = _query;

		function handleErrors(response) {
			// fetch only throws an error if there is a networking or permission problem (often due to offline).  A "ok" response indicates we actually got the info
			if (!response.ok) {
				throw Error(response.statusText);
			}
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
					let newItemsLoaded = this.state.itemsLoaded;
					newItemsLoaded.push(query);
					// setTimeout(() => {
					this.setState({
						[query]: parsedJSON,
						itemsLoaded: newItemsLoaded
					}, this.buildRoutesAndRenderPages);
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
				this.showTab(splitActionString[1], true);
				break;
			case "HideTab":
				this.showTab(splitActionString[1], false);
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

	showTab(tabName, toShow) {
		let newHiddenTabs = this.state.hiddenTabs;
		let cleanTabName = tabName.replace(/ /g, '');
		if (toShow) {
			// remove all instancs from newHiddenTabs
			while (newHiddenTabs.includes(cleanTabName)) {
				let index = newHiddenTabs.indexOf(cleanTabName);
				if (index > -1) {
					newHiddenTabs.splice(index, 1);
				}
			}
		} else {
			// add tabName to newHiddenTabs
			newHiddenTabs.push(cleanTabName);

		}
		this.setState({ hiddenTabs: newHiddenTabs });
	}

	showQuestion(questionID, toShow) {
		let DEBUG = false;
		if (DEBUG) console.log("Show Question: ", questionID, " toShow: ", toShow);
		// find the specific question in this.state.questionData based on the id, then update the hidden property
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
		console.log("this.state.hiddenPanels:", this.state.hiddenPanels);
		let newHiddenPanels = this.state.hiddenPanels;
		console.log("toShow: ", toShow);
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
		console.log("showQuestionPanel: newHiddenPanels: ", newHiddenPanels);
		this.setState({ hiddenPanels: newHiddenPanels });
	}

	questionChangeSystemCallback(Q) {


		// checks for action string, executes any actions, and then updates current state of questionsData

		// save updated value to state:
		let updatedQuestionData = getQuestionDataWithUpdatedValue(Q);

		this.setState({ questionsData: updatedQuestionData });

		// check if there are additional actions needed based on the actionOptions in this question, Q
		if (Q == null) {
			//TODO: throw error
			console.log("questionChangeSystemCallback required field, question, is null");
		}
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



	}

	buildRoutesAndRenderPages = () => {   //TODO:  move to the render function -- currently needs to be called any time content on question pages needs to be modified.  Suspect structural issue with a nested setState inside the questionPage
		var newRoutesAndPages = (
			<Switch> {/* only match ONE route at a time */}
				<Route exact path="/" render={() => <h1>HOME</h1>} />
				{this.state.navMenu}
				<Route path="/Dashboard" render={() => <Dashboard
					appBarTextCB={this.setAppBarText}
					text="Dashboard"
					navControl={this.navigationControl}
				/>} />
				<Route render={() => <QuestionPage
					appBarTextCB={this.setAppBarText}
					tabName={this.props.location.pathname.slice(1)}
					navControl={this.navigationControl}
					systemCB={this.questionChangeSystemCallback}
					questionsData={this.state.questionsData}
					hiddenPanels={this.state.hiddenPanels}
				/>} />
				{/* //FUTURE: do some processing on pathname to give good human-readable tabnames */}
				<Route render={() => <ErrorPage
					errMsg="Route was not found"
					appBarTextCB={this.setAppBarText}
					navControl={this.navigationControl}
				/>} />
			</Switch>
		);
		this.setState({ routesAndPages: newRoutesAndPages });
	};


	handleSystemMenuItemClicked(menuText) {
		// build the curDialogXXX data
		this.setState({ curDialogName: menuText });

		let filteredDialogInfo = this.state.dialogQuestionsInfo.filter((dialogItem) => {
			return dialogItem.dialogName.replace(/ /g, '') === menuText.replace(/ /g, '')
		});

		if (filteredDialogInfo && filteredDialogInfo.length === 1) {
			this.setState({
				curDialogDescription: filteredDialogInfo[0].dialogDescription,
				curDialogName: menuText,
				curDialogQuestionsInfo: filteredDialogInfo[0].questions
			});
			//open the dialog
			this.handleDialogOpen();
		} else {
			//TODO: ERR
			console.log(menuText + "is not yet implemented");
		}

	}

	render() {
		const { classes } = this.props;

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
					dialogQuestionsInfo={this.state.curDialogQuestionsInfo}
					dialogName={this.state.curDialogName}
					dialogDescription={this.state.curDialogDescription} />
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