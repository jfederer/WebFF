import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import { createQuestionComponents } from '../../Utils/QuestionUtilities';
import Question from '../Question';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { allQWDATAOptionalHeaders, allAddOnOpts_bedload, allAddOnOpts_bottom, allAddOnOpts_suspended } from '../../Utils/QuestionOptions';
import { safeCopy } from '../../Utils/Utilities';
//this.state.value always contains the up-to-date question values/answers.
//values with 'subQuestion' will need to be traced through LS to the sub question value


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


var preRequisiteInfo = {
	descriptiveColumn: null


}


class SetInformation extends React.Component {
	constructor(props) {
		super(props);
		// let nowValue = [];
		// // let startingPCodes = [];
		// if (this.props.value === null || (this.props.value.length === 1 && this.props.value[0].length === 0)) {// if no value was sent
		// 	console.log("Handed null value, building blank QWDATA Table");

		// 	// build header from scratch
		// 	let headerRow = [];
		// 	Object.keys(allQWDATAOptionalHeaders).forEach((header) => {
		// 		headerRow.push(header);
		// 	});
		// 	nowValue.push(headerRow);

		// 	// build default values (blanks)
		// 	preRequisiteInfo.descriptiveColumn = this.props.getDescriptiveColumnForTable(); // this gives us number of rows too

		// 	//console.log("QWDATA descriptiveColumn: ", preRequisiteInfo.descriptiveColumn);
		// 	for (let i = 1; i < preRequisiteInfo.descriptiveColumn.length; i++) {
		// 		let emptyRow = new Array(headerRow.length - 1).fill("");
		// 		emptyRow.unshift(preRequisiteInfo.descriptiveColumn[i]);
		// 		nowValue.push(emptyRow);
		// 	}

		// 	console.log(nowValue);

		// 	// make the Add-on analysis values arrays
		// 	let AddOnAnalysesIndex = nowValue[0].indexOf("Add-on Analyses");
		// 	if (AddOnAnalysesIndex < 0) { throw new Error("Add-on Analyses not found in header of QWDATA table") }
		// 	for (let row = 1; row < nowValue.length; row++) { // skip header row
		// 		if (!Array.isArray(nowValue[row][AddOnAnalysesIndex])) {
		// 			nowValue[row][AddOnAnalysesIndex] = [];
		// 		}
		// 	}

		// 	// fill out the estimated time, if possible
		// 	this.insertEstimatedTime(nowValue);

		// }
		// else { // if a value was sent
		// 	// need to ensure the value has the right number of rows
		// 	console.log("Handed existing value: ", this.props.value);

		// 	nowValue = [];
		// 	// build new header row, note, the header row should still be correct.
		// 	nowValue.push(safeCopy(this.props.value[0])); // 

		// 	// build rows based on existing values
		// 	preRequisiteInfo.descriptiveColumn = this.props.getDescriptiveColumnForTable(); // preRequisiteInfo.descriptiveColumn will now be the authoritative new [0] element in each row
		// 	// console.log("NEW FIRST COLUMN: ", preRequisiteInfo.descriptiveColumn);
		// 	for (let newRowNum = 1; newRowNum < preRequisiteInfo.descriptiveColumn.length; newRowNum++) { // start at 1 to skip the header row
		// 		// console.log("Looking for...", preRequisiteInfo.descriptiveColumn[newRowNum]);
		// 		//look in props.value for existing matching row
		// 		let matchingOldRow = -1;
		// 		for (let oldRow = 1; oldRow < this.props.value.length; oldRow++) {
		// 			// console.log("against..." + this.props.value[oldRow][0]);
		// 			if (preRequisiteInfo.descriptiveColumn[newRowNum] === this.props.value[oldRow][0]) {
		// 				// console.log("MATCH!");

		// 				matchingOldRow = oldRow;
		// 				break;
		// 			}
		// 		}

		// 		let newRow = [];
		// 		if (matchingOldRow != -1) {
		// 			newRow = safeCopy(this.props.value[matchingOldRow]);
		// 		} else {
		// 			newRow = new Array(this.props.value[0].length - 1).fill("");
		// 			newRow.unshift(preRequisiteInfo.descriptiveColumn[newRowNum]);
		// 		}

		// 		// ensure add-on analysis is an array
		// 		console.log(newRow);
				
		// 		let AddOnAnalysesIndex = nowValue[0].indexOf("Add-on Analyses");
		// 		if (AddOnAnalysesIndex < 0) { throw new Error("Add-on Analyses not found in header of QWDATA table") }
		// 		if (!Array.isArray(newRow[AddOnAnalysesIndex])) {
		// 			newRow[AddOnAnalysesIndex] = [];
		// 		}

		// 		nowValue.push(newRow);
		// 	}
		}



	render() {
		// if (!this.props.globalState.curSamplingEventName) {
		// 	return <React.Fragment></React.Fragment>;  //no event name event loaded, just return
		// }

		// const { classes } = this.props;
		// console.log("QWDATA Render props: ", this.props);

		// console.log("QWDATA Render state: ", this.state);
		// let classlessProps = this.props;
		// delete classlessProps[classes];

		// let evtName = this.props.globalState.curSamplingEventName;

		return <Question 							label="SET INFORMATION"
													type="Text"
													id="setinfo"
													key="setinfo"
													value={this.props.value}
												/>
											
	}
}


export default withStyles(styles)(SetInformation);


