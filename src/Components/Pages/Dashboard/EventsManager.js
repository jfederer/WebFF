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
import Button from '@material-ui/core/Button';

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
	toEventSummary: false
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
					this.props.loadAndSetCurrentSamplingEvent(this.state.data[cellMeta.dataIndex][0], ()=> { // zero is the column number of the eventID
						this.setState({ toFieldForm: true, selectedEventIndex: cellMeta.dataIndex });
					})
				}
			}
		};

		//	console.log("Sampling Events: ", this.props.samplingEvents);
	}


	// onRowClick = (rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }) => {
	// 	console.log("----RowClick");
	// 	console.log("rowData: ", rowData);
	// 	console.log("rowMeta: ", rowMeta);
	// 	console.log("Load Event: ", rowData[0]);
	// 	console.log(this.state.goTo);

	// 	// 
	// 	// 	this.props.history.push("/FieldForm");
	// 	// 	// this.props.showNavigationTab("FieldForm");
	// 	// 	// this.props.showNavigationTab("Data Entry");





	// 	// });

	// }



	// onRowsSelect = (curRowSelected, allRowsSelected) => {
	// 	console.log("---RowSelect")
	// 	// console.log("Row Selected: ", curRowSelected);
	// 	// console.log("All Selected: ", allRowsSelected);

	// }


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

		let data = currentUserEvents.map((event) =>
			[
				event.eventID,
				event.eventName,
				event.eventDate ? event.eventDate : "N/A", //TODO: dig into question values
				new Date(event.dateModified).toDateString() + " @ " + new Date(event.dateModified).getHours() + ":" + (new Date(event.dateModified).getMinutes() + 1),
				event.stationName ? event.stationName : "N/A",//TODO: dig into question values
				event.shippedStatus,
				<Button onClick={() => {
					console.log("CLICK");
					this.setState({ toEventSummary: true, SummaryEventID: event.eventID })
				}}>
					View Event Summary
			</Button>,
			]
		)

		return data;
	}

	componentDidMount() {
		console.log("CDM");
		this.setState({ data: this.getDataTable() });
	}

	componentWillUnmount() {
		console.log("CWU");
		this.setState(initialState);
	}

	render() {
		if (this.state.toFieldForm) {
			return <Redirect to='/FieldForm' /> //loading event happens in the onCellClick
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

