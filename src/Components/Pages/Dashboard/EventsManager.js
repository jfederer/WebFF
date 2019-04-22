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
			return <p>BLAH!</p> //TODO:
		}

		let currentUserEventIDs = linkTables.userEvents[currentUser.username];

		let currentUserEvents = currentUserEventIDs.map( (eventID) => {
			return allSamplingEvents[eventID]
		})

		console.log("currentUserEvents", currentUserEvents);

		
		//build table data
		let data = currentUserEvents.map((event)=>			
			 [
				event.eventID, 
				event.eventName, 
				event.eventDate ? event.eventDate : "N/A", //TODO: dig into question values
				new Date(event.dateModified).toDateString() + " @ " + new Date(event.dateModified).getHours()+":"+ (new Date(event.dateModified).getMinutes()+1),
				event.stationName ? event.stationName : "N/A",//TODO: dig into question values
				event.shippedStatus
			 ]
		); 

		console.log("Data: ", data);
			
			
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

