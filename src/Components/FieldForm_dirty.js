import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
// import { styles } from '../style';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Question from './Question';

const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing.unit * 2,
	},
});

class FieldForm extends React.Component {
	state = {
		age: '',
		name: 'hai',
	};

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	componentDidMount() {
		this.props.appBarTextCB("Field Form");
	}

	render() {
		const { classes } = this.props;
		var selectArr = [
			{
				value: ' ',
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
		return (
			<div>
				<h1>FF</h1>

				<form className={classes.root} autoComplete="off">
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="age-simple">Age</InputLabel>
						<Select
							value={this.state.age}
							onChange={this.handleChange}
							inputProps={{
								name: 'age',
								id: 'age-simple',
							}}
						>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							<MenuItem value={10}>Ten</MenuItem>
							<MenuItem value={20}>Twenty</MenuItem>
							<MenuItem value={30}>Thirty</MenuItem>
						</Select>
					</FormControl>

					<Question key="test3" id="test3" label="Question #3" XMLvalue="XMLQ3" type="DropDown" selectOptions={selectArr}/>

					</form>

					VAlue:{this.state.age}


					{/* <form className={classes.container} noValidate autoComplete="off">
			<Question key="test1" id="test" label="Question #1" XMLvalue="XMLQ1" type="Text" placeholder="placeme"/>
			<Question key="test2" id="test2" label="Question #2" XMLvalue="XMLQ2" type="MultiText"/> */}
			
			{/* </form> */}
			</div>
				);
			}
		}
		
FieldForm.propTypes = {
					classes: PropTypes.object.isRequired,
				appBarTextCB: PropTypes.func
			};
			
export default withStyles(styles, {withTheme: true })(FieldForm);