import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


//this.state.value always contains the up-to-date question values/answers.
//all other items (options, selects, etc) are pulled from props. //TODO: ensure this is true for all types.

const styles = theme => ({

});

class Toggle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value, //FUTURE: Look into just using the XMLvalue as the key and the 'value' as the value... might make conversion to XML simpler.
		};
	};

	componentWillMount() {
		// this.setState({ key: this.props.id });
		this.setState({ value: this.props.value });
	}

	handleToggleChange = name => event => {
		this.setState({ [name]: event.target.checked }, () => this.props.stateChangeHandler(this));
	};

	render() {
		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLValue;
        // const { classes } = this.props;
		// var realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.XMLvalue; 

        if (this.props.label!=null) {
            return <FormControlLabel
            key={this.props.id + "_FormControlLabel"}
            control={
                <Switch
                    key={this.props.id}
                    id={this.props.id}
                    checked={this.state.value}
                    onChange={this.handleToggleChange('value')}
                    xmlvalue={this.props.XMLValue}
                />
            }
            label={this.props.label}
        />
        } else {
            return <Switch
            key={this.props.id}
            id={this.props.id}
            checked={this.state.value}
            onChange={this.handleToggleChange('value')}
            xmlvalue={this.props.XMLValue}
        />
        }

    }
}

Toggle.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	stateChangeHandler: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	XMLValue: PropTypes.string,
    type: PropTypes.oneOf(['Toggle']).isRequired,
    helperText: PropTypes.string

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(Toggle);