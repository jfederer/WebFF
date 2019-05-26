import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';

import { setAppBarText } from '../../Actions/UI';
import { TextField, Button, Paper, Checkbox, FormControl, Select, Typography } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';

import QuestionPage from './../QuestionPage';
import { DeviceBluetoothSearching } from 'material-ui/svg-icons';

import { SET_INFORMATION_IDENTIFIER } from '../../Constants/Config';

import { addQuestion } from '../../Actions/Questions';
import { SEQuestionValueChange } from '../../Actions/SamplingEvents';
import { getQuestionValue } from '../../Utils/QuestionUtilities';



class DataEntry extends React.Component {


	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Data Entry");
		this.state = {
			newSetName: "",
			addNewSetButtonDisabled: false,
			setsAdded: 0,  //TODO: probably shouldn't be zero... should look at event
			duplicateStationing: false,
			duplicateFromSet: ""
		}

	}

	handleAddSetNameChange = (e) => {
		this.setState({ newSetName: e.target.value });

		//TODO:
		// if (Object.keys(this.props.events).includes(e.target.value)) {
		// 	// WARNING, this will overwrite a deleted event
		// 	let matchedEvent = this.props.events[e.target.value];
		// 	if (!matchedEvent.deleted) {
		// 		this.setState({ newEventButtonDisabled: true });
		// 	}
		// } else {
		// 	this.setState({ newEventButtonDisabled: false });
		// }
	}

	handleDuplicateFromValueChange = (e) => {
		this.setState({ duplicateFromSet: e.target.value })
	}

	getNumberOfSets = () => { //TODO: move to util
		let num = Object.keys(this.props.currentEvent.questionsValues).filter((key) => {  //TODO: change these to getQuestionValues
			return key.startsWith(SET_INFORMATION_IDENTIFIER);
		}).length;
		return num;
	}

	getSetListAsArray = () => { //TODO: move to util
		let setListArr = [];
		setListArr = Object.keys(this.props.currentEvent.questionsValues).filter((key) => { //TODO: change these to getQuestionValues
			return key.startsWith(SET_INFORMATION_IDENTIFIER);
		})
		return setListArr;
	}

	getSetListAsObject = () => { //TODO: move to util
		let setListObj = {};
		this.getSetListAsArray().forEach(qid => {
			setListObj[qid.split(SET_INFORMATION_IDENTIFIER)[1]] = qid;
		});
		return setListObj;
	}


	getDistanceColumn = (values) => { //TODO: move to util
		for (let i = 0; i < values[0].length; i++) {
			if (values[0][i].startsWith('Distance from ')) {
				return i;
			}
		}
	}

	addSet = () => {
		const { currentSamplingEventID } = this.props;
		let newSetName = this.state.newSetName;  //FIXME: underscores not allowed
		if (!newSetName) {
			newSetName = String.fromCharCode(65 + this.getNumberOfSets())
		}

		let newSetValue = {};

		if (this.state.duplicateStationing) {
			// duplicating stationing from state.duplicateFromSet set

			// find selected set
			alert("duplicate statioing from " + this.state.duplicateFromSet);

			// get value
			let copyFromValue;
			try {
				copyFromValue = getQuestionValue(currentSamplingEventID, this.state.duplicateFromSet);
			}
			catch (err) {
				if (err.name === "TypeError") {
					alert("Cannot duplicate empty set.  Try unchecking duplicate box or try entering data-to-duplicate first.");
					return;
				} else {
					throw Error("Error occurred when trying to get value to duplicate set: ", err);
				}
			}

			console.log("Copy From: ", copyFromValue);

			// pass to getDistanceCol

			// use distance col to generate new value

			// duplicate # sampling points

			// set value
			Object.keys(copyFromValue).map((origKey) => {
				// origSetName = this.state.duplicateFromSet;
				let newKey = origKey.replace(this.state.duplicateFromSet, SET_INFORMATION_IDENTIFIER + newSetName);
				Object.assign(newSetValue, copyFromValue, {[newKey]: copyFromValue[origKey]});
			})
			

		}


		let newSetQuestion = {
			"id": SET_INFORMATION_IDENTIFIER + newSetName,
			"sedimentType": "suspended",
			"samplingMethod": "EDI",
			"label": "Set Information",
			"setName": newSetName,
			"type": "SetInformation",
			"includeBlank": true,
			"tabName": "Data Entry",
			"layoutGroup": "Set " + newSetName,
			"width_xs": 12,
			"width_lg": 12,
			"options":
				{},
			"value": newSetValue
		}
		console.log("NEWSETQUESTION: ", newSetQuestion);

		this.props.addQuestion(newSetQuestion);


		this.props.SEQuestionValueChange(currentSamplingEventID, SET_INFORMATION_IDENTIFIER + newSetName, newSetValue);

		this.setState({
			newSetName: "",
			setsAdded: this.state.setsAdded + 1,
			addNewSetButtonDisabled: true,
			duplicateFromSet: this.state.duplicateFromSet ? this.state.duplicateFromSet : SET_INFORMATION_IDENTIFIER + newSetName
		})
	}



	render() {
		const { currentEvent, classes } = this.props;
		console.log("DATA ENTRY RENDER STATE: ", this.state);

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}



		let setList = this.getSetListAsObject();

		return (<React.Fragment>
			<QuestionPage tabName="Data Entry" />


			<Paper>
				<div className={classes.horzCenterText}>
					<TextField
						id="addSetNameField"
						label="New Set Name (optional)"
						placeholder="New Set Name"
						margin="normal"
						onChange={this.handleAddSetNameChange}
						value={this.state.newSetName}
					/>
					{/* <Button variant="contained" color="default" className={classes.button}> */}

					<Button
						variant="outlined"
						margin="dense"
						onClick={() => this.addSet()}
					// disabled={this.state.addNewSetButtonDisabled && this.state.setsAdded !== this.getNumberOfSets()} //TODO: doesn't work correctly... never 
					>
						Add Set
					</Button>

					{Object.keys(setList).length > 0
						// {typeof this.state.setSelectOptions !== "undefined" &&  Object.keys(this.state.setSelectOptions).length > 0
						?
						<React.Fragment>

							<Checkbox
								checked={this.state.duplicateStationing}
								onChange={() => this.setState({ 'duplicateStationing': !this.state.duplicateStationing })}

							/>
							<Typography>Duplicate Stationing From Set:"</Typography>

							<Select
								native
								// autoWidth={true}
								// fullWidth
								value={this.state.duplicateFromSet}
								onChange={this.handleDuplicateFromValueChange}
							// inputProps={{
							// 	name: this.props.label,
							// 	id: this.props.id,
							// }}
							>
								{Object.keys(setList).map((optionLabel, index) => <option key={optionLabel} value={setList[optionLabel]}>{optionLabel}</option>)}

							</Select>
						</React.Fragment>
						: <React.Fragment>
							{console.log("Not rendering duplicate set form \n:::setList: ", setList, "\n:::currentEventValues: ", JSON.stringify(currentEvent.questionsValues))}
							{null}
						</React.Fragment>}



					{/* TODO: NEXT:  react upon sampling points... no table until then */}
					{/* TODO: NEXT: NEXT:  questions with default values need to go into sampling event */}
					{/* TODO: NEXT: NEXT: NEXT:  Hide options until samp method and sed type selected */}

				</div>
			</Paper>
		</React.Fragment>
		)
	}
}

const mapStateToProps = function (state) {
	return {
		currentSamplingEventID: state.SedFF.currentSamplingEventID,
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID]
	}
}

const mapDispatchToProps = {
	setAppBarText,
	addQuestion,
	SEQuestionValueChange
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(DataEntry));