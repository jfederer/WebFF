import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

//this.state.value always contains the up-to-date question values/answers.
//all other items (options, selects, etc) are pulled from props. //TODO: ensure this is true for all types.

const styles = theme => ({

});


class MultipleChoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value, //FUTURE: Look into just using the XMLvalue as the key and the 'value' as the value... might make conversion to XML simpler.
        };
    };

    componentWillMount() {
        this.setState({ value: this.props.value });
    }

    handleMultiChoiceChange = choiceVal => event => {  //FUTURE: combine the handlers  (or split out question types to sub-components)

        let tempValue = this.state.value;

        if (event.target.checked) {
            tempValue.push(choiceVal);
        } else {
            let index = tempValue.indexOf(choiceVal);
            if (index > -1) {
                tempValue.splice(index, 1);
            } else {
                //TODO: Throw Error
                console.log("ERROR: MultiChoice option requested for removal did not exist in list of checked items in 'value'");
            }
        }

        this.setState({ value: tempValue }, () => this.props.stateChangeHandler(this)
        );
    };

    buildCheckboxOptions(optionsPairs) {  // note, this references props and state... not just passed parameters and blank option could be split out for reuse
        var JSX_return = [];

        for (var optionLabel in optionsPairs) {
            JSX_return.push(
                <FormControlLabel
                    key={optionLabel + ":" + optionsPairs[optionLabel]}
                    control={
                        <Checkbox
                            checked={this.state.value && this.state.value.includes(optionsPairs[optionLabel])}
                            onChange={this.handleMultiChoiceChange(optionsPairs[optionLabel])}
                            value={optionsPairs[optionLabel]}
                        />
                    }
                    label={optionLabel}
                />
            );
        }
        return JSX_return;
    };



    render() {
        // let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLValue;
        return <FormControl component="fieldset" key={this.props.id}>
            <FormLabel component="legend">{this.props.label}</FormLabel>
            <FormGroup>
                {this.buildCheckboxOptions(this.props.options)}
            </FormGroup>
        </FormControl>;
    }
}

MultipleChoice.propTypes = {
    classes: PropTypes.object,
    validator: PropTypes.func,
    stateChangeHandler: PropTypes.func.isRequired,
    key: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    XMLValue: PropTypes.string,
    type: PropTypes.oneOf(['MultipleChoice']).isRequired, 
    options: PropTypes.object.isRequired,
    helperText: PropTypes.string

    //TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
    

};

export default withStyles(styles)(MultipleChoice);