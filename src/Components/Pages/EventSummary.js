import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';
import { getEventFromID, getQuestionsData, getQuestionDataFromID } from '../../Utils/StoreUtilities';

import { setAppBarText } from '../../Actions/UI'; //TODO: we don't atually set appbar text
import { DATA_ENTRY_INFORMATION_IDENTIFIER, PCODE_MATCHING_REGEX, 
	QWDATA_TABLE_IDENTIFIER, PARAMETERS_TABLE_IDENTIFIER } from '../../Constants/Config';
import { Typography } from '@material-ui/core';
import { Fragment } from 'react';
import { getQuestionValue } from '../../Utils/QuestionUtilities';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DataEntrySummary from '../Summaries/DataEntrySummary';
import KVPair from '../Summaries/KVPair';
import { DESCRIPTION_HEADER } from '../../Constants/Dictionary';
import SummaryTable from '../Summaries/SummaryTable';


class EventSummary extends React.Component {


	// QIDs_stationBasics = [
	// 	"stationName",
	// 	"stationNumber",
	// 	"projectName",
	// 	"projectID",
	// 	"agencyCode",
	// 	"sampleDate"
	// ]

	// QIDs_AllHandledByHand = this.QIDs_stationBasics;




	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Event Summary");
		const { eventID } = this.props.match.params;
		this.state = {
			event: getEventFromID(eventID),
			questionsData: getQuestionsData(eventID)
		}
	}

	buildRow(arr, tableName, rowNum) {
		return <TableRow key={"Summary_" + tableName + "_TableRow" + rowNum}>
			{arr.map((cell, colNum) => {  //TODO: add if tableData.rowHeaders and give that element some different look (matching TableHead)
				// console.log('cell :', cell);
				return <TableCell key={"Summary_" + tableName + "_TableCell" + rowNum + ":" + colNum}>{JSON.stringify(cell)}</TableCell>  //TODO: cleaner cell options for objects, etc
			})}
		</TableRow>
	}

	buildTable(tableData, tableValue) {
		// TODO: add ColHead, make tabel generation function generic 
		let tableName = tableData.id;

		let headRow = tableData.colHeaders ? this.buildRow(tableValue[0], tableName, 0) : null;

		let bodyRows = tableValue.map((row, rowNum) => {
			if (rowNum === 0 && tableData.colHeaders) {
				return null;
			} else {
				return this.buildRow(row, tableName, rowNum);
			}
		}).filter(el=>el);
	
		return (<Table key={"Summary_" + tableName + "_Table" + tableData.id}>
			<TableHead>{headRow}</TableHead>
			<TableBody>{bodyRows}</TableBody>
		</Table>
		);

	}





	buildQWDATASummary(eventID, QW_QID) {
		// console.log("Here");
		let QWDataQD = getQuestionDataFromID(eventID, QW_QID);
		let QWDataValue = getQuestionValue(eventID, QW_QID);
		// console.log('QWDataQD :', QWDataQD);
		// console.log('QWDataValue :', QWDataValue);
		return <SummaryTable key={"QWDATATableSummary:"+QW_QID} tableData={QWDataQD} tableValue={QWDataValue}/>
		// return this.buildTable(QWDataQD, QWDataValue);
	}

	buildParameterSummary(eventID, P_QID) {
		// console.log("Here");
		let QD = getQuestionDataFromID(eventID, P_QID);
		let value = getQuestionValue(eventID, P_QID);
		// console.log('QWDataQD :', QWDataQD);
		console.log('value :', value);

		// create summaryHeader from existing...
		// let summaryHeader = [DESCRIPTION_HEADER, ...this.getPcodesFromHeader(value[0])];
		let pCodes = this.getPcodesFromHeader(value[0]);
		console.log('pCodes :', pCodes);

		// build summaryValue
		let summaryValue = [];
		summaryValue[0] = [DESCRIPTION_HEADER, ...pCodes];
		for (let rowNum = 1; rowNum < value.length; rowNum++) {
			summaryValue[rowNum]=[];
			summaryValue[rowNum][0]=value[rowNum][0];
			pCodes.forEach((pCode, colNum) => {
				summaryValue[rowNum][colNum+1]=this.getPCodeValue(pCode, value, rowNum);
			})
		}
		console.log('summaryValue :', summaryValue);

		// return this.buildTable(QD, value);
		return <SummaryTable key={"ParamtersTableSummary:"+P_QID} tableData={QD} tableValue={summaryValue}/>
	}

	getPcodesFromHeader(headerArr) {
		let pCodesObj = {};
		headerArr.forEach(header => {
			if (header.match(PCODE_MATCHING_REGEX)) {
				let pCode = header.split('_')[0];
				pCodesObj[pCode] = true;
			}
		})
		return Object.keys(pCodesObj);
	}

	getPCodeValue(pCode, tableValue, rowNum) {
		let retVal = [];
		
		tableValue[rowNum].forEach((cellValue, colNum) => {
			if (tableValue[0][colNum].startsWith(pCode)) {
				retVal.push(cellValue);
			}
		})

		return retVal.join(' ');
	}

	render() {
		const { event, questionsData } = this.state;
		const { eventID } = this.props.match.params;

		if (!event) {
			alert("Event ID, '" + eventID + "', did not match any events.  Redirecting to dashboard..");
			return <Redirect to='/' />
		}
		if (!questionsData) {
			console.error("Event ID, '" + eventID + "', did not match any questionsData.  Redirecting to dashboard..");
			return <Redirect to='/' />
		}


		let FFSummary = {};
		let DESummary = {};
		let QWSummary = {};
		let ParSummary = {};

		Object.keys(event.questionsValues).forEach(QID => {
			let questionData = getQuestionDataFromID(eventID, QID); // TODO: this should involve eventID
			if (!questionData) {
				console.error("No question data found for questionID '" + QID + "' in event summary.");
				return;
			}

			if (QID.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER)) {
				let sedType = QID.split(DATA_ENTRY_INFORMATION_IDENTIFIER)[1];
				// console.log('sedType :', sedType);
				DESummary[sedType] = <DataEntrySummary key={"DataEntrySummary:" + QID}
					eventID={eventID}
					DE_QID={QID}
				/>
			} else if (QID.startsWith(QWDATA_TABLE_IDENTIFIER)) {
				let sedType = QID.split(QWDATA_TABLE_IDENTIFIER)[1];
				QWSummary[sedType] = this.buildQWDATASummary(eventID, QID);
			} else if (QID.startsWith(PARAMETERS_TABLE_IDENTIFIER)) {
				let sedType = QID.split(PARAMETERS_TABLE_IDENTIFIER)[1];
				ParSummary[sedType] = this.buildParameterSummary(eventID, QID);
			} else {
				let labelValuePair = <React.Fragment key={"LabelValuePair_frag" + QID} ><KVPair key={"LabelValuePair_" + QID}
					label={questionData.label}
					value={event.questionsValues[QID]} />
					<br key={"LabelValuePair_br" + QID} />
				</React.Fragment>

				if (!FFSummary[questionData.layoutGroup]) {
					FFSummary[questionData.layoutGroup] = [labelValuePair]
				} else {
					FFSummary[questionData.layoutGroup].push(labelValuePair)
				}
			}
		})
		// .filter(el => typeof el !== 'undefined');

		// ////////////////// FIELD FORM information Summary //////////////////

		// let FFQuestionsData = getTabQuestionsData(questionsData, "FIELDFORM");
		// let layoutGroupNames = getLayoutGroupNames(FFQuestionsData);

		// let FFSummary = layoutGroupNames.map((layoutName, index) => { // yes, this means we run through this more than needed, but this isn't a often-repeated process
		// 	let FFLGQD = getLayoutGroupQuestionsData(FFQuestionsData, layoutName);

		// 	let layoutGroupSummary = Object.values(FFLGQD).map(question => {

		// 			let value = getQuestionValue(eventID, question.id);
		// 			if (value) {
		// 				return <Fragment key={question.id}>
		// 					<b><Typography display="inline" className="summaryLabel">{question.label}</Typography> : </b>
		// 					<Typography display="inline" className="summaryValue">{value}</Typography>
		// 					<br />
		// 				</Fragment>
		// 			}
		// 	}).filter(el => typeof el !== 'undefined');

		// 	if (layoutGroupSummary.length < 1) {
		// 		return;
		// 	}

		// 	return <Fragment key={'SummaryKey' + layoutName}>
		// 		{index !== 0 ? <hr /> : null}
		// 		<Typography className="summaryLayoutHeader">{layoutName}</Typography>
		// 		{layoutGroupSummary}
		// 	</Fragment>
		// });


		// ////////////////// DATA ENTRY information Summary //////////////////

		// let DESummary = Object.keys(SEDIMENT_TYPES).map(sedType => {
		// 	// if we didn't do this sediment type, skip it

		// 	// this is a valid sediment type based on current values on the FF page
		// 	let DEQuestionsData = getTabQuestionsData(questionsData, "DATAENTRY");
		// 	console.log('questionsData :', questionsData);
		// 	console.log('DEQuestionsData :', DEQuestionsData);




		// }).filter(el => typeof el !== 'undefined'); // end sedType loop




		// let QWDATASummary =
		// 	Let ParametersSummary = 

		// console.log("QWSummary: ", QWSummary);
		return (
			<React.Fragment>
				{Object.keys(FFSummary).map((layoutGroupName, index) => {
					return (
						<Fragment key={'SummaryKey' + layoutGroupName}>
							{index !== 0 ? <hr /> : null}
							<Typography variant='h5' className="summaryLayoutHeader">{layoutGroupName}</Typography>
							{FFSummary[layoutGroupName]}
						</Fragment>
					)
				})}
				<hr />
				<hr />
				<hr />
				<hr />
				{Object.keys(DESummary).map((sedType, index) => {
					return (
						<Fragment key={'SummaryKey:DE:' + sedType}>
							{index !== 0 ? <hr /> : null}
							<Typography variant='h5' className="summaryLayoutHeader">Data Entry: {sedType}</Typography>
							{DESummary[sedType]}
						</Fragment>
					)
				})}
				<hr />
				<hr />
				<hr />
				<hr />
				{Object.keys(QWSummary).map((sedType, index) => {
					return (
						<Fragment key={'SummaryKey:QW:' + sedType}>
							{index !== 0 ? <hr /> : null}
							<Typography variant='h5' className="summaryLayoutHeader">QWDATA: {sedType}</Typography>
							{QWSummary[sedType]}
						</Fragment>
					)
				})}
				<hr />
				<hr />
				<hr />
				<hr />
				{Object.keys(ParSummary).map((sedType, index) => {
					return (
						<Fragment key={'SummaryKey:Par:' + sedType}>
							{index !== 0 ? <hr /> : null}
							<Typography variant='h5' className="summaryLayoutHeader">Parameters: {sedType}</Typography>
							{ParSummary[sedType]}
						</Fragment>
					)
				})}

			</React.Fragment>
		);

	}
}

const mapStateToProps = function (state) {
	return {
		// linkTables: state.LinkTables, // to get users event IDs
		// allSamplingEvents: state.SamplingEvents,
		//sedff: state.SedFF, // loading / fetching data
		// currentUser: state.Users[state.SedFF.currentUsername],
		//samplingEvents: state.SamplingEvents,
		// questions: state.Questions,
	}
}


EventSummary.propTypes = {
	classes: PropTypes.object.isRequired
};

const mapDispatchToProps = {
	setAppBarText
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(EventSummary));