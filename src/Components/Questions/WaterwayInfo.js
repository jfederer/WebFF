import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { SEQuestionValueChange } from '../../Actions/SamplingEvents';
import { createQuestionComponents } from '../../Utils/QuestionUtilities';
import _ from 'lodash';
import { defaultWaterwayInfoQuestionsData } from '../../Constants/DefaultObjects';
import { getGridedQuestions } from '../../Utils/QuestionUtilities';
import { Button } from '@material-ui/core';

const styles = theme => ({
	table: {
		width: "100%",
		//	backgroundColor: "#911"
	},
	tableCell: {
		padding: 5,
		flexShrink: 0,
	},

});

const defaultPierQuestion = {
	"id": "pier_X_start",
	"label": "PIER START",
	"type": "Text",
	"placeholder": "Feet from XYZ",
	"value": "",
	"tabName": "FieldForm",
	"layoutGroup": "Waterway Info",
	"width_xs": 5,
	"width_lg": 2
}

const defaultPierObject = {
	"start": "",
	"end": "",
	"number": ""
}



class WaterwayInfo extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			basicQuestions: Object.keys(defaultWaterwayInfoQuestionsData).map(key => defaultWaterwayInfoQuestionsData[key]),
			...this.props.value
		}
	}

	WWIChangeHandler = (eventID, QID, value) => {
		if (QID.startsWith("pier_")) {
			//create updated piers objects
			let pierNumber = QID.split("_")[1];
			let startEnd = QID.split("_")[2]
			let newPiers = _.cloneDeep(this.state.piers);
			newPiers[pierNumber - 1][startEnd] = value;
			this.setState({ piers: newPiers }, () => this.doChange(eventID))
		} else {
			this.setState({ [QID]: value }, () => this.doChange(eventID));
		}
	};

	doChange = (eventID) => {
		let newWWValue = _.cloneDeep(this.state);
		delete newWWValue.basicQuestions;
		this.props.SEQuestionValueChange(eventID, this.props.id, newWWValue);
	}

	addPierClickedHandler = () => {

		if (!this.state.piers) {
			console.warn("state does not contain piers property in waterway info")
			return;
		}

		let newPiers = _.cloneDeep(this.state.piers);
		let newPier = _.cloneDeep(defaultPierObject);
		newPier.number = this.state.piers.length + 1;
		newPiers.push(newPier);
		this.setState({ piers: newPiers });
	}

	removePierClickedHandler = (pierNumberToRemove) => {
		let newPiers = _.cloneDeep(this.state.piers).filter(pier => pier.number !== pierNumberToRemove);

		this.setState({ piers: newPiers }, () => this.doChange(this.props.currentSamplingEventID));
	}

	render() {
		if (!this.state.piers) {
			console.warn("Waterway Info State does not contain 'piers' property")
			return;
		}

		let pierQuestions = [];


		this.state.piers.forEach(pierData => {
			let pierStartQuestion = _.cloneDeep(defaultPierQuestion);
			pierStartQuestion.id = "pier_" + pierData.number + "_start";
			pierStartQuestion.label = "Pier " + pierData.number + " start";
			pierStartQuestion.value = pierData.start ? pierData.start : "";
			pierQuestions.push(pierStartQuestion);

			let pierEndQuestion = _.cloneDeep(defaultPierQuestion);
			pierEndQuestion.id = "pier_" + pierData.number + "_end";
			pierEndQuestion.label = "Pier " + pierData.number + " end";
			pierEndQuestion.value = pierData.end ? pierData.end : "";
			pierQuestions.push(pierEndQuestion);
		})

		let pierValues = {};
		pierQuestions.forEach(pierQuestion => {
			pierValues[pierQuestion.id] = pierQuestion.value;
		})

		return <React.Fragment>
			{getGridedQuestions(createQuestionComponents(this.state.basicQuestions,
				this.props.value,
				this.WWIChangeHandler))}

			{/* TODO: build pier question type and have better/combined look */}

			{createQuestionComponents(pierQuestions, pierValues, this.WWIChangeHandler)}

			<Button onClick={this.addPierClickedHandler}>ADD PIER</Button>
			{this.state.piers.length
				? <Button onClick={() => this.removePierClickedHandler(this.state.piers.length)}>Remove pier</Button>
				: null}
		</React.Fragment>

	}
}


const mapStateToProps = function (state) {
	return {
		currentSamplingEventID: state.SedFF.currentSamplingEventID,
		currentEvent: state.SedFF[state.SedFF.currentSamplingEventID]
	}
}

const mapDispatchToProps = {
	SEQuestionValueChange
}

WaterwayInfo.propTypes = {
	value: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(WaterwayInfo));


