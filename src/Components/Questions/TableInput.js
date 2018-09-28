import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { createQuestionComponents } from '../../Utils/QuestionUtilities';
import Question from '../Question';
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


class TableInput extends React.Component {
	constructor(props) {
		super(props);
		
		let numRows = this.props.value.length;
		let numCols = 1; // tables with less than 1 column are not allowed
		this.props.value.forEach(function (row) {
			if (row.length > numCols) {
				numCols = row.length;
			}
		});
		//console.log("table mad: rows: ", numRows, " cols: ", numCols);

		let emptyTable = [];
		for (var i = 0; i < numRows; i++) {
			emptyTable.push(Array(numCols).fill("Def"));
		}

		if (this.props.value != null) {
			this.props.value.map((row, rowNum) => {
				row.map((element, colNum) => {
					emptyTable[rowNum][colNum] = element;
					return null;
				});
				return null;
			});
		}

		this.state = {
			value: emptyTable
		};

		this.handleTableQuestionChange = this.handleTableQuestionChange.bind(this);
	};

	componentWillMount() {
		//		console.log("CWM: ", this.state.value)


	}

	handleTableQuestionChange(textSubQuestion) {
		
		let DEBUG = false;
		if (DEBUG) console.log("handleTableQuestionChange: textSubQuestion: ", textSubQuestion);
		//TODO: textSubQuestion.state.value is correct at this point... it's row and col is correct as well.  use row/col to edit the double-array on this.state.value and then send back to the this.props.stateChangeHandler to write it to LS
		const { id } = textSubQuestion.props;
		// console.log("textSubQuestion", textSubQuestion);
		let questionRow = id.substring(id.indexOf("row:") + 4, id.indexOf("_col:"));
		let questionCol = id.substring(id.indexOf("col:") + 4);
		let questionVal = textSubQuestion.state.value;
		if (DEBUG) console.log("questionVal: ", questionVal);
		if (DEBUG) console.log("questionRow: ", questionRow);
		if (DEBUG) console.log("questionCol: ", questionCol);
		let tempTableValue = this.props.value;
		tempTableValue[questionRow][questionCol] = questionVal;
		//console.log(tempTableValue);
		this.setState({ value: tempTableValue }, () => {this.props.stateChangeHandler(this)});
	}

	buildRow(curRow, row) { //FUTURE:  build even the text questions as sub questions... auto-generating them
		const { classes } = this.props;
		return <TableRow key={this.props.id + "_row_" + row}>
			{curRow.map((cellContent, col) => {
				let DEBUG = false;
				let subQkey = this.props.id + "_row:" + row + "_col:" + col;
				let classlessProps = delete this.props[classes]; // need to delete classes so they don't get passed to children
				let adHocProps = { ...classlessProps, id: subQkey, type: "Text", label: "", value: cellContent }
				// let adHocProps = { id: subQkey, type: "Text", label: "", value: cellContent }
				let cellQuestion = null;

				// check if this is a subQuestion
				if (typeof (cellContent) === "string" && cellContent.startsWith("SubQuestion::")) {
					let subQuestionID = cellContent.substring(cellContent.indexOf("SubQuestion::") + 13);
					if (DEBUG) console.log("Found a subQuestion: ", subQuestionID);
					let questionData = this.props.globalState.questionsData.filter((Q)=>Q.id===subQuestionID)[0];
					if (DEBUG) console.log("questionData", questionData);
					adHocProps = { ...adHocProps, ...questionData, key:subQkey };
					if (DEBUG) console.log("adHocProps", adHocProps);
					cellQuestion = createQuestionComponents([adHocProps], this.props.stateChangeHandler, this.props.globalState, this.props.questionsValues);

					// if this question is in a header location, wrap it in the header div
					if ((col === 0 && this.props.rowHeaders) || (row === 0 && this.props.colHeaders)) {
						cellQuestion = <div className={classes.header}>{cellQuestion}</div>
					}
				} else {  // this is just a text field and rather than make a separate custom sub queston for each, 
					// we'll extract the values as they change and put them into the 2d array of values representing the table
					// TODO: dynamically build questions (id: tableQ_ID+row+col)

					// just text could either be a header (whereby it should NOT become a question)
					// or it needs to be a text question in the table
					if ((col === 0 && this.props.rowHeaders) || (row === 0 && this.props.colHeaders)) {
						cellQuestion = <div className={classes.header}>{cellContent}</div>
					} else {
						cellQuestion = <Question {...adHocProps} size={1} globalState={this.props.globalState} stateChangeHandler={this.handleTableQuestionChange} />
					}
				}
				return (
					<TableCell className={classes.tableCell} key={this.props.id + "_row:" + row + "_col:" + col}>
						{cellQuestion}
					</TableCell>
				)
			})}
		</TableRow>
	}


	render() {
				//FUTURE: Let's build the question as needed rather than re-render every time?  (right now, the entire question gets rebuilt upon a single keypress)
				const { classes } = this.props;

		//let numRows = this.props.value.length;
		// let numCols = 1; // tables with less than 1 column are not allowed
		// this.props.value.forEach(function (row) {
		// 	if (row.length > numCols) {
		// 		numCols = row.length;
		// 	}
		// });

		//console.log("Table Size: ", numRows, " x ", numCols); // correct

		//TODO: read-only columns list

		let tableValues = this.props.value;

		// build the JSX tableRows based on will-mount-calculated tableValues
		let tableRows = [];
		let tableHeaderRow;

		tableValues.forEach((curRow, row) => {
			let thisRow = this.buildRow(curRow, row);
			if (this.props.colHeaders && row === 0) {
				tableHeaderRow = thisRow;
			} else {
				tableRows.push(thisRow);
			}
		});

		let tableHeader = tableHeaderRow ?
			<TableHead key={this.props.id + "_tableHead"}>{tableHeaderRow}</TableHead> :
			null;

		let tableBody = <TableBody>{tableRows}</TableBody>;

		return <Table key={this.props.id + "_table"} className={classes.table}>
			{/* {colGroup} */}
			{tableHeader}
			{tableBody}
		</Table>
	}
}

TableInput.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	stateChangeHandler: PropTypes.func,
	key: PropTypes.string,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	XMLTag: PropTypes.string,
	type: PropTypes.oneOf(["TableInput"]).isRequired,
	selectOptions: PropTypes.arrayOf(PropTypes.object)

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(TableInput);