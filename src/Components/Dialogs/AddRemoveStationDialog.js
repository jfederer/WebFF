import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { styles } from '../../style';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';


// import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';


import { setAddRemoveStationDialogVisibility } from '../../Actions/UI';
import Question from '../Question';
import { getUsersStationIDs } from '../../Utils/StoreUtilities';

const ADD = "ADD";
const REMOVE = "REMOVE";

const initialState = {
	addOrRemove: ""
}

class AddRemoveStationDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = _.cloneDeep(initialState);
	}

	handleValueChange = value => event => {  //FUTURE: combine the handlers  (or split out question types to sub-components)

		if (this.props.alternateChangeHandler) {
			this.props.alternateChangeHandler(this.props.currentEventID, this.props.id, event.target.value);
		} else {
			this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, event.target.value);
		}
	};

	closeHandler = () => {
		this.props.setAddRemoveStationDialogVisibility(false);
		setTimeout(() => {
			this.setState(initialState);
		}, 250);
	}

	//TODO: go through some global prop types for questions to get all avaiable options
	//TODO: there might not be existing custom questions -- hide the delete button and dialog info if there isn't
	render() {
		const { classes, currentUsername } = this.props;
		const { addRemoveStationDialogVisibility } = this.props.UI.visibility;

		let removeAllowed = getUsersStationIDs(currentUsername).length > 0;
//TODO: NEXT ALTERNATE CHANGE HANDLER

		return (
			<Dialog
				open={addRemoveStationDialogVisibility}
				onClose={this.closeHandler}
				aria-labelledby="form-dialog-title"
				fullWidth
				classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
			>
				<DialogTitle id="form-dialog-title">
					Station Manager
					{this.state.addOrRemove === ADD || !removeAllowed ? " (Adding)" : null}
					{this.state.addOrRemove === REMOVE ? " (Removing)" : null}
				</DialogTitle>

				<DialogContent>
					{this.state.addOrRemove === "" && removeAllowed
						? <React.Fragment>
							Add a new station to, or remove an existing station from, your personalized station list?
							<br></br>
							<Button onClick={() => this.setState({ addOrRemove: ADD })}>Add Station</Button>
							<Button onClick={() => this.setState({ addOrRemove: REMOVE })}>Remove Station</Button>
							{/* //TODO: check stations exist */}
						</React.Fragment>
						: null}

					{this.state.addOrRemove === ADD || !removeAllowed
						? <React.Fragment>
							<Question
								id="newStation_stationName"
								label="Station Name"
								type="Text"
								value=""
							/>
							<Question id="newStation_stationNumber"
								label="Station Number"
								type="Text"
								tabName="Add Station"
								value=""
							/>
							<Question id="newStation_projectName"
								label="Project Name"
								type="Text"
								tabName="Add Station"
								value=""
							/>
							<Question id="newStation_projectID"
								label="Project ID"
								type="Text"
								tabName="Add Station"
								value=""
							/>
							<Question id="newStation_agencyCode"
								label="Agency Code"
								type="Text"
								tabName="Add Station"
								value=""
							/>
						</React.Fragment>
						: null}


					{this.state.addOrRemove === REMOVE && removeAllowed
						? <React.Fragment>
							<Question
								id="removeStation_stationName"
								label="Station To Remove"
								type="StationDropDown"
								includeAddStation={false}
								value=""
							/>
						</React.Fragment>
						: null }





				</DialogContent>




				<DialogActions>
					<Button onClick={this.closeHandler} color="primary">
						Done
            		</Button>
				</DialogActions>
			</Dialog>
		);
	}
}




const mapStateToProps = function (state) {
	return {
		UI: state.UI, // to get dialog visibility
		users: state.Users,
		currentUsername: state.SedFF.currentUsername
	}
}

const mapDispatchToProps = {
	setAddRemoveStationDialogVisibility: setAddRemoveStationDialogVisibility,
}

AddRemoveStationDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AddRemoveStationDialog));