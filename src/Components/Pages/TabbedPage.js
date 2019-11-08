import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import Fragment from 'react';

import { setAppBarText } from '../../Actions/UI';
import { getQuestionValue } from '../../Utils/QuestionUtilities';
import {
	NOT_SAMPLED,
} from '../../Constants/Dictionary';
import { METHOD_QIDS, SEDIMENT_TYPES, DATA_ENTRY_INFORMATION_IDENTIFIER, DATA_ENTRY_SHEET_TYPE, PARAMETER_TABLE_TYPE, QWDATA_TABLE_TYPE, QWDATA_TABLE_IDENTIFIER, PARAMETERS_TABLE_IDENTIFIER } from '../../Constants/Config';
import DataEntrySheet from '../Questions/DataEntrySheet';
import ParametersTable from '../Questions/ParametersTable';
import QWDATATable from '../Questions/QWDATATable';
import QuestionPage from './../QuestionPage';


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

function ComponentCreator(componentType, passedProps) {
	console.log('passedProps :', passedProps);
	switch (componentType) {
		case DATA_ENTRY_SHEET_TYPE: return <React.Fragment><QuestionPage tabName="DataEntry" /><DataEntrySheet {...passedProps} /></React.Fragment>
		case PARAMETER_TABLE_TYPE: return <React.Fragment><ParametersTable {...passedProps} /><QuestionPage tabName="Parameters" /></React.Fragment>
		case QWDATA_TABLE_TYPE: return 	<React.Fragment>
											<QuestionPage tabName="QWDATA" />
											<QWDATATable {...passedProps} />
										</React.Fragment>
		default: return null
	}
}

function ComponentQID(componentType, sedType) {
	switch (componentType) {
		case DATA_ENTRY_SHEET_TYPE: return DATA_ENTRY_INFORMATION_IDENTIFIER + sedType;
		case QWDATA_TABLE_TYPE: return QWDATA_TABLE_IDENTIFIER + sedType;
		case PARAMETER_TABLE_TYPE: return PARAMETERS_TABLE_IDENTIFIER + sedType;
		default: return null
	}
}


class TabbedPage extends React.Component {

	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Data Entry");
		this.state = { tabValue: 0 };
	}


	handleTabClick = (event, newValue) => {
		this.setState({ tabValue: newValue })
	}

	render() {
		const { currentEvent, currentEventID, componentType } = this.props;

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}

		let tabsList = {};
		let tabsPanelList = {};
		let singleDataEntryPanel = null;

		Object.entries(METHOD_QIDS).forEach(([sedType, methodQID], index) => {

			if (getQuestionValue(currentEventID, methodQID) !== NOT_SAMPLED) {

				let passedProps = {};


				passedProps.stateChangeHandler = (val) => this.props.SEQuestionValueChange(currentEventID, ComponentQID(componentType, sedType), val) //TODO: NEXT:  This isn't called with appropraite information
				passedProps.id = ComponentQID(componentType, sedType);
				passedProps.key = ComponentQID(componentType, sedType);
				passedProps.samplingMethod = getQuestionValue(currentEventID, methodQID);
				passedProps.sedimentType = sedType;
				passedProps.value = getQuestionValue(currentEventID, ComponentQID(componentType, sedType));

				let tabContent = ComponentCreator(componentType, passedProps);


				if (!singleDataEntryPanel) {
					singleDataEntryPanel = tabContent;
				}

				tabsList[sedType] = <Tab key={DATA_ENTRY_INFORMATION_IDENTIFIER + sedType} label={SEDIMENT_TYPES[sedType]} />;
				tabsPanelList[sedType] =
					<TabPanel value={this.state.tabValue} key={DATA_ENTRY_INFORMATION_IDENTIFIER + sedType} index={Object.keys(tabsPanelList).length}>
						{tabContent}
					</TabPanel>
			}
		})

		if (Object.keys(tabsList).length === 0) {
			alert("At least one sampling method must be selected before data entry can continue. Redirecting to Field Form.");
			return <Redirect to='/FieldForm' />
		}

		return (<React.Fragment>
			{Object.keys(tabsList).length === 1
				? singleDataEntryPanel
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
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID]
	}
}

const mapDispatchToProps = {
	setAppBarText
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(TabbedPage));