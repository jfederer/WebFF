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
import { styles } from '../style';
import 'typeface-roboto';
import {
	Route,
	Switch
} from 'react-router-dom';
import ErrorPage from './Errors/ErrorPage';  

class AppLayout extends React.Component {
	state = {
		navMenuExpanded: false,
		systemMenuOpen: false,
		appBarText: "App Bar Title"
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
		this.setState({appBarText:txt});
	};

	buildRoutes = () => {
		var newRouteMenu = ( 
		<Switch> {/* only match ONE route at a time */}
		<Route exact path="/" render={() => <h1>HOME (login?)</h1>} />
		{this.state.navMenu}
		<Route path="/Dashboard" render={() => <Dashboard appBarTextCB={this.setAppBarText}/>} />
		<Route path="/FieldForm" render={() => <FieldForm appBarTextCB={this.setAppBarText}/>} />
		<Route path="/WaterQuality" render={() => <WaterQuality appBarTextCB={this.setAppBarText}/>} />
		<Route render={() => <ErrorPage errMsg="Route was not found" appBarTextCB={this.setAppBarText}/>} />
	</Switch>
		);
		this.setState({routeMenu:newRouteMenu});
	};


	componentDidMount() {
		this.buildRoutes();
	}


	render() {
		const { classes } = this.props;

		return (
			<div className={classes.root}>
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
				<NavMenu isExpanded={this.state.navMenuExpanded} closeHandler={this.handleLeftDrawerClose} />
				<main className={classes.content}>
					<div className={classes.toolbar} />  {/*to push down the main content the same amount as the app titlebar */}
					<button onClick={this.addRoute}>AddWQ</button>
					{/* <Typography noWrap>{'You think water moves fast? You should see ice.'}</Typography>  REMOVE THIS - JUST FOR REFERENCE WITH TYPOGRAPHY */}

					{this.state.routeMenu}

				</main>


			</div>
		);
	}
}

AppLayout.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(AppLayout);