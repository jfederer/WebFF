import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {withRouter} from 'react-router-dom';
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
import QuestionPage from './QuestionPage';

// import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';

class WebFF extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isNavLoading: true,
			navMenuExpanded: false,
			systemMenuOpen: false,
			appBarText: "Sediment Field Forms",
			showEDI: false,
			showEWI: false,
			showWaterQuality: false,
			showFieldForm: false,
			navMenuInfo: [] 
		};
		this.navigationControl = this.navigationControl.bind(this);

	};

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem('navMenuInfo', JSON.stringify(nextState.navMenuInfo));
	}
	componenetDidMount() {

	}

	componentWillMount() {
		if (localStorage.getItem('navMenuInfo')) {
			console.log("using localStorage data for navMenuInfo");
			this.setState({
				//navMenuInfo: JSON.parse(localStorage.getItem('navMenuInfo')),
				navMenuInfo: JSON.parse(localStorage.getItem('navMenuInfo')),
				isLoading: false
			});
		} else {
			console.log("going to DB for data for navMenuInfo");
			this.fetchNavData();
		}
	}

	navigationControl(tabName, add) {
		tabName = tabName.replace(/\s/g,'');

		// if add is false, remove menuItem used on tabNAme  
		// if add is true, add a tab named tabName
		// extra verbosity due to desire to use dynamic key name
		var key = 'show'+tabName;
		var val = add;
		var obj  = {};
		obj[key] = val;
		this.setState(obj);
	}

	jsonToNavMenu(jsonNavData) {
		// this function filters tabs based on the "showXYZ" items in state
		// console.log(jsonNavData);
		var retMenu = [];
		for(var i = 0; i<jsonNavData.length; i++) {
			var menuItem = jsonNavData[i];
			var shouldInclude = true;

			if((menuItem.text==="EWI" && !this.state.showEWI)) {   //HARDCODE
				shouldInclude = false;
			}

			if((menuItem.text==="EDI" && !this.state.showEDI)) {  //HARDCODE
				shouldInclude = false;
			}

			if((menuItem.text==="Water Quality" && !this.state.showWaterQuality)) {   //HARDCODE
				shouldInclude = false;
			}

			if((menuItem.text==="Field Form" && !this.state.showFieldForm)) {  //HARDCODE
				shouldInclude = false;
			}


			// use icon?
			let useIcon = true;
			if(menuItem.icon==="") {
				useIcon = false;
			}
				
			if(shouldInclude) retMenu.push(
				<ListItem key={menuItem.key} button component={Link} to={menuItem.route}>
					{(useIcon) ? <ListItemIcon>
						{this.materialtIcon(menuItem.icon)}
					</ListItemIcon> : null}
					<ListItemText className={styles.navMenuText} primary={menuItem.text} /> 
				</ListItem>
			);
		}
		return retMenu;
	}

	materialtIcon(icon) {
		switch (icon) {
			case 'DashboardIcon': return <DashboardIcon />
			case 'ImportContactsIcon': return <ImportContactsIcon />
			case 'OpacityIcon': return <OpacityIcon />
			case 'ReorderIcon' : return <ReorderIcon />
			case 'ColorizeIcon' : return <ColorizeIcon />
			default: return <SettingsInputComponentIcon />
		}
	}

	fetchNavData() {
		const DEBUG = false;
		const API = 'http://localhost:3004/';
		const query = 'navMenuInfo';

		function handleErrors(response) {
			// fetch only throws an error if there is a networking or permission problem (often due to offline).  A "ok" response indicates we actually got the info
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response;
		}

		if (DEBUG) console.log("Function: fetchNavData @ " + API + query);
		fetch(API + query)
			.then(handleErrors)
			.then(response => response.json())
			.then(
				parsedJSON => {
					if (DEBUG) console.log("Parsed JSON: ");
					if (DEBUG) console.log(parsedJSON);
					//setTimeout(() => {
						this.setState({
							navMenuInfo: parsedJSON,
							isNavLoading: false
						});
						if (DEBUG) console.log("CurrentState: ");
						if (DEBUG) console.log(this.state);
					//}, 2000);
				})
			.catch(error => console.log("Error fetching " + API + query + "\n" + error));
	}


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

	buildRoutes = () => {
		// console.log(this.state.navMenuInfo);
		// let dynamicRoutes = this.state.navMenuInfo.map((navItem)=> {
		// 		return <Route key={navItem.key} path={navItem.route} appBarTextCB={this.setAppBarText} tabName={navItem.text} navControl={this.navigationControl}/>;
		// });
		// console.log(dynamicRoutes);
		var newRouteMenu = (
			<Switch> {/* only match ONE route at a time */}
				<Route exact path="/" render={() => <h1>HOME</h1>} />
				{this.state.navMenu}
				<Route path="/Dashboard" render={() => <Dashboard appBarTextCB={this.setAppBarText} text="Dashboard" navControl={this.navigationControl}/>} />  
				<Route render={() => <QuestionPage appBarTextCB={this.setAppBarText} tabName={this.props.location.pathname.slice(1)} navControl={this.navigationControl}/>} />
				{/* //TODO: do some processing on pathname to give good human-readable tabnames */}
				<Route render={() => <ErrorPage errMsg="Route was not found" appBarTextCB={this.setAppBarText}  navControl={this.navigationControl}/>} />
			</Switch>
		);
		this.setState({ routeMenu: newRouteMenu });
	};


	componentDidMount() {
		this.buildRoutes();
	}


	render() {
		const { classes } = this.props;

		let navigationMenu;

		if (this.state.isNavLoading) { 
			//navigationMenu = null;  
			navigationMenu = (
				<NavMenu isExpanded={this.state.navMenuExpanded} closeHandler={this.handleLeftDrawerClose} menuItems={this.jsonToNavMenu(this.state.navMenuInfo)} />
			);
		} else {
			navigationMenu = (
				<NavMenu isExpanded={this.state.navMenuExpanded} closeHandler={this.handleLeftDrawerClose} menuItems={this.jsonToNavMenu(this.state.navMenuInfo)} />
			);
		}


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

				<SystemMenu isOpen={this.state.systemMenuOpen} closeHandler={this.handleSystemMenuClose} />
				{navigationMenu}
				<main className={classes.content} >
					<div className={classes.toolbar} />  {/*to push down the main content the same amount as the app titlebar */}
					{/* <Typography noWrap>{'You think water moves fast? You should see ice.'}</Typography>  REMOVE THIS - JUST FOR REFERENCE WITH TYPOGRAPHY */}
					{this.state.routeMenu}

				</main>


			</div >
		);
	}
}

WebFF.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles, { withTheme: true })(WebFF));