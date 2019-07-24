import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { styles } from '../../../style';
import { withStyles } from '@material-ui/core/styles';

import { setAppBarText } from '../../../Actions/UI';
import { TextField, Button, Paper, Checkbox, Select, Typography, Tooltip } from '@material-ui/core';

import { SET_INFORMATION_IDENTIFIER } from '../../../Constants/Config';

import { addQuestionToEvent } from '../../../Actions/Questions';
import { SEQuestionValueChange } from '../../../Actions/SamplingEvents';
import { getQuestionValue, getMethodCategoryFromValue } from '../../../Utils/QuestionUtilities';
import { getNumberOfSets, getSetListAsArray, getSetListAsObject } from '../../../Utils/StoreUtilities';



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

		if(getNumberOfSets(this.props.currentSamplingEventID)===0) {
			this.addSet();
		}

	}


	handleAddSetNameChange = (e) => {
		const { currentSamplingEventID } = this.props;

		// underscores are not allowed due to it being a delinator
		if (e.target.value.includes('_')) {
			return;
		}

		// fitler out duplicate setnames and disable add set button if it's a duplicate
		if (getSetListAsArray(currentSamplingEventID).filter((existingSetName) => {
			return existingSetName.toUpperCase() === SET_INFORMATION_IDENTIFIER.toUpperCase() + e.target.value.toUpperCase()
		}).length > 0) {
			this.setState({
				addNewSetButtonDisabled: true,
				addNewSetDisabledReason: "Set name must be unique",
				newSetName: e.target.value
			})
			return;
		} else {
			this.setState({
				addNewSetButtonDisabled: false,
				newSetName: e.target.value
			})
		}
	}

	handleDuplicateFromValueChange = (e) => {
		this.setState({ duplicateFromSet: e.target.value })
	}

	addSet = () => {
		const { currentSamplingEventID } = this.props;
		let newSetName = this.state.newSetName;  //FIXME: underscores not allowed
		if (!newSetName) {
			newSetName = String.fromCharCode(65 + getNumberOfSets(currentSamplingEventID))
		}

		let newSetValue = {};
		

		if (this.state.copyStationing) {
			// duplicating stationing from state.duplicateFromSet set

			// find selected set

			// get value
			let copyFromValue;
			try {
				copyFromValue = getQuestionValue(currentSamplingEventID, this.state.duplicateFromSet);
			}
			catch (err) {
				if (err.name === "TypeError") {
					alert("Cannot duplicate empty or non-existent set.  Try unchecking duplicate box or try entering data-to-duplicate first.");
					return;
				} else {
					throw Error("Error occurred when trying to get value to duplicate set: ", err);
				}
			}

			// pass to getDistanceCol //TODO:

			// use distance col to generate new value //TODO:

			// duplicate # sampling points //TODO:

			// set value
			Object.keys(copyFromValue).map((origKey) => {
				// origSetName = this.state.duplicateFromSet;
				let newKey = origKey.replace(this.state.duplicateFromSet, SET_INFORMATION_IDENTIFIER + newSetName);
				Object.assign(newSetValue, copyFromValue, { [newKey]: copyFromValue[origKey] });
				return null; //returning to satisfy linter
			})
		} else { // not copying stationing
			// insert the default samplesTable value
			//newSetValue['samplesTable_EDI'] = //TODO: pull from FF
		}

		let sedimentType = getQuestionValue(currentSamplingEventID, "sedimentType");
		let samplingMethod = getQuestionValue(currentSamplingEventID, "samplingMethod_" + sedimentType); 
		// console.log("SedType: ", sedimentType);
		// console.log("SampMethod: ", samplingMethod); 
		if (!sedimentType || !samplingMethod) {
			alert("Must have both Sediment Type and Sampling Method filled out on Field Form sheet before you can add a set");
			return;
		}

		let newSetQuestion = {
			"id": SET_INFORMATION_IDENTIFIER + newSetName,
			"sedimentType": sedimentType,  
			"samplingMethod": samplingMethod, 
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

		this.props.addQuestionToEvent(currentSamplingEventID, newSetQuestion);

		this.props.SEQuestionValueChange(currentSamplingEventID, SET_INFORMATION_IDENTIFIER + newSetName, newSetValue);

		this.setState({
			newSetName: "",
			duplicateFromSet: this.state.duplicateFromSet ? this.state.duplicateFromSet : SET_INFORMATION_IDENTIFIER + newSetName
		})
	}



	render() {
		const { currentEvent, currentSamplingEventID, classes } = this.props;
		// console.log("DATA ENTRY RENDER STATE: ", this.state);

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}

		let setList = getSetListAsObject(currentSamplingEventID);

		return (<React.Fragment>
			<Paper> {/*Add Set Form  FUTURE: split out as separate component?*/}
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
						// {typeof this.state.setSelectOptions !== "undefined" &&  Object.keys(this.state.setSelectOptions).length > 0
						?
						<React.Fragment>

							<Checkbox
								checked={this.state.copyStationing}
								onChange={() => this.setState({ copyStationing: !this.state.copyStationing })}

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
	SEQuestionValueChange
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(AddSetForm));