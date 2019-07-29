import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { styles } from '../../style';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import DialogContentText from '@material-ui/core/DialogContentText';

import Question from '../Question';

import { navMenuItems } from '../../Constants/NavMenu';
import { setAddRemoveQuestionDialogVisibility } from '../../Actions/UI';
import { addQuestionToUser, addQuestionToStation, addQuestionToEvent } from '../../Actions/Questions';
import { getCurrentStationID } from '../../Utils/StoreUtilities';

const implementedQuestions = {
	Text: "Text",
	Checkbox: "Checkbox"
}

const EVENT_SAVE_LOCATION_TEXT = "This specific Event";
const STATION_SAVE_LOCATION_TEXT = "Station Setup";
const USER_SAVE_LOCATION_TEXT = "User Configuration";

//TODO: these keys can reflect current situation --- "JFEDERER's Configuration" ..."Rum River station"..."Current event Sediment on Jordan"...etc.

const initialState = {
	creatingQ: "",
	Q_save_loc: "",
	addQuestion_id: "",
	addQuestion_label: "",
	addQuestion_Qtype: "",
	addQuestion_panel: "",
	addQuestion_tab: "",
	addQuestion_sizexs: "",
	addQuestion_sizelg: "",
	deleteQuestion_qid: "",
	addSubmitButtonDisabled: true,
	deleteSubmitButtonDisabled: true,
	pageOptions: {},
	saveLocations: {}
}



class AddRemoveQuestionDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = _.cloneDeep(initialState);

	}

	customQuestionsList() {
		if (this.state.creatingQ === false) { // if this is a delete question
			let options = {};
			let CQ = localStorage.getItem("customQuestions");
			if (CQ) {
				CQ = JSON.parse(CQ);
				for (let i = 0; i < CQ.length; i++) {
					options[CQ[i].id] = CQ[i].id;
				}
			}
			return options;
		} else {
			return null;
		}
	}


	shouldEnableAddSubmitButton() {
		if (this.state.addQuestion_Qtype === null || this.state.addQuestion_Qtype === "" ||
			this.state.addQuestion_label === null || this.state.addQuestion_label === "" ||
			this.state.addQuestion_panel === null || this.state.addQuestion_panel === "" ||
			this.state.addQuestion_tab === null || this.state.addQuestion_tab === "" ||
			this.state.Q_save_loc === null || this.state.Q_save_loc === "") {
			return false;
		}
		return true;
	}

	shouldEnableDeleteSubmitButton() {
		if (this.state.deleteQuestion_qid === null || this.state.deleteQuestion_qid === "") {
			return false;
		}
		return true;
	}

	updateDisabledButtons = () => {
		if (this.state.creatingQ === true) {
			let addSubmitButtonDisabled = !this.shouldEnableAddSubmitButton();
			this.setState({
				addSubmitButtonDisabled: addSubmitButtonDisabled
			});
		}

		if (this.state.creatingQ === false) {
			let deleteSubmitButtonDisabled = !this.shouldEnableDeleteSubmitButton();
			this.setState({
				deleteSubmitButtonDisabled: deleteSubmitButtonDisabled
			});
		}
	}

	deleteButtonHandler = () => {
		//build select options from existing custom questions


		//set them to state, then set to state that we are deleting...
		this.setState({ creatingQ: false });
	}

	handleValueChange = (eventID, QID, value) => {
		this.setState({ [QID]: value }, this.updateDisabledButtons);
	};


	createQButtonHandler = () => {
		this.setState({ creatingQ: true });
	}

	onEnter = () => {

		let pageOptions = {};
		let saveLocations = {};
		let currentPage = "";
			navMenuItems.forEach((navMenuItem) => {
				if (navMenuItem.text !== "Dashboard") {
					pageOptions[navMenuItem.text] = navMenuItem.text.replace(/\s/g, '');
				}
			})

			currentPage = this.props.location.pathname.substring(1);

			if (currentPage === "") {
				currentPage = "FieldForm";
			}


		if(this.props.currentSamplingEventID) {
			saveLocations[EVENT_SAVE_LOCATION_TEXT]="Event";
		}
		if(this.props.currentUsername) {
			saveLocations[USER_SAVE_LOCATION_TEXT]="User";
		}
		if(getCurrentStationID()) {
			saveLocations[STATION_SAVE_LOCATION_TEXT]="Station";
		}


		this.setState({
			saveLocations: saveLocations,
			addQuestion_tab:currentPage, 
			pageOptions: pageOptions, 
			Q_save_loc: saveLocations[USER_SAVE_LOCATION_TEXT]}
		);

		

	}


	addSubmitHandler = () => {
		//build q_id dynamically
		let QID = "#Type=" + this.state.addQuestion_Qtype + "#Label=" + this.state.addQuestion_label + "#Location=" + this.state.addQuestion_tab + ":" + this.state.addQuestion_panel;

		//TODO: verify unique

		let Q_obj;
		switch (this.state.addQuestion_Qtype) {
			case "Text":
				Q_obj = {
					type: "Text",
					id: QID,
					label: this.state.addQuestion_label,
					value: "",  //TODO: add question  
					tabName: this.state.addQuestion_tab,
					layoutGroup: this.state.addQuestion_panel,
					width_xs: isNaN(parseInt(this.state.addQuestion_sizexs, 10)) ? null : parseInt(this.state.addQuestion_sizexs, 10),
					width_lg: isNaN(parseInt(this.state.addQuestion_sizelg, 10)) ? null : parseInt(this.state.addQuestion_sizelg, 10)
				}
				break;
			case "Checkbox":
				Q_obj = {
					type: "Toggle",
					checkbox: true,
					id: QID,
					label: this.state.addQuestion_label,
					value: "",  //TODO: add question  
					tabName: this.state.addQuestion_tab,
					layoutGroup: this.state.addQuestion_panel,
					width_xs: isNaN(parseInt(this.state.addQuestion_sizexs, 10)) ? null : parseInt(this.state.addQuestion_sizexs, 10),
					width_lg: isNaN(parseInt(this.state.addQuestion_sizelg, 10)) ? null : parseInt(this.state.addQuestion_sizelg, 10)
				}
				break;
			default:
				throw new Error("Attempted to add question that was not implemented: " + this.state.addQuestion_Qtype);
		}

		switch (this.state.Q_save_loc) {
			case "User":
				this.props.addQuestionToUser(this.props.currentUsername, Q_obj);
				break;
			case "Station":
				this.props.addQuestionToStation(getCurrentStationID(), Q_obj);
				break;
			case "Event":
				this.props.addQuestionToEvent(this.props.currentSamplingEventID, Q_obj);
				break;
			default: 
				throw new Error("Attempting to add question to location for ", this.state.Q_save_loc, " which is not implemented");
		}

		this.handleDialogClose()
	}


	deleteSubmitHandler = () => {
		this.props.customQuestionDeleter(this.state.deleteQuestion_qid, this.handleDialogClose);
	}



	handleDialogClose = () => {
		this.props.setAddRemoveQuestionDialogVisibility(false);
		setTimeout(() => {
			this.setState(initialState);
		}, 250);
	}


	render() {
		const { classes } = this.props;
		const { addRemoveQuestionDialogVisibility } = this.props.UI.visibility;

		console.log('this.state2 render :', this.state);

		return (
			<Dialog
				open={addRemoveQuestionDialogVisibility}
				onEnter={this.onEnter}
				onClose={this.handleDialogClose}
				aria-labelledby="form-dialog-title"
				fullWidth
				classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
			>
				<DialogTitle id="form-dialog-title">
					{this.state.creatingQ === ""
						? "Add/Delete "
						: this.state.creatingQ === true
							? "Add "
							: "Delete "}
					Custom Questions
        </DialogTitle>
				<DialogContent>
					<Grid justify="space-around" container >
						<Grid item xs={10}>
							<DialogContentText>
								{this.state.creatingQ === ""
									? "Create or Delete a custom question in your user configuration."
									: this.state.creatingQ === true
										? "Create a new custom question:"
										: "Delete an existing custom question:"}
							</DialogContentText>
						</Grid>
						{this.state.creatingQ === ""
							? <React.Fragment>
								<Grid item xs={4}>
									<Paper className={classes.paper}><Button onClick={this.createQButtonHandler}>Create a New Question</Button></Paper>
								</Grid>
								<Grid item xs={4}>
									<Paper className={classes.paper}><Button onClick={this.deleteButtonHandler}>Delete existing Question</Button></Paper>
								</Grid>
							</React.Fragment>
							: this.state.creatingQ === true
								? <React.Fragment>
									<Grid item xs={7}>
										<Question
											type="Text"
											required
											id="addQuestion_label"
											label="Question Label"
											alternateChangeHandler={this.handleValueChange}
											value={this.state.addQuestion_label}
										/>
									</Grid>
									<Grid item xs={6}>
										{/* TODO: these should be drop downs with existing options as well as a 'new' option */}
										<Question
											type="DropDown"
											required
											id="addQuestion_tab"
											label="Question location: Tab name"
											placeholder="What 'page' should this be on"
											options={this.state.pageOptions}
											alternateChangeHandler={this.handleValueChange}
											value={this.state.addQuestion_tab}
										/>
									</Grid>
									<Grid item xs={6}>
										<Question
											type="Text"
											required
											id="addQuestion_panel"
											label="Question location: Panel name"
											alternateChangeHandler={this.handleValueChange}
											value={this.state.addQuestion_panel}
										/>
									</Grid>
									<Grid item xs={6}>
										<Question
											type="Text"
											id="addQuestion_sizexs"
											label="Size (when screen small)"
											placeholder="1-12 (optional)"
											alternateChangeHandler={this.handleValueChange}
											value={this.state.addQuestion_sizexs}
										/>
									</Grid>
									<Grid item xs={6}>
										<Question
											type="Text"
											id="addQuestion_sizelg"
											label="Size (when screen large)"
											placeholder="1-12 (optional)"
											alternateChangeHandler={this.handleValueChange}
											value={this.state.addQuestion_sizelg}
										/>
									</Grid>
									<Grid item xs={12}>
										<InputLabel>Question Type</InputLabel>
										<Question
											required
											id="addQuestion_Qtype"
											includeBlank={true}
											value={this.state.addQuestion_Qtype}
											alternateChangeHandler={this.handleValueChange}
											options={implementedQuestions}
											type="DropDown"
										/>
									</Grid>
									<Grid item xs={12}>
										<InputLabel>Save Question to:</InputLabel>
										<Question
											required
											id="Q_save_loc"
											includeBlank={false}
											value={this.state.Q_save_loc}
											alternateChangeHandler={this.handleValueChange}
											options={this.state.saveLocations}
											type="DropDown"
										/>
									</Grid>

								</React.Fragment>
								// creatingQ===false
								: <Grid item xs={12}>
									<InputLabel>Select custom question to delete</InputLabel>
									<Question
										required
										id="deleteQuestion_qid"
										includeBlank={true}
										value={this.state.deleteQuestion_qid}
										stateChangeHandler={this.QChangeHandler}
										options={this.customQuestionsList}
										type="DropDown"
									/>
								</Grid>
						}


					</Grid>
				</DialogContent>
				<DialogActions>
					{this.state.creatingQ === ""
						? null
						: this.state.creatingQ === true
							? <Button disabled={this.state.addSubmitButtonDisabled} onClick={this.addSubmitHandler} color="primary">
								Add Question
              </Button>
							: <Button disabled={this.state.deleteSubmitButtonDisabled} onClick={this.deleteSubmitHandler} color="primary">
								Delete Question
              </Button>
					}

					<Button onClick={this.handleDialogClose} color="primary">
						Cancel
            		</Button>

				</DialogActions>
			</Dialog>
		);
	}
}



const mapStateToProps = function (state) {
	return {
		UI: state.UI, // to get dialog visibility
		currentSamplingEventID: state.SedFF.currentSamplingEventID,
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID],
		currentUsername: state.SedFF.currentUsername,
	}
}

const mapDispatchToProps = {
	setAddRemoveQuestionDialogVisibility,
	addQuestionToUser,
	addQuestionToStation,
	addQuestionToEvent
}

AddRemoveQuestionDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles, { withTheme: true })(AddRemoveQuestionDialog)));