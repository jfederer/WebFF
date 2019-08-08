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


import { setAppBarText } from '../../../Actions/UI';
import QuestionPage from '../../QuestionPage';
import AddSetForm from './AddSetForm';
import DataEntrySheet from '../../Questions/DataEntrySheet'; 
import { getQuestionValue } from '../../../Utils/QuestionUtilities';
import { NOT_SAMPLED } from '../../../Constants/Dictionary';
import { METHOD_QIDS, DATA_ENTRY_INFORMATION_IDENTIFIER } from '../../../Constants/Config';
// import {  } from '../../Constants/Config';


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


class DataEntry extends React.Component {

	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Data Entry");
		this.state = { tabValue: 0 };
	}


	handleTabClick = (event, newValue) => {
		this.setState({ tabValue: newValue })
	}

	render() {
		const { currentEvent } = this.props;

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}


		let tabsList = {};
		let tabsPanelList = {};
		let singleDataEntryPanel = null;

		Object.keys(METHOD_QIDS).forEach((methodQID, index) => {
			if (getQuestionValue(this.props.currentEventID, methodQID) !== NOT_SAMPLED) {
				if (!singleDataEntryPanel) {
					singleDataEntryPanel = <DataEntrySheet samplingMethod={METHOD_QIDS[methodQID]} id={DATA_ENTRY_INFORMATION_IDENTIFIER+methodQID.split('_')[1]} sedimentType={methodQID.split('_')[1]} />
				}
				tabsList[methodQID] = <Tab key={methodQID} label={METHOD_QIDS[methodQID]} />;
				tabsPanelList[methodQID] =
					<TabPanel value={this.state.tabValue} key={methodQID} index={Object.keys(tabsPanelList).length}>
						<DataEntrySheet id={DATA_ENTRY_INFORMATION_IDENTIFIER+methodQID.split('_')[1]} samplingMethod={METHOD_QIDS[methodQID]} sedimentType={methodQID.split('_')[1]} />
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
				: <React.Fragment><AppBar position="static" color="default">
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

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(DataEntry));