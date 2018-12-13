
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { withStyles } from '@material-ui/core/styles';
import { styles } from '../Styles/styles';

import {
	BrowserRouter as Router
} from 'react-router-dom';
import { setNavMenuExpand } from '../Store/Actions/NavMenu';


const mapStateToProps = (state) => {
	return {
		...state
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setNavMenuExpand: (value) => dispatch(setNavMenuExpand(value))
	}
}

class SedFF extends React.Component {


	render() {
		const { classes } = this.props;

		return (
			<React.Fragment>
				<div className={classes.root} >
					<AppBar
						position="absolute"
						className={classNames(classes.appBar, this.props.navMenuExpanded && classes.appBarShift)}
					>
						<Toolbar disableGutters={!this.props.navMenuExpanded}>
							<IconButton
								color="inherit"
								aria-label="expand drawer"
								onClick={()=>this.props.setNavMenuExpand(true)}
								className={classNames(classes.menuButton, this.props.navMenuExpanded && classes.hide)}
							>
								<ChevronRightIcon />
							</IconButton>

							<Typography variant="title" color="inherit" noWrap>
								{this.props.appBarText}
							</Typography>


							<IconButton
								color="inherit"
								aria-label="System Menu"
								onClick={this.handleSystemMenuIconClicked}
								className={classNames(classes.menuButton, classes.rightJustify, this.props.systemMenuOpen && classes.hide)}
							>
								<MenuIcon />
							</IconButton>
						</Toolbar>

					</AppBar>

					{/* <SystemMenu isOpen={this.state.systemMenuOpen}
						closeHandler={this.handleSystemMenuClose}
						menuItemClickHandler={this.handleSystemMenuItemClicked} />
					<SystemDialog isOpen={this.state.dialogOpen}
						closeHandler={this.handleDialogClose}
						dialogQuestions={this.state.curDialogQuestions}
						dialogName={this.state.curDialogName}
						dialogDescription={this.state.curDialogDescription}
						stateChangeHandler={this.dialogQuestionChangeSystemCallback}
						dialogValues={this.state.dialogValues}
						globalState={this.state}
						setLoggedInUser={this.setLoggedInUser}
						addStation={this.addStation}
						removeStation={this.removeStation} />
					<NavMenu isExpanded={this.state.navMenuExpanded}
						closeHandler={this.handleLeftDrawerClose}
						navMenuInfo={this.state.navMenuInfo}
						hiddenTabs={this.state.hiddenTabs} />
					<XMLDialog isOpen={this.state.XMLDialogOpen}
						setShippedStatus={this.setShippedStatus}
						handleXMLDialogClose={this.handleXMLDialogClose}
						getSedLOGINcompatibleXML={this.getSedLOGINcompatibleXML}
						username={this.state.loggedInUser}
						globalState={this.state}
					/>
					<QuestionDialog isOpen={this.state.questionDialogOpen}
						handleQuestionDialogClose={this.handleQuestionDialogClose}
						customQuestionAdder={this.customQuestionAdder}
						customQuestionDeleter={this.customQuestionDeleter}
					/> */}

					<main className={classes.content} >
						<div className={classes.toolbar} />  {/*to push down the main content the same amount as the app titlebar */}
						{/* <Router> */}
						{/* </Router> */}
						{/* {this.state.routesAndPages}
						{!isReasonablyValidUsernameInLS() && this.props.location.pathname !== '/'
							? <Redirect to='/' />
							: null} */}
					</main>
				</div >
			</React.Fragment>
		);
	}
}

SedFF = withStyles(styles, { withTheme: true })(SedFF);
// export default connect(mapStateToProps, mapDispatchToProps)(SedFF);
export default connect(mapStateToProps, mapDispatchToProps)(SedFF);