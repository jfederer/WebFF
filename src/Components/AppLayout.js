import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SystemMenu from './SystemMenu.js';
import NavMenu from './NavMenu.js';
import FieldForm from './FieldForm.js';
import Dashboard from './Dashboard.js';
import WaterQuality from './WaterQuality.js';
import EDI from './EDI.js';
import EWI from './EWI.js';
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
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';

// import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';

class AppLayout extends React.Component {
	constructor(props) {
		super(props);

		var initialNavInfo = [
			{"key":"nav_Dashboard", "text":"Dashboard", "route":"/Dashboard", "icon":"DashboardIcon"},
			{"key":"nav_FieldForm", "text":"Field Form","route":"/FieldForm", "icon":"ImportContactsIcon"},
			{"key":"nav_WaterQuality", "text":"Water Quality", "route":"/WaterQuality", "icon":"OpaciztyIcon"}
		];
		var initialNavMenu = this.jsonToNavMenu(initialNavInfo); // designed to show something prior to loading

		this.state = {
			isNavLoading: true,
			navMenuExpanded: false,
			systemMenuOpen: false,
			appBarText: "App Bar Title",
			showEDI: false,
			showEWI: false,
			navMenuItems: initialNavMenu,
			loadedNavMenuItems: []
		};
	};


	jsonToNavMenu(jsonNavData) {
		return jsonNavData.map((menuItem) => { 
			return (
				<ListItem key={menuItem.key} button component={Link} to={menuItem.route}>
					<ListItemIcon>
						{this.materialtIcon(menuItem.icon)}
					</ListItemIcon>
					<ListItemText className={styles.navMenuText} primary={menuItem.text} />
				</ListItem>
			);
		});
	}

	materialtIcon(icon) {	
			switch (icon) {
			  case 'DashboardIcon': return <DashboardIcon />
			  case 'ImportContactsIcon': return <ImportContactsIcon />
			  case 'OpacityIcon': return <OpacityIcon />
			  default: return <SettingsInputComponentIcon />
			}
	}

	componenetDidMount() {

	}

	componentWillMount() {
		if (localStorage.getItem('navMenuInfo')) {
			console.log("using localStorage data for navMenuInfo");
			this.setState({
				loadedNavMenuItems: JSON.parse(localStorage.getItem('navMenuInfo')),
				isLoading:false
			});
		} else {
			console.log("going to DB for data for navMenuInfo");
			this.fetchNavData();
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
					setTimeout(() => {
						this.setState({
							loadedNavMenuItems: parsedJSON,
							isNavLoading: false
						});
						if (DEBUG) console.log("CurrentState: ");
						if (DEBUG) console.log(this.state);
					}, 2000);
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
		var newRouteMenu = (
			<Switch> {/* only match ONE route at a time */}
				<Route exact path="/" render={() => <h1>HOME (login?)</h1>} />
				{this.state.navMenu}
				<Route path="/Dashboard" render={() => <Dashboard appBarTextCB={this.setAppBarText} />} />
				<Route path="/FieldForm" render={() => <FieldForm appBarTextCB={this.setAppBarText} />} />
				<Route path="/WaterQuality" render={() => <WaterQuality appBarTextCB={this.setAppBarText} />} />
				<Route path="/EDI" render={() => <EDI appBarTextCB={this.setAppBarText} />} />
				<Route path="/EWI" render={() => <EWI appBarTextCB={this.setAppBarText} />} />
				<Route render={() => <ErrorPage errMsg="Route was not found" appBarTextCB={this.setAppBarText} />} />
			</Switch>
		);
		this.setState({ routeMenu: newRouteMenu });
	};


	componentDidMount() {
		this.buildRoutes();
	}


	render() {
		const { classes } = this.props;
		//console.log(this.state.navMenu);

		let navigationMenu;


		if (this.state.isNavLoading) {
			//navigationMenu = null;  
			//TODO: actually seems to work, might be worth putting in a single nave menu item that simpyl shows lack of connection rather than some default options
			navigationMenu = ( 
				<NavMenu isExpanded={this.state.navMenuExpanded} closeHandler={this.handleLeftDrawerClose} menuItems={this.state.navMenuItems} />
			);
		} else {
			var myMenuItems = this.state.loadedNavMenuItems.map((menuItem) => {
				return (
					<ListItem key={menuItem.key} button component={Link} to={menuItem.route}>
						<ListItemIcon>
							<DashboardIcon />
						</ListItemIcon>
						<ListItemText className={styles.navMenuText} primary={menuItem.text} />
					</ListItem>
					
				);
			});
			navigationMenu = (
					<NavMenu isExpanded={this.state.navMenuExpanded} closeHandler={this.handleLeftDrawerClose} menuItems={myMenuItems} />
				);



			{/* <List>
        {exercises.map(({ id, title }) =>
          <ListItem key={id}>
            <ListItemText primary={title} />
          </ListItem>
        )}
      </List> */}
			// </List>loadedNavMenuItems

			// navigationMenu = (

			// );
		}


	return(
			<div className = { classes.root } >
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
				{ navigationMenu }
				<main className = { classes.content } >
			<div className={classes.toolbar} />  {/*to push down the main content the same amount as the app titlebar */ }
					{/* <Typography noWrap>{'You think water moves fast? You should see ice.'}</Typography>  REMOVE THIS - JUST FOR REFERENCE WITH TYPOGRAPHY */ }
					{/* <button onClick={() => this.setState({ showEDI: true })}>SHOW</button> */ }
					{ this.state.routeMenu }

				</main>


			</div >
		);
	}
}

AppLayout.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(AppLayout);