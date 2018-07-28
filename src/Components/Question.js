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
		this.state = {
			value: this.props.value, //FUTURE: Look into just using the XMLvalue as the key and the 'value' as the value... might make conversion to XML simpler.
		};
		//console.log(this.props);
	};

	componentWillMount() {
		// this.setState({ key: this.props.id });
		// this.setState({ value: this.props.value });
	}

	buildQuestion() {
		// const { classes } = this.props;
		var theQ = {};
		// var realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.XMLvalue;

		switch (this.props.type) {
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
			default: {
				//TODO: Throw error
				console.log("Question doesn't match any type");
				theQ = null; // this helps it not crash the entire program, but it still doesn't fix the problem or warn anyone.
				//FIXME: by not returning a question with a key, this throws a application-wide error... 
			}
		}
		return theQ;
	};



	render() {
		let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLValue;

		//FUTURE: Let's build the question as needed rather than re-render every time?  (right now, the entire question gets rebuilt upon a single keypress)
		// The problem with the first attempt at that was that the drop down did not display the selection after selecting

		if (tooltip != null) {
			return <Tooltip title={tooltip} enterDelay={500} leaveDelay={200}><Paper>{this.buildQuestion()}</Paper></Tooltip>;
		} else {
			return <Paper>{this.buildQuestion()}</Paper>;
		}

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
	XMLValue: PropTypes.string,
	type: PropTypes.oneOf(['Text', 'DropDown', 'MultipleChoice', 'Toggle', "TableInput", "Checkbox", "DateInput", "TimeInput"]).isRequired,  
	selectOptions: PropTypes.arrayOf(PropTypes.object),

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(Question);