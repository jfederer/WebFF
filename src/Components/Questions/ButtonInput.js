import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

//this.state.value always contains the up-to-date question values/answers.

const styles = theme => ({
	// container: {
	// 	display: 'flex',
	// 	flexWrap: 'wrap',
	// },
	// textField: {
	// 	marginLeft: theme.spacing.unit,
	// 	marginRight: theme.spacing.unit,
	// },
});

class ButtonInput extends React.Component {
	

	componentWillMount() {
		this.setState({ value: this.props.value });
	}

	clickHandler = ()=> {  //FUTURE: combine the handlers  (or split out question types to sub-components)
		console.log("Click");
		this.props.stateChangeHandler(this);
	};

	render() {
		// const { classes } = this.props;

		// // let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;
		// let thisSize = this.props.size ? this.props.size : 1;
		// let realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.XMLTag;

		return <Button
			size={this.props.size?this.props.size:"small"}
			//icon={this.props.icon?this.props.icon:null}
			onClick={this.clickHandler}
			key={this.props.id}
			id={this.props.id}
			label={this.props.label}
			variant={this.props.variant?this.props.variant:null}
			actions={this.props.actions}
			>
			{this.props.label}
			</Button>

	}
}

ButtonInput.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	stateChangeHandler: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	type: PropTypes.oneOf(['ButtonInput']).isRequired,
	helperText: PropTypes.string

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(ButtonInput);