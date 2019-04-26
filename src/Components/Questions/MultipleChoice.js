import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { SEQuestionValueChange } from '../../Actions/SamplingEvents'


const styles = theme => ({

});

//TODO: NEXT:  Redux Multiple Choice

class MultipleChoice extends React.Component {

    componentWillMount() {
        this.setState({ value: this.props.value });
    }

    handleValueChange = choiceVal => event => { 
        let tempValueArr = []
        if(this.props.value!=="") {
            tempValueArr = this.props.value.slice();
        }
        

        if (event.target.checked) {
            tempValueArr.push(choiceVal);
        } else {
			while(tempValueArr.includes(choiceVal)) { // removing all occurences
				tempValueArr.splice(tempValueArr.indexOf(choiceVal), 1);
			}
        }

        this.setState({ value: tempValueArr }, () => this.props.stateChangeHandler(this));
    };

    render() {
        // console.log(this.state);
        // console.log("this.state.value", this.state.value);
        // let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;
        return <FormControl component="fieldset" key={this.props.id}>
            <FormLabel component="legend">{this.props.label}</FormLabel>
            <FormGroup>
			{Object.keys(this.props.options).map((optionLabel)=> { 
				return <FormControlLabel
				key={optionLabel + ":" + this.props.options[optionLabel]}
				control={
					<Checkbox
						checked={this.props.value && this.props.value.includes(this.props.options[optionLabel])}
						onChange={this.handleValueChange(this.props.options[optionLabel])}
						value={this.props.options[optionLabel]}
					/>
				}
				label={optionLabel}
			/>
			})}
            </FormGroup>
        </FormControl>;
    }
}

MultipleChoice.propTypes = {
    classes: PropTypes.object,
    validator: PropTypes.func,
    
    key: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    XMLTag: PropTypes.string,
    type: PropTypes.oneOf(['MultipleChoice']).isRequired, 
    options: PropTypes.object.isRequired,
    helperText: PropTypes.string

    //TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
    

};

const mapStateToProps = function (state) {
	return {
		currentEventID: state.SedFF.currentSamplingEventID
	}
}

const mapDispatchToProps = {
	SEQuestionValueChange
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(MultipleChoice));
