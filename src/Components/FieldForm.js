import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../style';
import Question from './Question';

class FieldForm extends React.Component {


	componentDidMount() {
		this.props.appBarTextCB("Field Form");
	}

	render() {
		const { classes } = this.props;
		var selectArr = [
			{
				value: '',
				label: 'None'
			},
			{
				value: 'O1',
				label: 'Option 1'
			},
			{
				value: 'O2',
				label: 'Option 2'
			},
			{
				value: 'O3',
				label: 'Option 3'
			},
		];

		var multiArr = [
			{
				value: 'CSN',
				label: 'Colleen Niznik',
				checked: false
			},
			{
				value: 'CBF',  //tODO: IF VALUE exists, use it... if not, use label
				label: 'Corbin Brock',
				checked: true 
			},
			{
				value: 'RAF',
				label: 'Ruby Anne'
			},
			{
				value: 'JAW',
				label: 'Jan Wonka',
				checked: false
			},
		];

		return (
			<div>
				<h1>FF</h1>

				<form className={classes.root} autoComplete="off">

					 <Question key="test1" id="test" label="Question #1" XMLvalue="XMLQ1" type="Text" placeholder="placeme" />
					<Question key="test2" id="test2" label="Question #2" XMLvalue="XMLQ2" type="MultiText" /> 
					<Question key="test3" id="test3" label="Question #3" XMLvalue="XMLQ3" type="DropDown" selectOptions={selectArr} />
					<Question key="test4" id="test4" label="Question #4" XMLvalue="XMLQ4" type="MultiChoice" multiChoiceOptions={multiArr} />

				</form>
			</div>
		);
	}
}

FieldForm.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(FieldForm);