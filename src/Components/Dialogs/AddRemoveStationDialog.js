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

import { SEQuestionValueChange } from '../../Actions/SamplingEvents';
import { setAddRemoveStationDialogVisibility } from '../../Actions/UI';
import { createNewStationForUser } from '../../Actions/Stations';
import Question from '../Question';
import { getUsersStationIDs, getStationFromID } from '../../Utils/StoreUtilities';

const ADD = "ADD";
const REMOVE = "REMOVE";

const initialState = {
	
}

class AddRemoveStationDialog extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			addOrRemove: getUsersStationIDs(this.props.currentUsername).length > 0 
						? ""
						: ADD,
			newStation_agencyCode: "USGS"   //TODO: set this default in settings
		}
		
	}

	handleValueChange = (eventID, QID, value) => { 
		this.setState({ [QID]: value });
	};


	addButtonClickHandler = () => {
		//verify inputs
		if(typeof this.state.newStation_stationName === 'undefined' || this.state.newStation_stationName.length < 3 ) { // length shouldnt' be less than 3
			alert("New station requires a name before it can be added.");
			return;
		}

		if(typeof this.state.newStation_stationNumber === 'undefined' || this.state.newStation_stationNumber === "") {
			alert("New station requires a station number before it can be added.");
			return;
		}

		
		//create station object
			let newStation = {
				displayName: this.state.newStation_displayName,
				name: this.state.newStation_stationName,
				number: this.state.newStation_stationNumber,
				defaultProject: this.state.newStation_projectName,
				defaultProjectID: this.state.newStation_projectID,
				defaultAgencyCode: this.state.newStation_agencyCode,
			}	

		//add station
		let newStationID = this.props.createNewStationForUser(newStation, this.props.currentUsername);

		// console.log();
		try {
			this.props.SEQuestionValueChange(this.props.currentSamplingEventID, "stationName", getStationFromID(newStationID).name)
		} catch (e) {
			if (e.name === "TypeError") {
				//do nothing  //TODO: deeper check.  This happens when the current sampling event ID isn't set
			} else {
				throw e;
			}

		}
		
		this.closeHandler();
	}

	removeButtonClickHandler = () => {
		this.closeHandler();
	}

	


	closeHandler = () => {
		this.props.setAddRemoveStationDialogVisibility(false);
		setTimeout(() => {
			this.setState(initialState);
		}, 250);
	}

	//TODO: go through some global prop types for questions to get all avaiable options
	//TODO: there might not be existing custom questions -- hide the delete button and dialog info if there isn't
	render() {
		const { classes } = this.props;
		const { addRemoveStationDialogVisibility } = this.props.UI.visibility;


//TODO: NEXT:  Checkbox for loading (default checked)
//TODO NEXT: load additional items, triggered by stationName value change (ala: sampling points)
//TODO NEXT: React it up so removal refreshes/shows ... verify it deletes (confirm)... clear station name from current if currently loaded (double confirm)

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
								tabName="Add Station"
								required
								value={this.state.newStation_stationNumber}
								alternateChangeHandler={this.handleValueChange}
							/>
							<Question id="newStation_projectName"
								label="Project Name"
								type="Text"
								tabName="Add Station"
								value={this.state.newStation_projectName}
								alternateChangeHandler={this.handleValueChange}
							/>
							<Question id="newStation_projectID"
								label="Project ID"
								type="Text"
								tabName="Add Station"
								value={this.state.newStation_projectID}
								alternateChangeHandler={this.handleValueChange}
							/>
							<Question id="newStation_agencyCode"
								label="Agency Code"
								type="Text"
								tabName="Add Station"
								value={this.state.newStation_agencyCode}
								alternateChangeHandler={this.handleValueChange}
							/>

						</React.Fragment>
						: null}


					{this.state.addOrRemove === REMOVE
						? <React.Fragment>
							<Question
								id="removeStation_stationName"
								label="Station To Remove"
								type="StationDropDown"
								includeAddStation={false}
								value=""
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
	}
}

const mapDispatchToProps = {
	setAddRemoveStationDialogVisibility,
	createNewStationForUser,
	SEQuestionValueChange
}

AddRemoveStationDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AddRemoveStationDialog));