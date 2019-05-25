import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';

import { setAppBarText } from '../../Actions/UI';
import { TextField, Button, Paper } from '@material-ui/core';

import QuestionPage from './../QuestionPage';
import { DeviceBluetoothSearching } from 'material-ui/svg-icons';

import { SET_INFORMATION_IDENTIFIER } from '../../Constants/Config';


import { addQuestion } from '../../Actions/Questions';
import { SEQuestionValueChange } from '../../Actions/SamplingEvents'




class DataEntry extends React.Component {


	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Data Entry");
		this.state = {
			newSetName: "",
			addNewSetButtonDisabled: false,
			setsAdded: 0
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

	getNumberOfSets = () => {
		let num = Object.keys(this.props.currentEvent.questionValues).filter((key) => {
			return key.startsWith(SET_INFORMATION_IDENTIFIER);
		}).length;
		return num;
	}

	addSet = () => {
		const { currentSamplingEventID } = this.props;
		let newSetName = this.state.newSetName;
		if (!newSetName) {
			newSetName = String.fromCharCode(65 + this.getNumberOfSets())
		}
		this.setState({
			newSetName: "",
			setsAdded: this.state.setsAdded + 1,
			addNewSetButtonDisabled: true
		},
			() => {
				this.props.addQuestion({
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
					"value": {}
				});
				this.props.SEQuestionValueChange(currentSamplingEventID, SET_INFORMATION_IDENTIFIER + newSetName, {});
			});
	}

	render() {
		const { currentEvent, classes } = this.props;


		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}

		console.log("DATA ENTRY: disabled", this.state.addNewSetButtonDisabled);
		console.log("DATA ENTRY: setsAdded", this.state.setsAdded);
		console.log("DATA ENTRY: numSets", this.getNumberOfSets());

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
						disabled={this.state.addNewSetButtonDisabled && this.state.setsAdded !== this.getNumberOfSets()}
					>
						Add Set
					</Button>
				</div>
			</Paper>

			<br></br>
			{this.getNumberOfSets()}
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