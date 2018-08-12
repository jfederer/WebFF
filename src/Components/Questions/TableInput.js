import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { getQuestionDataFromQuestionsDataByQuestionID } from '../../Utils/QuestionUtilities';
import Question from '../Question';
//this.state.value always contains the up-to-date question values/answers.
//values with 'subQuestion' will need to be traced through LS to the sub question value


const styles = theme => ({
	tableCell: {
		padding: 5,
		flexShrink: 0,
	},
	table: {
		width: 10,
		//	backgroundColor: "#911"
	}
});


class TableInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.defaultValue
		};
	};

	componentWillMount() {
//		console.log("CWM: ", this.state.value)

		// make appropriately-sized empty table data array based on 'rows' and 'cols' value if it exists
		let emptyTable = [];
		for (var i = 0; i < this.props.rows; i++) {
			let numCols = parseInt(this.props.cols, 10);
			emptyTable.push(Array(numCols).fill(""));
		}
//		console.log("emptyTable (empty): ", emptyTable);    // CORRECT OUTPUT

		// go through value in state and drop them into emptyTable.
		if (this.state.value != null) {
			this.state.value.map((row, rowNum) => {
				row.map((element, colNum) => {
					emptyTable[rowNum][colNum] = element;
					return null;
				});
				return null;
			});
		}
		// at this point in execution, empty table is no longer empty
//		console.log("emptyTable (filled): ", emptyTable);    // CORRECT OUTPUT


		// this.setState({ value: emptyTable }, () =>
		// 	console.log("AFTER CWM setState: ", this.state.value));  // SAME OUTPUT AS THE INITIAL CONSOLE.LOG IN COMPONENETWILLMOUNT - INCORRECT!
		this.setState({ value: emptyTable });

	}

	handleTableChange(textSubQuestion) {
		let DEBUG = false;
		if (DEBUG) console.log("HandleTableChange: textSubQuestion: ", textSubQuestion);
		//TODO: textSubQuestion.state.value is correct at this point... it's row and col is correct as well.  use row/col to edit the double-array on this.state.value and then send back to the this.props.stateChangeHandler to write it to LS
		const { id } = textSubQuestion.props;
		console.log(textSubQuestion);
		let questionRow = id.substring(id.indexOf("row:") + 4, id.indexOf("col:"));
		let questionCol = id.substring(id.indexOf("col:") + 4);
		let questionVal = textSubQuestion.state.value;
		if (DEBUG) console.log("questionVal: ", questionVal);
		if (DEBUG) console.log("questionRow: ", questionRow);
		if (DEBUG) console.log("questionCol: ", questionCol);
		let tempTableValue = this.state.value;
		tempTableValue[questionRow][questionCol] = questionVal;

		this.setState({ value: tempTableValue }, () => this.props.stateChangeHandler(this));
	}

	buildRow(curRow, row) { //FUTURE:  build even the text questions as sub questions... auto-generating them
		const { classes } = this.props;
		return <TableRow key={this.props.id + "_row_" + row}>
			{curRow.map((cellContent, col) => {
				let DEBUG = false;
				let subQkey = this.props.id + "_row:" + row + "col:" + col;
				//let classlessProps = delete this.props[classes]; // need to delete classes so they don't get passed to children
				//let adHocProps = { ...classlessProps, id: subQkey, type: "Text", label: "", value: cellContent }
				let adHocProps = { id: subQkey, type: "Text", label: "", value: cellContent }
				let cellQuestion = null;

				// check if this is a subQuestion
				if (typeof (cellContent) === "string" && cellContent.startsWith("SubQuestion::")) {
					let subQuestionID = cellContent.substring(cellContent.indexOf("SubQuestion::") + 13);
					if (DEBUG) console.log("Found a subQuestion: ", subQuestionID);
					let questionData = getQuestionDataFromQuestionsDataByQuestionID(this.props.globalState.questionsData, subQuestionID);
					if (DEBUG) console.log("questionData", questionData);
					adHocProps = { ...adHocProps, ...questionData };
					if (DEBUG) console.log("adHocProps", adHocProps);
					cellQuestion = <Question {...adHocProps} stateChangeHandler={this.props.stateChangeHandler} globalState={this.props.globalState} />;

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
						cellQuestion = <Question {...adHocProps} stateChangeHandler={this.handleTableChange} />
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
		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;

		//FUTURE: Let's build the question as needed rather than re-render every time?  (right now, the entire question gets rebuilt upon a single keypress)
		// The problem with the first attempt at that was that the drop down did not display the selection after selecting

		const { classes } = this.props;

		//TODO: read-only columns list

		let tableValues = this.state.value;

		// build the JSX tableRows based on will-mount-calculated tableValues
		let tableRows = [];
		let tableHeaderRow;

		tableValues.map((curRow, row) => {
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