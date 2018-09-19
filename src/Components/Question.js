import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Text from './Questions/Text';
import DropDown from './Questions/DropDown';
import MultipleChoice from './Questions/MultipleChoice';
import Toggle from './Questions/Toggle';
import TableInput from './Questions/TableInput';
import DateInput from './Questions/DateInput';
import TimeInput from './Questions/TimeInput';
import Hidden from '@material-ui/core/Hidden';
import ComputedValue from './Questions/ComputedValue';
import ButtonInput from './Questions/ButtonInput';
import ParametersTable from './Questions/ParametersTable';
import QWDATATable from './Questions/QWDATATable';

//this.state.value always contains the up-to-date question values/answers.
//all other items (options, selects, etc) are pulled from props. //TODO: ensure this is true for all types.

const styles = theme => ({
	// formControl: {
	// 	margin: 0,
	// 	display: 'flex',
	// 	fullWidth: true,
	// 	wrap: 'nowrap'
	// },
	// inputLabel: {
	// 	margin: 0,
	// 	display: 'flex',
	// 	fullWidth: true,
	// 	wrap: 'nowrap'
	// },
	// tableCell: {
	// 	padding: 5,
	// 	flexShrink: 0,
	// },
	// textField: {
	// 	padding: 0,
	// 	margin: 0,
	// 	backgroundColor: "#191",
	// 	color: "#fff"
	// },
	// table: {
	// 	width: 10,
	// 	backgroundColor: "#911"
	// }


});



class Question extends React.Component {
	constructor(props) {
		super(props);
		//console.log(this.props.id + " value is " + this.props.value);
		this.state = {
			value: this.props.value?this.props.value:"", 
		};
	};

	buildQuestion() {
		var theQ = {};
		// var realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.XMLTag;

		switch (this.props.type) {
			case 'ComputedValue': {
				theQ = <ComputedValue {...this.props} />
				break;
			}
			case 'DropDown': {
				theQ = <DropDown {...this.props} />
				break;
			}
			case 'Text': {
				theQ = <Text {...this.props} />
				break;
			}
			case 'MultipleChoice': {
				theQ = <MultipleChoice {...this.props} />;
				break;
			}
			case 'Toggle': {
				theQ = <Toggle {...this.props} />;
				break;
			}
			case 'TableInput': {
				theQ = <TableInput {...this.props} />;
				break;
			}
			case 'DateInput': {
				theQ = <DateInput {...this.props} />;
				break;
			}
			case 'TimeInput': {
				theQ = <TimeInput {...this.props} />;
				break;
			}
			case 'ButtonInput' : {
				theQ = <ButtonInput {...this.props} />;
				break;
			}
			case 'ParametersTable' : {
				theQ = <ParametersTable {...this.props} />;
				break;
			}
			case 'QWDATATable' : {
				theQ = <QWDATATable {...this.props} />;
				break;
			}
			default: {
				//TODO: Throw error
				console.log("Question " +this.props.type+ " doesn't match any type");
				theQ = null; // this helps it not crash the entire program, but it still doesn't fix the problem or warn anyone.
				//FIXME: by not returning a question with a key, this throws a application-wide error... 
			}
		}
		return theQ;
	};



	render() {
		let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;

		//FUTURE: Let's build the question as needed rather than re-render every time?  (right now, the entire question gets rebuilt upon a single keypress)
		let rawQuestion = this.buildQuestion();

		let withPaper = <Paper>{this.buildQuestion()}</Paper>;

		if(this.props.globalState && this.props.globalState.usePaper!=null && !this.props.globalState.usePaper) { 
			withPaper = rawQuestion;
		} 

		let withToolTip = withPaper;
		if (tooltip != null) {
			withToolTip = <Tooltip title={tooltip} enterDelay={500} leaveDelay={200}>{withPaper}</Tooltip>
		//	console.log("Adding tooltip: ", tooltip, "for question: ", this.props.label);
			
		}

		let withHidden = withToolTip;
		if (this.props.hidden) {
			withHidden = <Hidden xsUp xlDown>{withToolTip}</Hidden>
		}

		return withHidden;
	}
}

	Question.propTypes = {
		classes: PropTypes.object,
		validator: PropTypes.func,
		stateChangeHandler: PropTypes.func,
		key: PropTypes.string,
		id: PropTypes.string.isRequired,
		label: PropTypes.string,
		placeholder: PropTypes.string,
		XMLTag: PropTypes.string,
		type: PropTypes.oneOf(['Text', "QWDATATable", "ParametersTable", "ButtonInput", 'DropDown', 'MultipleChoice', 'Toggle', "TableInput", "Checkbox", "DateInput", "TimeInput", "ComputedValue"]).isRequired,
		selectOptions: PropTypes.arrayOf(PropTypes.object),

		//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
		// (ie: "if dropDown... select_options prop(array or strings) is required")
		//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

	};

	export default withStyles(styles)(Question);