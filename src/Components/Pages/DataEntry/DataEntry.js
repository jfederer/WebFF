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
import DataEntryPanel from '../../Questions/DataEntryPanel';
import { getQuestionValue } from '../../../Utils/QuestionUtilities';
import { NOT_SAMPLED } from '../../../Constants/Dictionary';
import { METHOD_QIDS } from '../../../Constants/Config';


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

	// DEChangeHandler = (eventID, sub_QID, value) => {
	// 	// if (sub_QID === "numberOfSamplingPoints") {
	// 	// 	this.doChange(eventID, sub_QID, value)
	// 	// 	this.setState({ showDataTable: true });
	// 	// 	this.props.numberOfSamplingPointsChanged(eventID, this.props.setName, this.props.samplingMethod, _.cloneDeep(value), this.setInfoChangeHandler);
	// 	// 	return;
	// 	// }

	// 	console.log("DEChangeHandler(", eventID, ",", sub_QID, ",", value, ")");
	// 	// this.doChange(eventID, sub_QID, value);
	// 	this.props.SEQuestionValueChange(eventID, this.props.id, value);
	// };

	// /**
	//  * @description doChange exists as separate function so the 'save' and the 'special questions' can be handled more easily. If the 'save' is done in the wrong order, some of the additional changes might not propagate appropriately. DRY
	//  */
	// doChange = (eventID, sub_QID, value) => {
	// 	const DE_INFORMATION_IDENTIFIER = "DataEntry::"
	// 	let newValue = getQuestionValue(eventID, SET_INFORMATION_IDENTIFIER + this.props.setName);
	// 	newValue[sub_QID] = _.cloneDeep(value);

	// 	if (this.props.alternateChangeHandler) {
	// 		this.props.alternateChangeHandler(this.props.currentEventID, this.props.id, newValue);
	// 	} else {

	// 		this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, newValue);
	// 	}
	// };


	render() {
		const { currentEvent } = this.props;

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}


		let tabsList = {};
		let tabsPanelList = {};
		let singleDataEntryPage = null;

		Object.keys(METHOD_QIDS).forEach((methodQID, index) => {
			if (getQuestionValue(this.props.currentEventID, methodQID) !== NOT_SAMPLED) {
				if (!singleDataEntryPage) {
					singleDataEntryPage = <React.Fragment><QuestionPage tabName={"Data Entry " + METHOD_QIDS[methodQID]} /><AddSetForm type={METHOD_QIDS[methodQID]} /></React.Fragment>
				}
				tabsList[methodQID] = <Tab key={methodQID} label={METHOD_QIDS[methodQID]} />;
				tabsPanelList[methodQID] =
					<TabPanel value={this.state.tabValue} key={methodQID} index={Object.keys(tabsPanelList).length}>
						<DataEntryPanel samplingMethod={METHOD_QIDS[methodQID]} sedimentType={methodQID.split('_')[1]} />
					</TabPanel>
			}
		})

		if (Object.keys(tabsList).length === 0) {
			alert("At least one sampling method must be selected before data entry can continue. Redirecting to Field Form.");
			return <Redirect to='/FieldForm' />
		}

		return (<React.Fragment>


			{Object.keys(tabsList).length === 1
				? singleDataEntryPage
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
	// SEQuestionValueChange
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(DataEntry));