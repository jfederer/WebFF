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

import { createQuestionComponentsForLayoutGroup } from '../Utils/QuestionUtilities';

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
				//FIXME:  no value is being stored in the questions state because this isn't in "questionsData" and instead, is in "dialogQuestions..."
				//TODO: Move "dialog questions" to the bulk "questionsData" during import and store their values along everyone elses
				// console.log(this);
				// console.log(this.refs);
				// console.log(this.refs.switchUser_email);
				// console.log(this.props.dialogQuestions);
				let username = document.getElementById('switchUser_email').value;  // KLUDGE because REFs doesn't appear to be working correctly
				this.props.setLoggedInUser(username);
				this.props.closeHandler();
				break;
			}
			case "Add/Remove Station": {
				//console.log("Adding New Station");

				//TODO::::::
				//TODO::::::
				//TODO::::::  Will need to have this check for adding or deleting.
				//TODO::::::
				//TODO::::::



				let dialog = globalState.dialogQuestions.filter((dialog) => {
					return dialog.dialogName === dialogName;
				})[0];
				
				let stnObj = {};
				for (let i = 0; i < dialog.questions.length; i++) {
					let q_id = dialog.questions[i].id;
					let short_q_id = q_id.substring(11);
					stnObj[short_q_id] = document.getElementById(q_id).value;
				}

				this.props.addStation(stnObj["stationName"], stnObj["stationNumber"], stnObj["projectName"], stnObj["projectID"], stnObj["agencyCode"]);
				this.props.closeHandler();
				break;
			}
			default: {
				console.log(dialogName + "submit button is not yet implemented");
			}
		}

	}


	render() {
		const { closeHandler, dialogName, dialogDescription, dialogQuestions } = this.props;

		//TODO: callback function for these questions
		//TODO: questionPanel could actually be a questionPage...allowing for multiple panels... perhaps useful in the 'settings' dialog?


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
						questions={createQuestionComponentsForLayoutGroup(dialogQuestions, this.props.stateChangeHandler, this.props.globalState)}

						key={dialogName} />

				</DialogContent>
				<DialogActions>
					<Button onClick={closeHandler} color="primary">Cancel</Button>
					<Button onClick={() => this.dialogSubmitHandler(dialogName, this.props.globalState)} color="primary">Submit</Button>
				</DialogActions>
			</Dialog>
		);
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