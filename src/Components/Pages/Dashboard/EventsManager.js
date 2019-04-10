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

		console.log("Sampling Events: ", this.props.samplingEvents);
	}

	onRowClick = (rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }) => {
		console.log("----RowClick");
		console.log("rowData: ", rowData);
		console.log("rowMeta: ", rowMeta);
	}

	onRowsSelect = (curRowSelected, allRowsSelected) => {
		console.log("---RowSelect")
		console.log("Row Selected: ", curRowSelected);
		console.log("All Selected: ", allRowsSelected);
	}

	render() {
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
		UI: state.UI, // to get dialog visibility 
		users: state.Users, // to get user settings
		sedff: state.SedFF,
		events: state.Events,
		currentUser: state.Users[state.SedFF.currentUsername]
	}
}

const mapDispatchToProps = {
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

