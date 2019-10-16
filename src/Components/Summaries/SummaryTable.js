import React from 'react';

import { styles } from '../../style';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class SummaryTable extends React.Component {

	buildRow(arr, tableName, rowNum) {
		return <TableRow key={"Summary_" + tableName + "_TableRow" + rowNum}>
			{arr.map((cell, colNum) => {  //TODO: add if tableData.rowHeaders and give that element some different look (matching TableHead)
				// console.log('cell :', cell);
				return <TableCell key={"Summary_" + tableName + "_TableCell" + rowNum + ":" + colNum}>{JSON.stringify(cell)}</TableCell>  //TODO: cleaner cell options for objects, etc
			})}
		</TableRow>
	}

	render() {
		const { classes, tableData, tableValue } = this.props;

		if(!tableData) {
			return null;
		}
		if(!tableValue) {
			return null;
		}

		// TODO: add ColHead, make tabel generation function generic 
		let tableName = tableData.id;

		let headRow = tableData.colHeaders ? this.buildRow(tableValue[0], tableName, 0) : null;

		let bodyRows = tableValue.map((row, rowNum) => {
			if (rowNum === 0 && tableData.colHeaders) {
				return;
			} else {
				return this.buildRow(row, tableName, rowNum);
			}
		})
		bodyRows.shift();  // remove the header row from the bodyRows




		return (<Paper>
			<Table key={"Summary_" + tableName + "_Table" + tableData.id}>
				<TableHead>{headRow}</TableHead>
				<TableBody>{bodyRows}</TableBody>
			</Table>

		</Paper>
		);
	}
}

SummaryTable.propTypes = {
	tableData: PropTypes.object.isRequired,
	tableValue: PropTypes.array.isRequired
};

export default (withStyles(styles, { withTheme: true })(SummaryTable));