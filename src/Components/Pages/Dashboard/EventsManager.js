//TODO: delete just removes from view, does not delete from data
//TODO: currently, selecting the row tries to load the event.  This is unwanted behavior.
//FUTURE: rename event
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { styles } from '../../../style';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';

import { withRouter } from 'react-router-dom';

import MUIDataTable from "mui-datatables";

import { loadAndSetCurrentSamplingEvent } from "../../../Actions/SedFF";
import { removeEventFromUsername } from "../../../Actions/SamplingEvents";
import { showNavigationTab } from "../../../Actions/UI";
import { getAllUsersEventIDs } from '../../../Utils/StoreUtilities';
import { getQuestionValue } from '../../../Utils/QuestionUtilities';
import Button from '@material-ui/core/Button';

const EVENT_ID_COLUMN = 0;  // column in the data where eventID resides

const columns = [
	{
		name: "Event ID",
		options: {
			display: 'excluded'
		}
	},
	{
		name: "Event Name",
		options: {
			filter: false
		}
	},
	{
		name: "Event Date",
		options: {
			filter: true
		}
	},
	{
		name: "Modified Date",
		options: {
			filter: true
		}
	},
	{
		name: "Station Name",
		options: {
			filter: true
		}
	},
	{
		name: "Shipped Status",
		options: {
			filter: true
		}
	},
	{
		name: "View Summary",
		options: {
			filter: false
		}
	},
];

const initialState = {
	toFieldForm: false,
	toEventSummary: false,
}


class EventsManager extends React.Component {
	constructor(props) {
		super(props);
		this.state = initialState;
		this.options = {
			filterType: 'checkbox',
			print: false,
			download: false,
			onRowClick: this.onRowClick,
			onRowsSelect: this.onRowsSelect,
			onCellClick: (colData, cellMeta) => {
				if (cellMeta.colIndex !== 6) {
					this.props.loadAndSetCurrentSamplingEvent(this.getDataTable()[cellMeta.dataIndex][EVENT_ID_COLUMN], () => { 
						this.setState({ toFieldForm: true, selectedEventIndex: cellMeta.dataIndex });
					})
				}
			},
			onRowsDelete: this.onRowsDelete
		};
	}

	getDataTable = () => {
		if (!this.props.currentUser) {
			return [];
		}
		if (!this.props.allSamplingEvents) {
			return [];
		}

		if (this.props.isFetchingUserData) {
			return [];
		}

		if (!this.props.fetchingUserDataComplete) {
			return [];
		}



		//build table data
		let currentUserEventIDs = getAllUsersEventIDs(this.props.currentUser.username);
		
		if (!currentUserEventIDs) {
			return [];
		}

		// console.log('currentUserEventIDs :', currentUserEventIDs);

		let currentUserEvents = currentUserEventIDs.map((eventID) => {
			return this.props.allSamplingEvents[eventID]
		})

		let data = currentUserEvents.map((event) => {
			if (event) {
				return [
					event.eventID,
					event.eventName,
					getQuestionValue(event.eventID, "sampleDate") ? getQuestionValue(event.eventID, "sampleDate") : "N/A",   //TODO: this isn't working
					new Date(event.dateModified).toDateString() + " @ " + new Date(event.dateModified).getHours() + ":" + (new Date(event.dateModified).getMinutes() + 1),
					getQuestionValue(event.eventID, "stationName") ? getQuestionValue(event.eventID, "stationName") : "N/A",
					event.shippedStatus,
					<Button onClick={() => {
						this.setState({ toEventSummary: true, SummaryEventID: event.eventID })
					}}>
						View Event Summary
			</Button>,
				]
			} else {  //TODO: trigger pull from DB?
				return null;
			}

		}).filter(datum => datum);

		return data;
	}

	//rowsDeleted: object(lookup: {[dataIndex]: boolean}, data: arrayOfObjects: {index: number, dataIndex: number})

	onRowsDelete = (rowsDeleted) => {
		console.log('rowsDeleted :', rowsDeleted);
		rowsDeleted.data.forEach(indexObj => {
			console.log(" indexObj.dataIndex", indexObj.dataIndex)
			let eventIDToRemove = this.getDataTable()[indexObj.dataIndex][EVENT_ID_COLUMN];
			console.log('eventIDToRemove :', eventIDToRemove);
			this.props.removeEventFromUsername(eventIDToRemove, this.props.currentUser.username);
		})

	}

	componentWillUnmount() {
		this.setState(initialState);
	}

	render() {
		// const {fetchingUserDataComplete}

		if (this.state.toFieldForm) {
			return <Redirect to='/FieldForm' /> //loading event happens in the onCellClick and toFieldForm doesn't get set until the leader callback
		}

		if (this.state.toEventSummary) {
			return <Redirect to={"/EventSummary/" + this.state.SummaryEventID} />
		}

		return <MUIDataTable
			title={"Events Manager"}
			data={this.getDataTable()}
			columns={columns}
			options={this.options}
		/>
	}
}

const mapStateToProps = function (state) {
	return {
		allSamplingEvents: state.SamplingEvents,
		isFetchingUserData: state.SedFF.isFetchingUserData,
		fetchingUserDataComplete: state.SedFF.fetchingUserDataComplete,
		currentUser: state.Users[state.SedFF.currentUsername]
	}
}

const mapDispatchToProps = {
	loadAndSetCurrentSamplingEvent,
	showNavigationTab,
	removeEventFromUsername
}

EventsManager.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(EventsManager)));

