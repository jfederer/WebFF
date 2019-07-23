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

const ADD = "ADD";
const REMOVE = "REMOVE";

const initialState = {

}

class AddRemoveStationDialog extends React.Component {

	constructor(props) {
		super(props);

		this.state = this.getInitialState();

	}

	getInitialState = () => {
		return _.cloneDeep({
			addOrRemove: this.props.stationIDs.length > 0
				? ""
				: ADD,
			newStation_agencyCode: "USGS",   //TODO: set this default in settings
			newStation_changeCurrent: true,
			newStation_stationName: "",
			newStation_displayName: "",
			newStation_stationNumber: "",
			newStation_projectName: "",
			newStation_projectID: ""
		})
	}

	handleValueChange = (eventID, QID, value) => {
		this.setState({ [QID]: value });
	};


	addButtonClickHandler = () => {
		//verify inputs
		if (typeof this.state.newStation_stationName === 'undefined' || this.state.newStation_stationName.length < 3) { // length shouldnt' be less than 3
			alert("New station requires a name before it can be added.");
			return;
		}
		if (typeof this.state.newStation_stationNumber === 'undefined' || this.state.newStation_stationNumber === "") {
			alert("New station requires a station number before it can be added.");
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
		}

		//add station
		let newStationID = this.props.createNewStationForUser(newStation, this.props.currentUsername);

		// conditionally set current station to newly-created one
		if (this.state.newStation_changeCurrent && this.props.currentSamplingEventID) {
			this.props.SEQuestionValueChange(this.props.currentSamplingEventID, "stationName", getStationFromID(newStationID).name)
			this.props.stationNameChanged(this.props.currentSamplingEventID, getStationFromID(newStationID).name);
		}

		this.closeHandler();
	}


	removeButtonClickHandler = () => {
		let removalConfirmed = window.confirm("You are about to remove station '" + this.state.removeStation_stationName + "' from your personal station list.  Are you sure?");

		if (removalConfirmed === true) {
			// check if station name is current in use in the sampling event
			let doubleCheckPassed = true;
			if (this.props.currentSamplingEventID && getQuestionValue(this.props.currentSamplingEventID, "stationName") === this.state.removeStation_stationName) {
				doubleCheckPassed = window.confirm("Station '" + this.state.removeStation_stationName + "' is set as your current event's station.  Removal will change this to the next available station in your personal station list.  Are you sure you want to continue?");
			}

			if (doubleCheckPassed) {
				this.props.removeStationFromUser(this.props.currentUsername, this.state.removeStation_stationName);
			}
		} else {
			alert("Removal of site '", this.state.removeStation_stationName, "' from your personal station list cancelled");
		}
		this.closeHandler();
	}




	closeHandler = () => {
		this.props.setAddRemoveStationDialogVisibility(false);
		setTimeout(() => {
			this.setState(this.getInitialState());
		}, 250);
	}

	//TODO: go through some global prop types for questions to get all avaiable options
	//TODO: there might not be existing custom questions -- hide the delete button and dialog info if there isn't
	render() {
		const { classes } = this.props;
		const { addRemoveStationDialogVisibility } = this.props.UI.visibility;


		return (
			<Dialog
				open={addRemoveStationDialogVisibility}
				onClose={this.closeHandler}
				aria-labelledby="form-dialog-title"
				fullWidth
				classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
			>
				<DialogTitle id="form-dialog-title">
					Station Manager
					{this.state.addOrRemove === ADD ? " (Adding)" : null}
					{this.state.addOrRemove === REMOVE ? " (Removing)" : null}
				</DialogTitle>

				<DialogContent>
					{this.state.addOrRemove === ""
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
							/>
						</React.Fragment>
						: null}
				</DialogContent>

				<DialogActions>
					{this.state.addOrRemove === ADD
						? <Button onClick={this.addButtonClickHandler} color="primary">
							Add Station
            		</Button>
						: null}
					{this.state.addOrRemove === REMOVE
						? <Button onClick={this.removeButtonClickHandler} color="primary">
							Remove Station
            		</Button>
						: null}
					<Button onClick={this.closeHandler} color="primary">
						Cancel
            		</Button>
				</DialogActions>
			</Dialog>
		);
	}
}




const mapStateToProps = function (state) {
	return {
		UI: state.UI, // to get dialog visibility
		users: state.Users,
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