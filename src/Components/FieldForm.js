import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
import { styles } from '../style';

class FieldForm extends React.Component {
	componentDidMount() {
		this.props.appBarTextCB("Field Form");
	}

	render() {

		return (
			<h1>FF</h1>
		);
	}
}

FieldForm.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(FieldForm);