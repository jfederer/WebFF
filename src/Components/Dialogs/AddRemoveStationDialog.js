import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { styles } from '../../style';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';


// import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';

import { SEQuestionValueChange, stationNameChanged } from '../../Actions/SamplingEvents';
import { setAddRemoveStationDialogVisibility } from '../../Actions/UI';
import { createNewStationForUser, removeStationFromUser } from '../../Actions/Stations';
import Question from '../Question';
import { getUsersStationIDs, getStationFromID } from '../../Utils/StoreUtilities';
import { getQuestionValue } from '../../Utils/QuestionUtilities';
import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

const ADD = "ADD";
const REMOVE = "REMOVE";
const EITHER = "EITHER";


class AddRemoveStationDialog extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isInitialized: false
		};

	}

	getInitialState = () => {

		return _.cloneDeep({
			addOrRemove: this.props.stationIDs && this.props.stationIDs.length > 0
				? EITHER
				: ADD,
			newStation_agencyCode: "USGS",   //TODO: set this default in settings
			newStation_changeCurrent: true,
			newStation_stationName: "",
			newStation_displayName: "",
			newStation_stationNumber: "",
			newStation_projectName: "",
			newStation_projectID: "",
			removeStation_stationName: ""
			// allStationIDs: this.props.getUsersStationIDs(this.props.currentUsername);
		})
	}



	onEnter = () => {
		this.setState(this.getInitialState(),
			() => this.setState({ isInitialized: true })
		);
	}


	handleValueChange = (eventID, QID, value) => {
		this.setState({ [QID]: value });
	};

	//returns tool tip message for add button... or true if all prereqs exist.
	requiredInputsExist = () => {
		if (typeof this.state.newStation_stationName === 'undefined' || this.state.newStation_stationName.length < 3) { // length shouldnt' be less than 3
			return "New station requires a name before it can be added.";
		}
		if (typeof this.state.newStation_stationNumber === 'undefined' || this.state.newStation_stationNumber === "") {
			return "New station requires a station number before it can be added.";
		}
		return true;
	}

	addButtonClickHandler = () => {
		//verify inputs
		if (!this.requiredInputsExist() === true) {
			return;
		}

		//create station object
		// remember to make any changes here reflect in stationNameChanged function
		let newStation = {
			displayName: this.state.newStation_displayName,
			name: this.state.newStation_stationName,
			number: this.state.newStation_stationNumber,
			defaultProjectName: this.state.newStation_projectName,
			defaultProjectID: this.state.newStation_projectID,
			defaultAgencyCode: this.state.newStation_agencyCode,
			questionsData: {}
		}

		//add station
		let newStationID = this.props.createNewStationForUser(newStation, this.props.currentUsername);

		// conditionally set current station to newly-created one
		if (this.state.newStation_changeCurrent && this.props.currentSamplingEventID) {
			this.props.SEQuestionValueChange(this.props.currentSamplingEventID, "stationName", getStationFromID(newStationID).name)
			this.props.stationNameChanged(this.props.currentSamplingEventID, getStationFromID(newStationID).name);
		}

		this.dialogCloseHandler();
	}


	removeButtonClickHandler = () => {
		let removalConfirmed = window.confirm("You are about to remove station '" + this.state.removeStation_stationName + "' from your personal station list.  Are you sure?");

		let cancellationMessage = "Removal of site '" + this.state.removeStation_stationName + "' from your personal station list cancelled";

		if (removalConfirmed === true) {
			// check if station name is current in use in the sampling event
			let doubleCheckPassed = true;
			if (this.props.currentSamplingEventID && getQuestionValue(this.props.currentSamplingEventID, "stationName") === this.state.removeStation_stationName) {
				doubleCheckPassed = window.confirm("Station '" + this.state.removeStation_stationName + "' is set as your current event's station.\n\n  Removal will change this, and all station-linked data (station number, project name, project ID, agency code, and any custom questions saved to this station), to the next available station in your personal station list.  \n\nAre you sure you want to continue?");
			}

			if (doubleCheckPassed) {
				this.props.removeStationFromUser(this.props.currentUsername, this.state.removeStation_stationName);
				// the process of switching to the next available station name is handled with the validity checking of the stationDropDown question.
			} else {
				alert(cancellationMessage);
			}
		} else {
			alert(cancellationMessage);
		}
		this.dialogCloseHandler();
	}




	dialogCloseHandler = () => {
		this.props.setAddRemoveStationDialogVisibility(false);
		setTimeout(() => {
			this.setState({
				isInitialized: false
			})
		}, 250);
	}

	//TODO: go through some global prop types for questions to get all avaiable options
	//TODO: there might not be existing custom questions -- hide the delete button and dialog info if there isn't
	render() {
		const { classes, addRemoveStationDialogVisibility } = this.props;

		return (
			<Dialog
				open={addRemoveStationDialogVisibility}
				onClose={this.dialogCloseHandler}
				onEnter={this.onEnter}
				aria-labelledby="form-dialog-title"
				fullWidth
				classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
			>
				{this.state.isInitialized && addRemoveStationDialogVisibility ?
					<React.Fragment><DialogTitle id="form-dialog-title">
						Station Manager
					{this.state.addOrRemove === ADD ? " (Adding)" : null}
						{this.state.addOrRemove === REMOVE ? " (Removing)" : null}
					</DialogTitle>

						<DialogContent>
							{this.state.addOrRemove === EITHER
								? <React.Fragment>
									Add a new station to, or remove an existing station from, your personalized station list?
							<br></br>
									<Button onClick={() => this.setState({ addOrRemove: ADD })}>Add Station</Button>
									<Button onClick={() => this.setState({ addOrRemove: REMOVE })}>Remove Station</Button>
								</React.Fragment>
								: null}

							{this.state.addOrRemove === ADD
								? <React.Fragment>
									<Question
										id="newStation_stationName"
										label="Station Full Name"
										type="Text"
										helperText="Full station name for use in SedLOGIN and other output formats"
										value={this.state.newStation_stationName}
										required
										alternateChangeHandler={this.handleValueChange}
									/>
									<Question
										id="newStation_displayName"
										label="Station Display Name"
										type="Text"
										helperText="Station Name to be displayed in the drop down menu in SedFF"
										value={this.state.newStation_displayName}
										alternateChangeHandler={this.handleValueChange}
									/>
									<Question id="newStation_stationNumber"
										label="Station Number"
										type="Text"
										required
										value={this.state.newStation_stationNumber}
										alternateChangeHandler={this.handleValueChange}
									/>
									<Question id="newStation_projectName"
										label="Project Name"
										type="Text"
										value={this.state.newStation_projectName}
										alternateChangeHandler={this.handleValueChange}
									/>
									<Question id="newStation_projectID"
										label="Project ID"
										type="Text"
										value={this.state.newStation_projectID}
										alternateChangeHandler={this.handleValueChange}
									/>
									<Question id="newStation_agencyCode"
										label="Agency Code"
										type="Text"
										value={this.state.newStation_agencyCode}
										alternateChangeHandler={this.handleValueChange}
									/>
									<Question id="newStation_changeCurrent"
										label="Set current event to this station"
										type="Toggle"
										checkbox={true}
										value={this.state.newStation_changeCurrent}
										alternateChangeHandler={this.handleValueChange}
									/>

								</React.Fragment>
								: null}


							{this.state.addOrRemove === REMOVE
								? <React.Fragment>
									<Typography>Select the station to remove from your personal station list:</Typography>
									<Question
										id="removeStation_stationName"
										label="Station To Remove"
										type="StationDropDown"
										includeAddStation={false}
										includeBlank={true}
										alternateChangeHandler={this.handleValueChange}
										inDialog={true}
										value={this.state.removeStation_stationName}
									/>
								</React.Fragment>
								: null}
						</DialogContent>

						<DialogActions>
							{this.state.addOrRemove === ADD
								? <Tooltip title={this.requiredInputsExist() === true ? "good" : this.requiredInputsExist()} placement="bottom-end">
									<div><Button onClick={this.addButtonClickHandler} color="primary" disabled={this.requiredInputsExist() !== true}>
										Add Station
									</Button></div>
								</Tooltip>


								: null}
							{this.state.addOrRemove === REMOVE
								? <Button onClick={this.removeButtonClickHandler} color="primary">
									Remove Station  
									{//TODO: disable button util station selected...
									}
            		</Button>
								: null}
							<Button onClick={this.dialogCloseHandler} color="primary">
								Cancel
            		</Button>
						</DialogActions>
					</React.Fragment> : 'Working...'}
			</Dialog>
		);
	}
}




const mapStateToProps = function (state) {
	return {
		addRemoveStationDialogVisibility: state.UI.visibility.addRemoveStationDialogVisibility,
		currentUsername: state.SedFF.currentUsername,
		currentSamplingEventID: state.SedFF.currentSamplingEventID,
		stationIDs: state.LinkTables.userStations[state.SedFF.currentUsername]
	}
}

const mapDispatchToProps = {
	setAddRemoveStationDialogVisibility,
	createNewStationForUser,
	SEQuestionValueChange,
	removeStationFromUser,
	stationNameChanged
}

AddRemoveStationDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AddRemoveStationDialog));