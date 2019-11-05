import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { styles } from '../../../style';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import { setAppBarText, showQuestionPanel } from '../../../Actions/UI';
import { TextField, Button, Paper, Checkbox, Select, Typography, Tooltip } from '@material-ui/core';

import { SET_INFORMATION_IDENTIFIER, DATA_ENTRY_INFORMATION_IDENTIFIER, IDENTIFIER_SPLITTER, DISALLOWED_CHARACTERS_IN_SETNAME_REGEX } from '../../../Constants/Config';

import { addQuestionToEvent } from '../../../Actions/Questions';
import { SEQuestionValueChange, samplingEventBankChange } from '../../../Actions/SamplingEvents';
import { getQuestionValue } from '../../../Utils/QuestionUtilities';
import { getSetListAsArray, getSetListAsObject } from '../../../Utils/StoreUtilities';
import { getSetInformationQuestionsData } from '../../../Utils/StoreUtilities';


class AddSetForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			newSetName: "",
			addNewSetButtonDisabled: false,
			addNewSetDisabledReason: "",
			copyStationing: false,
			duplicateFromSet: ""
		}

	}

	fullSetName = (setName) => {
		return DATA_ENTRY_INFORMATION_IDENTIFIER + this.props.sedimentType + IDENTIFIER_SPLITTER + SET_INFORMATION_IDENTIFIER + setName;
	}

	/**
	 * is setName unique within all the sets of this given sediment type
	 */
	isSetNameUnique = (setName) => {

		let filteredSetList = getSetListAsArray(this.props.currentSamplingEventID, this.props.sedimentType).filter((existingSetName) => {
			return existingSetName.toUpperCase() === this.fullSetName(setName).toUpperCase();
		})

		return filteredSetList.length === 0;
	}

	handleAddSetNameChange = (e) => {
		// various characters are not allowed due to being special delinators
		if (e.target.value.match(DISALLOWED_CHARACTERS_IN_SETNAME_REGEX)) {
			return;
		}

		// filter out duplicate setnames and disable add set button if it's a duplicate
		if (this.isSetNameUnique(e.target.value)) {
			this.setState({
				addNewSetButtonDisabled: false,
				newSetName: e.target.value
			})
		} else {
			this.setState({
				addNewSetButtonDisabled: true,
				addNewSetDisabledReason: "Set name must be unique",
				newSetName: e.target.value
			})
			return;
		}
	}

	handleDuplicateFromValueChange = (e) => {
		this.setState({ duplicateFromSet: e.target.value })
	}

	addSet = () => {
		const { currentSamplingEventID, sedimentType, samplingMethod } = this.props;

		if (!sedimentType || !samplingMethod) {   //TODO: move to proptypes check
			alert("Must have a Sampling Method filled out on Field Form sheet before you can add a set");
			return;
		}

		let setList = getSetListAsArray(currentSamplingEventID, sedimentType);
		
		if(setList.length>=1) {
			let QP = "DataEntry:Average Representational Measures"+IDENTIFIER_SPLITTER+DATA_ENTRY_INFORMATION_IDENTIFIER+sedimentType;
			// console.log('QP :', QP);
			this.props.showQuestionPanel(QP);
		}

		let newSetName = this.state.newSetName;
		if (!newSetName) {
			let tries = 0;
			do {  // rare cases exist where the auto-generated set name may already be taken, in such case, generate the next until we find a unique one
				newSetName = String.fromCharCode(65 + tries + setList.length);
				tries++;
			} while (!this.isSetNameUnique(newSetName))
		}

		if (!this.isSetNameUnique(newSetName)) {
			alert("Set name (" + newSetName + ") must be unique within sediment type");
			return;
		}

		let newSetValue = {};

		

		if (this.state.copyStationing) {
			// duplicating stationing from state.duplicateFromSet set
			console.log("DUPE: Duplicating stationing... yes");
			// find selected set
			console.log("DUPE: duplicateFromSet: ", this.state.duplicateFromSet);

			// get value
			let copyFromValue;
			try {
				copyFromValue = getQuestionValue(currentSamplingEventID, DATA_ENTRY_INFORMATION_IDENTIFIER+sedimentType, this.state.duplicateFromSet);
			}
			catch (err) {
				if (err.name === "TypeError") {
					alert("Cannot duplicate empty or non-existent set.  Try unchecking duplicate box or try entering data-to-duplicate first.");
					return;
				} else {
					throw Error("Error occurred when trying to get value to duplicate set: ", err);
				}
			}
			console.log('DUPE: copyFromValue :', copyFromValue);

			// pass to getDistanceCol //TODO:

			// use distance col to generate new value //TODO:

			// duplicate # sampling points //TODO:

			// set value
			Object.keys(copyFromValue).forEach((origKey) => {
				// origSetName = this.state.duplicateFromSet;
				let newKey = origKey.replace(this.state.duplicateFromSet, SET_INFORMATION_IDENTIFIER + newSetName);
				Object.assign(newSetValue, copyFromValue, { [newKey]: copyFromValue[origKey] });
			})
		} 

		let defaultSetInformationQD = getSetInformationQuestionsData();

		let newSetQuestion = {
			"id": this.fullSetName(newSetName),  //this sets the name of the question in custom questions
			// "sedimentType": sedimentType,
			// "samplingMethod": samplingMethod,
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
		_.merge(newSetQuestion, defaultSetInformationQD);

		// console.log('DUPE: newSetQuestion :', newSetQuestion);

		// save the sets QuestionsData to custom question area
		this.props.addQuestionToEvent(currentSamplingEventID, newSetQuestion);

		// save the VALUES...
		if (this.props.alternateChangeHandler) {
			this.props.alternateChangeHandler(currentSamplingEventID, newSetQuestion.id, newSetValue);
		} else {
			this.props.SEQuestionValueChange(currentSamplingEventID, newSetQuestion.id, newSetValue);
		}
		
		this.setState({
			newSetName: "",
			duplicateFromSet: this.state.duplicateFromSet ? this.state.duplicateFromSet : this.fullSetName(newSetName)
		})
	}



	render() {
		const { currentEvent, currentSamplingEventID, classes, sedimentType } = this.props;

		if (!currentEvent) {
			console.warn("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}

		let setList = getSetListAsObject(currentSamplingEventID, sedimentType);

		return (<React.Fragment>
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
					<Tooltip title={this.state.addNewSetButtonDisabled ? this.state.addNewSetDisabledReason : ""}>
						<div><Button
							variant="outlined"
							margin="dense"
							onClick={() => this.addSet()}
							disabled={this.state.addNewSetButtonDisabled}
						>
							Add Set
					</Button>
						</div>
					</Tooltip>

					{Object.keys(setList).length > 0
						? <React.Fragment>

							<Checkbox
								checked={this.state.copyStationing}
								onChange={() => this.setState({ copyStationing: !this.state.copyStationing })}
							/>
							<Typography>Duplicate Set:"</Typography>

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
								{/* TODO: filter list to only sets that HAVE stationing */}

							</Select>
						</React.Fragment>
						: <React.Fragment>
							{null}
						</React.Fragment>}
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
	addQuestionToEvent,
	SEQuestionValueChange,
	showQuestionPanel,
	samplingEventBankChange
}

AddSetForm.propTypes = {
	sedimentType: PropTypes.string.isRequired,
	samplingMethod: PropTypes.string.isRequired
};

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(AddSetForm));