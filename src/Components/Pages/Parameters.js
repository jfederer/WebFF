import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';

import { setAppBarText } from '../../Actions/UI';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { NOT_SAMPLED } from '../../Constants/Dictionary';
import { METHOD_QIDS, SEDIMENT_TYPES, PARAMETER_TABLE_TYPE } from '../../Constants/Config';
import ParametersTable from '../Questions/ParametersTable';
import { getQuestionValue, getDescriptiveColumnForTable } from '../../Utils/QuestionUtilities';
import { SEQuestionValueChange } from '../../Actions/SamplingEvents';
import TabbedPage from './TabbedPage';


class Parameters extends React.Component {

	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Parameters");
		this.state = { tabValue: 0 };
	}


	handleTabClick = (event, newValue) => {
		this.setState({ tabValue: newValue })
	}

	render() {
		const {
			currentEvent,
			currentEventID
		} = this.props;

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}

		return (<React.Fragment>
			<TabbedPage componentType={PARAMETER_TABLE_TYPE} />
		</React.Fragment >
		);
	}
}


const mapStateToProps = function (state) {
	return {
		currentEventID: state.SedFF.currentSamplingEventID,
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID],
		defaultQuestionsData: state.Questions.questionsData,
	}
}


const mapDispatchToProps = {
	setAppBarText,
	SEQuestionValueChange
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Parameters));