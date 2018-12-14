import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

let counter = 0;

//const loadingData = {id:99999, , "d"}
// const loadingData = {
//   id: 9999,
//   eventName: "data loading...",
//   sampleDate: "data loading...",
//   stationName: "data loading...",
//   shippedStatus: "data loading..."
// };

function createData(eventName, sampleDate, stationName, shippedStatus) {
  counter += 1;
  return { id: counter, eventName, sampleDate, stationName, shippedStatus };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'eventName', numeric: false, disablePadding: true, label: 'Event Name' },
  { id: 'sampleDate', numeric: false, disablePadding: false, label: 'Sample Date' },
  { id: 'stationName', numeric: false, disablePadding: false, label: 'Station name' },
  { id: 'shippedStatus', numeric: false, disablePadding: false, label: 'Shipped status' }
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});



let EnhancedTableToolbar = props => {
  const { numSelected, classes } = props;
  let selectedList = props.data.filter((n) => props.isSelected(n.id));

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selected
          </Typography>
        ) : (
            <Typography variant="title" id="tableTitle">
              Events Manager
          </Typography>
          )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete" onClick={() => props.deleteClickedHandler(selectedList)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

















const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class EventsManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'calories',
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 5,
      showConfirmDelete: false,
      toDeleteList: []
    };
  }

  //eventName, sampleDate, stationName, shippedStatus
  componentWillMount() {
    // console.log("EM: CWM");
    this.buildData();
  }

  componentDidMount() {
    // console.log("EM: CDM");
    this.buildData();
  }


  componentWillUpdate(nextProps, nextState) {
    // console.log("EM: CWU - curr_props: ", this.props.samplingEvents);
    // console.log("EM: CWU - next_props: ", nextProps.samplingEvents);
	// console.log("EM: CWU - this.state.data: ", this.state.data);
    
	if (!this.arraysEqual(this.props.samplingEvents, nextProps.samplingEvents)) {
		// console.log("SHOULD BUILD 1 IT!");
		this.buildData(nextProps.samplingEvents);
	}
	

	if (this.state.data.length !== nextProps.samplingEvents.length) {
    //   console.log("SHOULD BUILD 2 IT!");
      this.buildData(nextProps.samplingEvents);
    }

  }

  buildData(ses) {
    let sampEvents = this.props.samplingEvents;
    if(ses) {
      sampEvents = ses;
    }
    // console.log("BUILD DATA: ", newData);
    let newData = [];
    sampEvents.forEach((eventName) => {
      newData.push(createData(eventName,
        this.props.getEventDetails(eventName, "sampleDate"),
        this.props.getEventDetails(eventName, "stationName"),
        this.props.getEventDetails(eventName, "shippedStatus")));
    });
    // console.log("BUILT DATA: ", newData);
    
    this.setState({ data: newData });
  }


  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleDeleteButtonClick = (toDeleteList) => {
    this.setState({ showConfirmDelete: true, toDeleteList: toDeleteList });
  }

  handleDeleteDialogCancel = () => {
    this.setState({ showConfirmDelete: false, selected: [] });
  }

  handleDeleteDialogConfirm = () => {
    let removedEventNames = [];
    this.state.toDeleteList.map((event) => {
      this.props.deleteSamplingEvent(event.eventName);
      removedEventNames.push(event.eventName);
      return null;
    });

    // let filteredData = this.state.data.filter((evt) => !removedEventNames.includes(evt.eventName));
    // this.setState({ data: filteredData });

    this.handleDeleteDialogCancel(); // just close the dialog
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;


  arraysEqual(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  

  render() {
    const { classes } = this.props;
    // const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;

    // console.log("EM: PROPS: SEs:", this.props.samplingEvents );
    // console.log("EM: STATE: DATA:", data );
    // let data = this.buildDataForRender();

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <React.Fragment>
        <Paper className={classes.root}>
          {data.length === 0
            ? "There are either no events, or they are loading..."
            : <React.Fragment>
              <EnhancedTableToolbar
                numSelected={selected.length}
                deleteClickedHandler={this.handleDeleteButtonClick}
                isSelected={this.isSelected}
                data={data} />
              <div className={classes.tableWrapper}>
                <Table className={classes.table} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={data.length}
                  />
                  <TableBody>
                    {stableSort(data, getSorting(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(n => {
                        const isSelected = this.isSelected(n.id);
                        return (
                          <TableRow
                            hover
                            // onClick={event => this.handleClick(event, n.id)}
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={-1}
                            key={n.id}
                            selected={isSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={isSelected} onClick={event => this.handleClick(event, n.id)} />
                            </TableCell>
                            <TableCell component="th" scope="row" padding="none">
                              <Link to='/FieldForm'>
                                <Button onClick={() => {
                                  this.props.loadSamplingEvent(n.eventName);
                                }
                                }>{n.eventName.replace(this.props.samplingEventIdentifier, "")}</Button>
                              </Link>
                            </TableCell>
                            <TableCell >{n.sampleDate}</TableCell>
                            <TableCell >{n.stationName}</TableCell>
                            <TableCell >{n.shippedStatus ? "Shipped" : "Not Shipped"}</TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 49 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </React.Fragment>}
        </Paper>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          // onEntering={this.handleEntering}
          aria-labelledby="confirmation-dialog-title"
          open={this.state.showConfirmDelete}
          onClose={this.deleteDialogClose}
        >
          <DialogTitle id="confirmation-dialog-title">CONFIRM DELETION!</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Confirm that you want to delete the following sampling event(s):
            </DialogContentText>
            <List>
              {this.state.toDeleteList.map((se) => <ListItem key={"ListItem_" + se.eventName + se.id}>{se.eventName + " " + se.sampleDate + " " + se.stationName}</ListItem>)}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteDialogCancel} color="primary">
              Cancel
              </Button>
            <Button onClick={this.handleDeleteDialogConfirm} color="primary">
              Delete
              </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

EventsManager.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventsManager);