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
			value: this.props.value
		};
		this.handleTableChange = this.handleTableChange.bind(this);
	};

	componentWillMount() {
		this.setState({ value: this.props.value });

		let tableWidth = this.props.colHeaders.length; 	//TODO: might want to put row and column size info in state for adding later...


		//console.log(this.props);


		// make appropriately-sized empty table data array based on 'rows' value if it exists
		let emptyTable = [];
		let numberOfRowsToEnsure = 1;  //TODO: maybe set to zero and add better error handling
		if(this.props.minimumNumberOfRows) {
			numberOfRowsToEnsure = this.props.minimumNumberOfRows;
		}
		if (numberOfRowsToEnsure < this.state.value.length) {
			numberOfRowsToEnsure = this.state.value.length;
		}
		//console.log("Going to generate " + numberOfRowsToEnsure + " rows");

		for (var i = 0; i < numberOfRowsToEnsure; i++) {
			let numbRows = parseInt(tableWidth, 10);
			emptyTable.push(Array(numbRows).fill(""));
		}

		// go through value in state and drop them into emptyTable.
		// this extra step is to deal with mis-matches between intial 'value' settings and the table size
		// additional error-checking worthwhile for when value is (not an array, too big, etc)
		if (this.state.value != null) {
			this.state.value.map((row, rowNum) => {
				row.map((element, colNum) => {
					emptyTable[rowNum][colNum] = element;
					return null;
				});
				return null;
			});
		}
		this.setState({value:emptyTable}); // empty table is no longer empty


		// if(this.props.samplingDistanceColumn!=null && this.props.samplingDistanceValues!=null) {  //TODO: bridgeWizard as separate table type?
		// 	console.log("Going to add it in");
		// 	//add the samplingDistanceValues array to the start of every row in this.state.values
		// 	let newValues = tableValues;
		// 	for(let i = 0; i<this.props.samplingDistanceValues.length; i++) {
		// 		if(!newValues[i]) { // if need to make a new row
		// 			let newRow = new Array(tableWidth).fill("");
		// 			newValues.push(newRow);
		// 		}
		// 		newValues[i].unshift(this.props.samplingDistanceValues[i]);
		// 	}
		// }

	}

	// handleTableChange = name => event => {
	// 	console.log("HandleTableChange");
	// 	console.log("name: ", name);
	// 	console.log("event: ", event);
	// };

	handleTableChange(textSubQuestion) {
		let DEBUG = false;
		if(DEBUG)console.log("HandleTableChange: textSubQuestion: ", textSubQuestion);
		//TODO: textSubQuestion.state.value is correct at this point... it's row and col is correct as well.  use row/col to edit the double-array on this.state.value and then send back to the this.props.stateChangeHandler to write it to LS
		const { id } = textSubQuestion.props;
		console.log(textSubQuestion);
		let questionRow = id.substring(id.indexOf("row:")+4,id.indexOf("col:"));
		let questionCol = id.substring(id.indexOf("col:")+4);
		let questionVal = textSubQuestion.state.value;
		if(DEBUG)console.log("questionVal: ", questionVal);
		if(DEBUG)console.log("questionRow: ", questionRow);
		if(DEBUG)console.log("questionCol: ", questionCol);
		let tempTableValue = this.state.value;
		tempTableValue[questionRow][questionCol]=questionVal;

		this.setState({value:tempTableValue}, ()=>this.props.stateChangeHandler(this));
	}

	buildQuestion() {
		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLValue;

		const { classes } = this.props;

		let tableWidth = this.props.colHeaders.length; 	//TODO: might want to put row and column size info in state for adding later...


		//console.log(this.props);
		//TODO: read-only columns list

		let tableValues = this.state.value;

		// build the JSX tableRows based on above-calculated tableValues
		let tableRows = [];

		tableValues.map((curRow, row) => {
			tableRows.push(
				<TableRow key={this.props.id + "_row_" + row}>
					{curRow.map((cellContent, col) => {
						//console.log("cellContent: ", cellContent);
						
						let DEBUG = false;
						let subQkey = this.props.id + "_row:" + row + "col:" + col;
						let classlessProps = delete this.props[classes]; // need to delete classes so they don't get passed to children
						let adHocProps = { ...classlessProps, id: subQkey, type: "Text", label: "", value: cellContent }
						let cellQuestion = null;

						if (typeof(cellContent)==="string" && cellContent.startsWith("SubQuestion::")) {
							
							let subQuestionID = cellContent.substring(cellContent.indexOf("SubQuestion::") + 13);
							if(DEBUG)console.log("Found a subQuestion: ", subQuestionID);
							let questionData = getQuestionDataFromQuestionsDataByQuestionID(this.props.globalState.questionsData, subQuestionID);
							if(DEBUG)console.log("questionData", questionData);
							adHocProps = { ...adHocProps, ...questionData };
							if(DEBUG)console.log("adHocProps", adHocProps);
							cellQuestion = <Question {...adHocProps} stateChangeHandler={this.props.stateChangeHandler} globalState={this.props.globalState} />;
						} else {  // this is just a text field and rather than make a separate custom sub queston for each, we'll extract the values as they change and put them into the 2d array of values representing the table
							if (col === 0 && this.props.rowHeaders) {
								cellQuestion = <div className={classes.header}>{cellContent}</div>
							} else {
								cellQuestion = <Question {...adHocProps} stateChangeHandler={this.handleTableChange} />
							}
						}


						//FUTURE:  build even the text questions as sub questions... auto-generating them


						return (
							<TableCell className={classes.tableCell} key={this.props.id + "_row:" + row + "_col:" + col}>
								{cellQuestion}								
							</TableCell>
						)
					})}
				</TableRow>
			);
			return null;
		});

		// if column widths are not specified, split the table evenly
		let colGroup = <colgroup>
			{
				this.props.colWidths ?
					this.props.colWidths.map((colWidth, i) => <col key={"colWidth_" + i} width={colWidth} />) :
					this.props.colHeaders.map((colWidth, i) => <col key={"colWidth_" + i} width={100 / tableWidth} />)
			}
		</colgroup>;

		//FUTURE: Let's build the question as needed rather than re-render every time?  (right now, the entire question gets rebuilt upon a single keypress)
		// The problem with the first attempt at that was that the drop down did not display the selection after selecting


		return <Table key={this.props.id + "_table"} className={classes.table}>
		{colGroup}
		<TableHead>
			<TableRow>
				{this.props.colHeaders.map((header) => <TableCell className={classes.tableCell} key={this.props.id + header}><div className={classes.header}>{header}</div></TableCell>)}
			</TableRow>
		</TableHead>
		<TableBody>
			{tableRows}
		</TableBody>
	</Table>
	

	}


	render() {
		return this.buildQuestion()
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
	XMLValue: PropTypes.string,
	type: PropTypes.oneOf(["TableInput"]).isRequired,
	selectOptions: PropTypes.arrayOf(PropTypes.object)

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(TableInput);