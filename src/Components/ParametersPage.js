import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3,
		overflowX: 'auto',
	},
	table: {
		minWidth: 700,
	},
});

class ParametersPage extends React.Component {




	componentDidMount() {
		this.props.appBarTextCB("Parameters");
	}

	render() {

		const { classes } = this.props;


		let firstColumn = [];
		let secondColumn = [];
		for (let i = 0; i < this.props.sampleEventLocations.length; i++) {
			let setName = String.fromCharCode(65 + i)
			for (let k = 0; k < this.props.sampleEventLocations[i].length; k++) {
				firstColumn.push(setName + "-" + (k + 1));
				secondColumn.push(this.props.sampleEventLocations[i][k]);
			}
		}

		let pCodes = ["Inst Disch", "Gage Height", "Water Temp C", "Air Temp C", "Specific Cond", "Dis O2", "pH"];

		return (
			<React.Fragment>
				<Paper className={classes.root}>
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell>Set-Sample</TableCell>
								<TableCell>Distance</TableCell>
								{pCodes.map((header) => {
									return (
										<TableCell key={"Param_" + header}>{header}</TableCell>
									);
								})}
							</TableRow>
						</TableHead>
						<TableBody>
							{firstColumn.map((col, rowNum) => {
								return (
									<TableRow key={col + rowNum}>
										<TableCell>
											{col}
										</TableCell>
										<TableCell>
											{secondColumn[rowNum]}
										</TableCell>
										{pCodes.map((head) => {
											return <TableCell key={head+rowNum}>
												<input type="text" id={"val_" + rowNum + 1} size={1} placeholder="Value" />
												<select id={head+"Rmk_" + (rowNum + 1)}>
													<option value="">Rmk</option>
													<option value="C">C</option>
													<option value=">">></option>
													<option value="E">E</option>
												</select>
												<select id={head+"Mth_" + (rowNum + 1)}>
													<option value="">Mth</option>
													<option value="C">C</option>
													<option value=">">></option>
													<option value="E">E</option>
												</select>
												<select id={head+"nQ_" + (rowNum + 1)}>
													<option value="">nQ</option>
													<option value="C">C</option>
													<option value=">">></option>
													<option value="E">E</option>
												</select>
											</TableCell>
										})}


									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</Paper>
			</React.Fragment>
		);
	}
}




ParametersPage.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles)(ParametersPage);