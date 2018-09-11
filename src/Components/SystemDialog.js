import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import QuestionPanel from './QuestionPanel';

import { createQuestionComponents } from '../Utils/QuestionUtilities';

const styles = theme => ({

});

class SystemDialog extends React.Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		dialogQuestions: this.props.dialogQuestions;
	// 	};
	// };

	dialogSubmitHandler(dialogName, globalState) {
		//TODO: some of these can be dynamic from the DB. Add New Station is a reasonable example, but could go further pulling cases from DB too.
		switch (dialogName) {
			case "Switch User": {  //HARDCODE
				console.log("Switching user");
				let username = document.getElementById('switchUser_email').value;  // KLUDGE because REFs doesn't appear to be working correctly
				this.props.setLoggedInUser(username);
				this.props.closeHandler();
				break;
			}
			case "Add/Remove Station": { //HARDCODE
				//console.log("Adding New Station");

				if (document.getElementById("editStation_AddOrRemove").value === "Add") {
					let addStationElementIDs = ["stationName", "stationNumber", "projectName", "projectID", "agencyCode"];
					let stnObj = {};

					for (let i = 0; i < addStationElementIDs.length; i++) {
						let q_id = "newStation_" + addStationElementIDs[i];
						let short_q_id = addStationElementIDs[i];
						stnObj[short_q_id] = document.getElementById(q_id).value;  //TODO: FIXME: fails badly if getElement returns null
					}

					this.props.addStation(stnObj["stationName"], stnObj["stationNumber"], stnObj["projectName"], stnObj["projectID"], stnObj["agencyCode"]); // HARDCODE (change addStation to accept object would be better)

					this.props.closeHandler();
				} else {
					//TODO: REMOVE STATION
					this.props.removeStation(document.getElementById("deleteStation_stationName").value); //TODO: FIXME: fails badly if getElement returns null
					this.props.closeHandler();
				}
				break;

			}
			case "Settings":
				this.props.closeHandler();
				break;
			default: {
				console.log(dialogName + "submit button is not yet implemented");
			}
		}

	}


	buildDialog() {
		const { closeHandler, dialogName, dialogDescription, dialogQuestions } = this.props;
		// console.log("SystemDialog.props: ", this.props);
		// console.log("dialogQuestions: ", dialogQuestions);

		if (dialogQuestions === null || dialogQuestions.length === 0) {
			// console.log("null dialogQuestions");
			return null;
		} else
			return (
				<Dialog
					open={this.props.isOpen}
					onClose={this.props.closeHandler}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">{dialogName}</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{dialogDescription}:
            			</DialogContentText>
						<QuestionPanel
							questions={createQuestionComponents(dialogQuestions, this.props.stateChangeHandler, this.props.globalState, this.props.questionsValues, this.props)}

							key={dialogName} />

					</DialogContent>
					<DialogActions>
						<Button onClick={closeHandler} color="primary">Cancel</Button>
						<Button onClick={() => this.dialogSubmitHandler(dialogName, this.props.globalState)} color="primary">Submit</Button>
					</DialogActions>
				</Dialog>
			);
	}


	render() {

		//console.log("SD.props: ", this.props);

		//TODO: callback function for these questions
		//TODO: questionPanel could actually be a questionPage...allowing for multiple panels... perhaps useful in the 'settings' dialog?


		return this.buildDialog();

	}
}



SystemDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	dialogQuestions: PropTypes.array.isRequired,
	dialogDescription: PropTypes.string,
	dialogName: PropTypes.string.isRequired,
	closeHandler: PropTypes.func.isRequired
}

export default withStyles(styles)(SystemDialog);