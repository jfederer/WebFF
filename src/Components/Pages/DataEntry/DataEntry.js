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
import DataEntrySheet from '../../Questions/DataEntrySheet';
import { getQuestionValue } from '../../../Utils/QuestionUtilities';
import { NOT_SAMPLED } from '../../../Constants/Dictionary';
import { METHOD_QIDS, SEDIMENT_TYPES, DATA_ENTRY_INFORMATION_IDENTIFIER } from '../../../Constants/Config';


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
		const { currentEvent, currentEventID } = this.props;

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}

		let tabsList = {};
		let tabsPanelList = {};
		let singleDataEntryPanel = null;

		Object.entries(METHOD_QIDS).forEach(([sedType, methodQID], index) => {

			if (getQuestionValue(currentEventID, methodQID) !== NOT_SAMPLED) {

				let DES = <DataEntrySheet
					id={DATA_ENTRY_INFORMATION_IDENTIFIER + methodQID.split('_')[1]}
					samplingMethod={getQuestionValue(currentEventID, methodQID)}
					sedimentType={sedType}
					value={getQuestionValue(currentEventID, DATA_ENTRY_INFORMATION_IDENTIFIER + methodQID.split('_')[1])} />

				if (!singleDataEntryPanel) {
					singleDataEntryPanel = DES;
				}

				tabsList[sedType] = <Tab key={DATA_ENTRY_INFORMATION_IDENTIFIER + sedType} label={SEDIMENT_TYPES[sedType]} />;
				tabsPanelList[sedType] =
					<TabPanel value={this.state.tabValue} key={DATA_ENTRY_INFORMATION_IDENTIFIER + sedType} index={Object.keys(tabsPanelList).length}>
						{DES}
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

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(DataEntry));