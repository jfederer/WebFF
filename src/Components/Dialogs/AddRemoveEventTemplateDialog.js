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
import { getQuestionsData, getEventFromID, getEventTemplateFromID } from '../../Utils/StoreUtilities';
import { getQuestionValue } from '../../Utils/QuestionUtilities';
import { Typography, FormControl } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { LEFT_BANK_VALUE, RIGHT_BANK_VALUE } from '../../Constants/Dictionary';
import { Divider } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';

import { registerEventTemplateWithUser, removeEventTemplateFromUser } from '../../Actions/User';
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
			newEventTemplateName: "",
			eventTemplateIDToRemove: ""
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
		this.setState({ [id]: event.target.checked });

	};

	newTemplateNameValueChange = (eventID, QID, value) => {
		this.setState({ newEventTemplateName: value });
	};

	fromEventDropDownValueChange = (eventID, QID, value) => {
		this.setState({ fromEventID: value });
	};

	removeEventDropDownValueChange = (eventID, QID, value) => {
		this.setState({ eventTemplateIDToRemove: value });
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
			dateCreated: new Date().toString(),
		}

		console.log('newEventTemplate :', newEventTemplate);

		// save Event Template
		this.props.setEventTemplate(newEventTemplate);

		// add Event template to this users link table  (link table due to it being handy to share between users)
		this.props.registerEventTemplateWithUser(newEventTemplate.eventTemplateID, this.props.currentUsername);

		this.dialogCloseHandler();
	}


	removeButtonClickHandler = () => {
		let removalConfirmed = window.confirm("You are about to remove event template '" + getEventTemplateFromID(this.state.eventTemplateIDToRemove).eventTemplateName + "' from your personal event template list.  Are you sure?");

		let cancellationMessage = "Removal of event template '" + getEventTemplateFromID(this.state.eventTemplateIDToRemove).eventTemplateName + "' from your personal event template list cancelled";

		if (removalConfirmed === true) {
				this.props.removeEventTemplateFromUser(this.state.eventTemplateIDToRemove, this.props.currentUsername);
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
		let eventNames = eventIDs.map(eventID => getEventFromID(eventID).eventName)
		let namesThatHaveDuplicates = eventNames.filter((name, i, names) => names.indexOf(name) === i && names.lastIndexOf(name) !== i);

		eventIDs.forEach(eventID => {
			let evt = getEventFromID(eventID);
			let evtName = evt.eventName;
			if (namesThatHaveDuplicates.includes(evtName)) {
				evtName = evtName + "( last modified " + new Date(evt.dateModified).toLocaleString() + ")";
			}
			retObj[evtName] = eventID;
		})
		return retObj;
	}

	getTemplatesAsObjects = (eventTemplateIDs) => {  //TODO: copy to util class -- allso used in NewEventForm
		let retObj = {};
		let templateNames = eventTemplateIDs.map(eventTemplateID => getEventTemplateFromID(eventTemplateID).eventTemplateName)
		let namesThatHaveDuplicates = templateNames.filter((name, i, names) => names.indexOf(name) === i && names.lastIndexOf(name) !== i);

		eventTemplateIDs.forEach(eventTemplateID => {
			let evtTemp = getEventTemplateFromID(eventTemplateID);
			let evtTempName = evtTemp.eventTemplateName;
			if (namesThatHaveDuplicates.includes(evtTempName)) {
				evtTempName = evtTempName + "( last modified " + new Date(evtTemp.dateModified).toLocaleString() + ")";
			}
			retObj[evtTempName] = eventTemplateID;
		})
		return retObj;
	}

	render() {
		const { classes, addRemoveEventTemplateDialogVisibility, eventTemplateIDs } = this.props;
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
										alternateChangeHandler={this.fromEventDropDownValueChange}
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


													if (Array.isArray(value) || typeof value === 'object') {
														value = "All Values";
													}

													if (key.includes('::')) {
														label = key.replace('::', ' - ');
													} else {
														try {
															label = getQuestionsData(this.state.fromEventID)[key].label;
														} catch (e) {
															console.warn("Failed to find label on fromEventID: " + this.state.fromEventID + " key: " + key + " :: " + e);
														}
													}

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

								</React.Fragment>
								: null}


							{this.state.addOrRemove === REMOVE
								? <React.Fragment>
									<Typography>Select the event template to remove from your personal event template list:</Typography>
									{console.log('this.props.eventTemplateIDs :', this.props.eventTemplateIDs)}
									<Question
										id="eventTemplateToRemove"
										label="Event Template To Remove"
										type="DropDown"
										includeBlank={true}
										alternateChangeHandler={this.removeEventDropDownValueChange}
										value={this.state.eventTemplateToRemove}
										options={this.getTemplatesAsObjects(eventTemplateIDs)}
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
								? <Button onClick={this.removeButtonClickHandler} color="primary" disabled={this.state.eventTemplateIDToRemove===""}>
									Remove Event Template
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
	registerEventTemplateWithUser,
	removeEventTemplateFromUser

	// createNewStationForUser,
	// SEQuestionValueChange,
	// removeStationFromUser,
	// stationNameChanged
}

AddRemoveEventTemplateDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AddRemoveEventTemplateDialog));