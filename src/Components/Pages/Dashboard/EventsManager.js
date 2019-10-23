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
import { showNavigationTab } from "../../../Actions/UI";
import { getAllUsersEventIDs } from '../../../Utils/StoreUtilities';
import { getQuestionValue } from '../../../Utils/QuestionUtilities';
import Button from '@material-ui/core/Button';
import { CLIENT_RENEG_LIMIT } from 'tls';

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
		this.state["data"] = this.getDataTable();
		this.options = {
			filterType: 'checkbox',
			print: false,
			download: false,
			onRowClick: this.onRowClick,
			onRowsSelect: this.onRowsSelect,
			onCellClick: (colData, cellMeta) => {
				if (cellMeta.colIndex !== 6) {
					this.props.loadAndSetCurrentSamplingEvent(this.state.data[cellMeta.dataIndex][0], () => { // zero is the column number of the eventID
						this.setState({ toFieldForm: true, selectedEventIndex: cellMeta.dataIndex });
					})
				}
			}
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

	componentWillReceiveProps() {
		console.log("CWRP");
		this.setState({data: this.getDataTable()}, console.log(JSON.stringify(this.state.data)));
	}
	componentDidUpdate() {
		console.log("CDU");
	}

	componentWillUnmount() {
		this.setState(initialState);
	}

	render() {
		// const {fetchingUserDataComplete}

		console.log("EventMangager Render Props: ", this.props);
		console.log("EventMangager Render STATE: ", this.state);

		if (this.state.toFieldForm) {
			return <Redirect to='/FieldForm' /> //loading event happens in the onCellClick and toFieldForm doesn't get set until the leader callback
		}

		if (this.state.toEventSummary) {
			return <Redirect to={"/EventSummary/" + this.state.SummaryEventID} />
		}

		return <MUIDataTable
			title={"Events Manager"}
			data={this.state.data}
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
	showNavigationTab
}

EventsManager.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(EventsManager)));

