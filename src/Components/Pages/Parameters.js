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
import { METHOD_QIDS, SEDIMENT_TYPES, DATA_ENTRY_INFORMATION_IDENTIFIER } from '../../Constants/Config';
import ParametersTable from '../Questions/ParametersTable';
import { getQuestionValue, getDescriptiveColumnForTable } from '../../Utils/QuestionUtilities';
import { SEQuestionValueChange } from '../../Actions/SamplingEvents';


function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			<Box p={3}>{children}</Box>
		</Typography>
	);
}

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


		let tabsList = {};
		let tabsPanelList = {};
		let singleParameterPanel = null;
		let table_QID = "parametersTable";

		Object.entries(METHOD_QIDS).forEach(([sedType, methodQID], index) => {

			if (getQuestionValue(currentEventID, methodQID) !== NOT_SAMPLED) {

				let PT = <ParametersTable
					stateChangeHandler={(val) => this.props.SEQuestionValueChange(currentEventID, table_QID, val)} //TODO: NEXT:  This isn't called with appropraite information
					value={getQuestionValue(currentEventID, table_QID)}
					key={table_QID}
					id={table_QID}
					label="parametersTable LABEL"
					placeholder="parametersTable PLACEHOLDER"
					XMLTag="parametersTable XMLTAG"
					type="ParametersTable"
					samplingMethod={getQuestionValue(currentEventID, methodQID)}
					sedimentType={sedType}
					getDescriptiveColumnForTable={() => getDescriptiveColumnForTable(currentEventID, sedType)}
					eventID={this.props.currentEventID}
				/>


				// <DataEntrySheet
				// 	id={DATA_ENTRY_INFORMATION_IDENTIFIER + methodQID.split('_')[1]}
				// 	samplingMethod={getQuestionValue(currentEventID, methodQID)}
				// 	sedimentType={sedType}
				// 	value={getQuestionValue(currentEventID, DATA_ENTRY_INFORMATION_IDENTIFIER + methodQID.split('_')[1])} />

				if (!singleParameterPanel) {
					singleParameterPanel = PT;
				}

				tabsList[sedType] = <Tab key={"Parameter" + sedType} label={SEDIMENT_TYPES[sedType]} />;
				tabsPanelList[sedType] =
					<TabPanel value={this.state.tabValue} key={"Paramter" + sedType} index={Object.keys(tabsPanelList).length}>
						{PT}
					</TabPanel>
			}
		})

		if (Object.keys(tabsList).length === 0) {
			alert("At least one sampling method must be selected before parameter entry can continue. Redirecting to Field Form.");
			return <Redirect to='/FieldForm' />
		}

		return (<React.Fragment>
			{Object.keys(tabsList).length === 1
				? singleParameterPanel
				: <React.Fragment>
					<AppBar position="static" color="default">
						<Tabs
							value={this.state.tabValue}
							onChange={this.handleTabClick}
							indicatorColor="primary"
							textColor="primary"
							variant="scrollable"
							scrollButtons="auto"
							aria-label="scrollable auto tabs example"
						>
							{Object.keys(tabsList).map(tab => tabsList[tab])}
						</Tabs>
					</AppBar>

					{Object.keys(tabsPanelList).map(tabPanel => tabsPanelList[tabPanel])}

				</React.Fragment>
			}
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