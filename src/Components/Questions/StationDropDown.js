import React from 'react';
import { connect } from 'react-redux';
// import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
//import Tooltip from '@material-ui/core/Tooltip';
import FormControl from '@material-ui/core/FormControl';
import { SEQuestionValueChange } from '../../Actions/SamplingEvents';
import { setAddRemoveStationDialogVisibility } from '../../Actions/UI';
import { ADD_STATION } from '../../Constants/Dictionary';
import { getStationFromID, getUsersStationIDs } from '../../Utils/StoreUtilities';


//TODO: generate minWidth based on content & label
const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		margin: 0,
		display: 'flex',
		fullWidth: true,
		wrap: 'nowrap'
	},
	inputLabel: {
		margin: 0,
		display: 'flex',
		fullWidth: true,
		wrap: 'nowrap'
	}
});

class StationDropDown extends React.Component {

	constructor(props) {
		super(props);

		let options = this.getOptions();

		if (typeof this.props.value ==='undefined' && typeof options !== 'undefined') {
			let optKeyArr = Object.keys(options);
			this.handleValueChange(options[optKeyArr[0]]);
		}

	}

	handleValueChange = (value) => {

		if(value === ADD_STATION) {
			this.props.setAddRemoveStationDialogVisibility(true);
			return; //don't actually allow 'setting' this value to Add Station
		}


		if (this.props.alternateChangeHandler) {
			this.props.alternateChangeHandler(this.props.currentEventID, this.props.id, value);
		} else {
			this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, value);
		}
	};

	handleOnChange = (event) => {
		this.handleValueChange(event.target.value);
	}

	getOptions = () => {
		const { stationIDs } = this.props;
		let options = {};
		if(stationIDs) {  // they might have zero stationIDs
			stationIDs.forEach(stationID => {
				let station = getStationFromID(stationID);
				options[station.displayName] = station.name;
			});
		}
		return options;
	}

	render() {
		const { classes, currentUsername, stationIDs } = this.props;

		let options = this.getOptions();
	
		//TODO: let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;

		// if (tooltip != null) {
		// 	return <Tooltip title={tooltip} enterDelay={500} leaveDelay={200}>{this.buildQuestion()}</Tooltip>;

		if (typeof options === 'undefined' || Object.keys(options).length < 1) {
			// if there are no stations, display the addStation dialog
			this.props.setAddRemoveStationDialogVisibility(true);
		}

		return <FormControl
			className={classes.formControl}
		>
			{(this.props.label != null) ?
				<InputLabel className={classes.inputLabel}>{this.props.label}</InputLabel> :
				null}
			<Select
				native
				// autoWidth={true}
				fullWidth
				value={this.props.value}
				onChange={this.handleOnChange}
				inputProps={{
					name: this.props.label,
					id: this.props.id,
				}}
			>

				{typeof options === 'undefined' || Object.keys(options).length < 1
					? <option key="nada2" value="nothing"></option> // just a blank so the user can select 'Add Station' and trigger value change event handler
					: Object.keys(options).map((optionLabel, index) => <option key={optionLabel} value={options[optionLabel]}>{optionLabel}</option>)}

				{this.props.includeAddStation===false  ? null : <option key="addStationKey" value={ADD_STATION}>Add Station</option> }
			</Select>
		</FormControl>
	}
}

StationDropDown.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	XMLTag: PropTypes.string,
	type: PropTypes.oneOf(['StationDropDown']).isRequired,
	helperText: PropTypes.string

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

const mapStateToProps = function (state) {
	return {
		currentEventID: state.SedFF.currentSamplingEventID,
		currentUsername: state.SedFF.currentUsername,
		stationIDs: state.LinkTables.userStations[state.SedFF.currentUsername]
	}
}

const mapDispatchToProps = {
	SEQuestionValueChange,
	setAddRemoveStationDialogVisibility
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(StationDropDown));
