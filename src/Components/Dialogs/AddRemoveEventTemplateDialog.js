import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import { styles } from '../../style';
import uuidv4 from 'uuid';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

// import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';

import { SEQuestionValueChange, stationNameChanged } from '../../Actions/SamplingEvents';
import { setAddRemoveEventTemplateDialogVisibility } from '../../Actions/UI';
import { createNewStationForUser, removeStationFromUser } from '../../Actions/Stations';
import Question from '../Question';
import { getQuestionsData, getEventFromID } from '../../Utils/StoreUtilities';
import { getQuestionValue } from '../../Utils/QuestionUtilities';
import { Typography, FormControl } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { LEFT_BANK_VALUE, RIGHT_BANK_VALUE } from '../../Constants/Dictionary';
import { Divider } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';

import { registerEventTemplateWithUser } from '../../Actions/User';
import { setEventTemplate } from '../../Actions/SedFF';

const ADD = "ADD";
const REMOVE = "REMOVE";
const EITHER = "EITHER";
const EVENT_KEY_SPLITTER = "&&&";

class AddRemoveEventTemplateDialog extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isInitialized: false
		};

	}

	getInitialState = () => {
	
		return _.cloneDeep({
			addOrRemove: this.props.eventTemplateIDs && this.props.eventTemplateIDs.length > 0
				? EITHER
				: ADD,
			fromEventID: "",
			newEventTemplateName: ""
			// templateIDToRemove:
			// newStation_agencyCode: "USGS",   //TODO: set this default in settings
			// newStation_changeCurrent: true,
			// newStation_stationName: "",
			// newStation_displayName: "",
			// newStation_stationNumber: "",
			// newStation_projectName: "",
			// newStation_projectID: "",
			// newStation_fromLBank: LEFT_BANK_VALUE,
			// removeStation_stationName: "",

			// allStationIDs: this.props.getUsersStationIDs(this.props.currentUsername);
		})
	}



	onEnter = () => {
		this.setState(this.getInitialState(),
			() => this.setState({ isInitialized: true })
		);
	}


	handleCheckValueChange = (id) => (event) => {
		// console.log('event', event)
		// console.log('id: ', id);
		this.setState({ [id]: event.target.checked });

	};

	newTemplateNameValueChange  = (eventID, QID, value) => {
		this.setState({ newEventTemplateName: value });
	};

	eventDropDownValueChange = (eventID, QID, value) => {
		this.setState({ fromEventID: value });
	};

	//returns tool tip message for add button... or true if all prereqs exist.
	requiredInputsExist = () => {
		// if (typeof this.state.newStation_stationName === 'undefined' || this.state.newStation_stationName.length < 3) { // length shouldnt' be less than 3
		// 	return "New station requires a name before it can be added.";
		// }
		// if (typeof this.state.newStation_stationNumber === 'undefined' || this.state.newStation_stationNumber === "") {
		// 	return "New station requires a station number before it can be added.";
		// }
		if (!this.state.newEventTemplateName) {
			return "Must enter a template name";
		}

		if (!this.state.fromEventID) {
			return "Must select an event to use as template";
		}

		return true;
	}

	

	addButtonClickHandler = () => {
		//verify inputs
		if (!this.requiredInputsExist() === true) {
			return;
		}

		console.log("state: ", this.state);

		let selectedItemsForTemplate = Object.keys(this.state).filter(key => key.startsWith(this.state.fromEventID) && this.state[key] === true);
		// console.log('selectedItemsForTemplate', selectedItemsForTemplate)
		selectedItemsForTemplate.forEach((item, index) => selectedItemsForTemplate[index] = item.split(EVENT_KEY_SPLITTER)[1]);
		console.log('selectedItemsForTemplate', selectedItemsForTemplate)

		let templateQuestionsValuesObj = {};
		selectedItemsForTemplate.forEach(QID => templateQuestionsValuesObj[QID] = getQuestionValue(this.state.fromEventID, QID));
		console.log('templateQuestionsValuesObj', templateQuestionsValuesObj)

		let templateQuestionsDataObj = {};
		selectedItemsForTemplate.forEach(QID => templateQuestionsDataObj[QID] = getQuestionsData(this.state.fromEventID)[QID]);
		console.log('templateQuestionsDataObj :', templateQuestionsDataObj);

		//create Event Template Object
		let newEventTemplate = {
			eventTemplateID: uuidv4(),
			eventTemplateName: this.state.newEventTemplateName,
			questionValues: templateQuestionsValuesObj,
			questionsData: templateQuestionsDataObj,
			dateModified: new Date().toString(),
		}

		console.log('newEventTemplate :', newEventTemplate);

		// save Event Template
		this.props.setEventTemplate(newEventTemplate);

		// add Event template to this users link table  (link table due to it being handy to share between users)
		this.props.registerEventTemplateWithUser(newEventTemplate.eventTemplateID, this.props.currentUsername);

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
		this.props.setAddRemoveEventTemplateDialogVisibility(false);
	}

	getEventsAsObject = (eventIDs) => {
		let retObj = {};
		eventIDs.forEach(eventID => {
			let evt = getEventFromID(eventID);
			let evtName = evt.eventName;
			if (retObj[evtName]) {
				evtName = evtName + "( last modified " + new Date(evt.dateModified).toLocaleString() + ")";
			}
			retObj[evtName] = eventID;
		})
		return retObj;
	}

	render() {
		const { classes, addRemoveEventTemplateDialogVisibility } = this.props;
		// console.log('this.props', this.props)
		// console.log('this.state :', this.state);

		return (

			<Dialog
				open={addRemoveEventTemplateDialogVisibility}
				onClose={this.dialogCloseHandler}
				onEnter={this.onEnter}
				aria-labelledby="form-dialog-title"
				// fullWidth
				maxWidth={'xl'}
				classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
			>
				{this.state.isInitialized && addRemoveEventTemplateDialogVisibility ?
					<React.Fragment><DialogTitle id="form-dialog-title">
						Event Template Manager
					{this.state.addOrRemove === ADD ? " (Adding)" : null}
						{this.state.addOrRemove === REMOVE ? " (Removing)" : null}
					</DialogTitle>

						<DialogContent>
							{this.state.addOrRemove === EITHER
								? <React.Fragment>
									Add a new event template to, or remove an existing event template from, your personalized event template list?
							<br></br>
									<Button onClick={() => this.setState({ addOrRemove: ADD })}>Add Event Template</Button>
									<Button onClick={() => this.setState({ addOrRemove: REMOVE })}>Remove Event Template</Button>
								</React.Fragment>
								: null}

							{this.state.addOrRemove === ADD
								? <React.Fragment>
									<Question
										id="newEventTemplateName"
										label="Event Template Name"
										type="Text"
										helperText="Name of the event template"
										value={this.state.newEventTemplateName}
										required
										alternateChangeHandler={this.newTemplateNameValueChange}
									/>
									Add questions from event:
									<Question id="eventDropDown"
										label="Event to use as template"
										type="DropDown"
										options={this.getEventsAsObject(this.props.eventIDs)}
										value={this.state.fromEventID ? this.state.fromEventID : ""}
										alternateChangeHandler={this.eventDropDownValueChange}
										includeBlank={true}
									/>
									{!getEventFromID(this.state.fromEventID)
										? "Select a valid event to build a template"
										: <Fragment>
											<br></br>
											<Divider></Divider>
											<br></br>

											<Typography variant='h6'>Select which values you'd like to include in the template:</Typography>
											<br></br>
											<Grid container spacing={3}>
												{Object.keys(getEventFromID(this.state.fromEventID).questionsValues).map(key => {
													let id = this.state.fromEventID + EVENT_KEY_SPLITTER + key;
													let label = key;
													let value = getQuestionValue(this.state.fromEventID, key);
													
													
													if(Array.isArray(value) || typeof value === 'object') {
														value="All Values";
													}

													// console.log('key :', key);
													// console.log('getQuestionsData(this.state.fromEventID) :', getQuestionsData(this.state.fromEventID));
													if(key.includes('::')) {  
														label = key.replace('::', ' - ');
													} else {
														try {
														label = getQuestionsData(this.state.fromEventID)[key].label;
														} catch (e) {
															console.warn("Failed to find label on fromEventID: " + this.state.fromEventID + " key: " + key + " :: " + e);
														}
													}
													// console.log('label :', label);

													// console.assert(id!==false, "ID was false label: " + label);
													// console.log('id :', id);
													// console.log('label :', label);
													// console.log('value :', value);


													return <Grid item xs={6} md={4} xl={3} key={"Grid" + id}>
														<Paper elevation={5}>
															<Grid container spacing={1}>
																<Grid item xs={1}>

																	<Checkbox
																		id={id}
																		key={id}
																		checked={this.state[id] || false}
																		// checked={false}
																		onChange={this.handleCheckValueChange(id)}
																	/>
																</Grid>
																<Grid item xs={11}>
																	<div>
																		<Typography display={'inline'} className={classes.templateKey}>{label}: </Typography>
																		<Typography className={classes.templateValue}>({value.toString().substring(0, 50)})</Typography>
																	</div>
																</Grid>

															</Grid>
														</Paper>
													</Grid>
												})}
											</Grid>
										</Fragment>
									}


									{/* <Question
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

									<Question id="newStation_fromLBank"
										label="Default bank for measuring distance"
										type="DropDown"
										options={{
											"Left Bank": LEFT_BANK_VALUE,
											"Right Bank": RIGHT_BANK_VALUE
										}}
										value={this.state.newStation_fromLBank}
										alternateChangeHandler={this.handleValueChange}
									/>
									<br />

									<Question id="newStation_changeCurrent"
										label="Set current event to this station"
										type="Toggle"
										checkbox={true}
										value={this.state.newStation_changeCurrent}
										alternateChangeHandler={this.handleValueChange}
									/> */}

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
										Add Event Template
									</Button></div>
								</Tooltip>


								: null}
							{this.state.addOrRemove === REMOVE
								? <Button onClick={this.removeButtonClickHandler} color="primary">
									Remove Event Template
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
		addRemoveEventTemplateDialogVisibility: state.UI.visibility.addRemoveEventTemplateDialogVisibility,
		currentUsername: state.SedFF.currentUsername,
		eventIDs: state.SamplingEventsLinkTables[state.SedFF.currentUsername] ? state.SamplingEventsLinkTables[state.SedFF.currentUsername].events : null,
		eventTemplateIDs: state.EventTemplatesLinkTables[state.SedFF.currentUsername] ? state.EventTemplatesLinkTables[state.SedFF.currentUsername].eventTemplates : null,

		// currentSamplingEventID: state.SedFF.currentSamplingEventID,

	}
}

const mapDispatchToProps = {
	setAddRemoveEventTemplateDialogVisibility,
	setEventTemplate,
	registerEventTemplateWithUser

	// createNewStationForUser,
	// SEQuestionValueChange,
	// removeStationFromUser,
	// stationNameChanged
}

AddRemoveEventTemplateDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AddRemoveEventTemplateDialog));