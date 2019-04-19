//TODO: delete just removes from view, does not delete from data
//TODO: currently, selecting the row tries to load the event.  This is unwanted behavior.
//FUTURE: rename event
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { styles } from '../../../style';
import { withStyles } from '@material-ui/core/styles';

import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

import MUIDataTable from "mui-datatables";

import { loadAndSetCurrentSamplingEvent } from "../../../Actions/SedFF";

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
	}
];

const data = [
	["123", "Joe James", "Test Corp", "Yonkers", "NY", "done"],
	["234", "John Walsh", "Test Corp", "Hartford", "CT", "not done"],
	["345", "Bob Herm", "Test Corp", "Tampa", "FL", "not done"],
	["456", "James Houston", "Test Corp", "Dallas", "TX", "not done"],
];

class EventsManager extends React.Component {
	constructor(props) {
		super(props);

		this.options = {
			filterType: 'checkbox',
			print: false,
			download: false,
			onRowClick: this.onRowClick,
			onRowsSelect: this.onRowsSelect
		};

	//	console.log("Sampling Events: ", this.props.samplingEvents);
	}

	onRowClick = (rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }) => {
		console.log("----RowClick");
		console.log("rowData: ", rowData);
		console.log("rowMeta: ", rowMeta);
		console.log("Load Event: ", rowData[0]);
		this.props.loadAndSetCurrentSamplingEvent(rowData[0]);
	}

	onRowsSelect = (curRowSelected, allRowsSelected) => {
		console.log("---RowSelect")
		console.log("Row Selected: ", curRowSelected);
		console.log("All Selected: ", allRowsSelected);
		
	}

	render() {
		const { currentUser, sedff, linkTables, allSamplingEvents } = this.props;
		
		if(sedff.isFetchingUserData) {
			return <p>BLAH!</p>
		}

		//console.log(data);

		let currentUserEventIDs = linkTables.userEvents[currentUser.username];

		let currentUserEvents = currentUserEventIDs.map( (eventID) => {
			return allSamplingEvents.filter((samplingEvent) => { //OPTIMIZE: 1) Needlessly runs through entire array
				return samplingEvent.eventID === eventID
			})[0] 	// OPTIMIZE: this will only return ONE item and will not show an error.  Even with UUID, should check for multiple items returning
		})

		
		//build table data
		let data = currentUserEvents.map((event)=>			
			 [
				event.eventID, 
				event.eventName, 
				event.eventDate ? event.eventDate : "Event Date", //TODO: dig into question values
				event.dateModified, //OPTIMIZE: shorter, human readable
				event.stationName ? event.stationName : "Station Name",//TODO: dig into question values
				event.shippedStatus
			 ]
		); 
			
			
		return <MUIDataTable
			title={"Events Manager"}
			data={data}
			columns={columns}
			options={this.options}
		/>
	}
}

const mapStateToProps = function (state) {
	return {
		linkTables: state.LinkTables, // to get users event IDs
		allSamplingEvents: state.SamplingEvents,
		sedff: state.SedFF, // loading / fetching data
		currentUser: state.Users[state.SedFF.currentUsername]
	}
}

const mapDispatchToProps = {
	loadAndSetCurrentSamplingEvent
}

EventsManager.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withRouter(
	withStyles(styles, { withTheme: true })
		(connect(mapStateToProps, mapDispatchToProps)
			(EventsManager)
		)
);

