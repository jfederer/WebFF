import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { getQuestionData } from '../../Utils/QuestionUtilities';
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
		backgroundColor: "#911"
	}
});

class InputTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value
		};
		this.handleTableChange = this.handleTableChange.bind(this);
	};

	componentWillMount() {
		this.setState({ value: this.props.value });
	}

	handleTableChange = name => event => {
		console.log("Here");
		console.log(name);
		console.log(event);
	};

	buildQuestion() {
		const DEBUG = false;
		const { classes } = this.props;
		var theQ = {};

		if (DEBUG) console.log("Table Question");

		//TODO: might want to put row and column size info in state for adding later...

		// make appropriately-sized empty table data array
		let tableValues = [];
		for (var i = 0; i < this.props.numberOfRows; i++) {
			let numbRows = parseInt(this.props.colHeaders.length, 10);
			tableValues.push(Array(numbRows).fill(""));
		}

		// go through value in state and drop them into tableValues.
		// this extra step is to deal with mis-matches between intial 'value' settings and the table size
		// additional error-checking worthwhile for when value is (not an array, too big, etc)
		if (this.state.value != null) {
			this.state.value.map((row, rowNum) => {
				row.map((element, colNum) => {
					tableValues[rowNum][colNum] = element;
					return null;
				});
				return null;
			});
		}

		// build the JSX tableRows based on above-calculated tableValues
		let tableRows = [];

		tableValues.map((curRow, row) => {
			tableRows.push(
				<TableRow key={this.props.id + "_row_" + row}>
					{curRow.map((cellContent, col) => {
						//console.log(cellContent);

						let subQkey = this.props.id + "_row:" + row + "_col:" + col;
						let classlessProps = delete this.props[classes];
						let adHocProps = { ...this.classlessProps, id: subQkey, type: "Text", label: "", value: cellContent }

						if (cellContent.startsWith("SubQuestion::")) {
							console.log("DD");
							let subQuestionID = cellContent.substring(cellContent.indexOf("SubQuestion::") + 13);
							console.log(subQuestionID);
							let questionData = getQuestionData(subQuestionID);
							adHocProps = { ...adHocProps, ...questionData };
						}



						return (
							<TableCell className={classes.tableCell} key={this.props.id + "_row:" + row + "_col:" + col}>
								{/* {cellContent + "_row:" + row + "_col:" + col} */}
								{col === 0 && this.props.rowHeaders ?
									<div className={classes.header}>{cellContent}</div> :
									<Question {...adHocProps} stateChangeHandler={this.handleTableChange("in build")} />}
								{/* {cellContent} */}
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
					this.props.colHeaders.map((colWidth, i) => <col key={"colWidth_" + i} width={100 / this.props.colHeaders.length} />)
			}
		</colgroup>;

		theQ =
			<Table key={this.props.id + "_table"} className={classes.table}>
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

		return theQ;
	};



	render() {
		let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLValue;

		//FUTURE: Let's build the question as needed rather than re-render every time?  (right now, the entire question gets rebuilt upon a single keypress)
		// The problem with the first attempt at that was that the drop down did not display the selection after selecting

		return this.buildQuestion();
		

	}
}

InputTable.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	stateChangeHandler: PropTypes.func,
	key: PropTypes.string,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	XMLValue: PropTypes.string,
	type: PropTypes.oneOf(["InputTable"]).isRequired,
	selectOptions: PropTypes.arrayOf(PropTypes.object)

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(InputTable);