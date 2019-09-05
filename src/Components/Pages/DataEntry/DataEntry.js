import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { styles } from '../../../style';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TabbedPage from '../TabbedPage';

import { setAppBarText } from '../../../Actions/UI';
import DataEntrySheet from '../../Questions/DataEntrySheet';
import { getQuestionValue } from '../../../Utils/QuestionUtilities';
import { NOT_SAMPLED } from '../../../Constants/Dictionary';
import { DATA_ENTRY_SHEET_TYPE, METHOD_QIDS, SEDIMENT_TYPES, DATA_ENTRY_INFORMATION_IDENTIFIER } from '../../../Constants/Config';



class DataEntry extends React.Component {

	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Data Entry");
	}


	handleTabClick = (event, newValue) => {
		this.setState({ tabValue: newValue })
	}

	render() {
		const { currentEvent, currentEventID } = this.props;

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}

		return (<React.Fragment>
			<TabbedPage componentType={DATA_ENTRY_SHEET_TYPE} />
		</React.Fragment >
		);
	}
}



const mapStateToProps = function (state) {
	return {
		currentEventID: state.SedFF.currentSamplingEventID,
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID]
	}
}

const mapDispatchToProps = {
	setAppBarText
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(DataEntry));