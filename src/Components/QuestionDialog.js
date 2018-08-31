import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class QuestionDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      creatingQ: "",
      addQuestion_id_value: "",

    };

  }

  componentDidMount() {
    // this.props.appBarTextCB('SedWE Dashboard');
  }

  pushToSedLOGINClickHandler = () => {

    this.setState({ showSedLOGINQs: true })
  }

  doneClickHandler = () => {
    this.setState({
      showStatus: false,
      statusMessage: "",
      showSedLOGINQs: false
    });
    this.props.handleQuestionDialogClose();
  }

  handleDialogClose = () => {
    this.props.handleQuestionDialogClose();
    //reset this dialog to defaults upon close
    setTimeout(() => {
      this.setState({
        creatingQ: "",
      });
    }, 250);

  }

  passwordChangeHandler = (e) => {
    this.setState({ pw: e.target.value });
  }
  projectIDChangeHandler = (e) => {
    this.setState({ SedLOGINprojectID: e.target.value });
  }

  createQButtonHandler = () => {
    this.setState({ creatingQ: true });
  }

  deleteButtonHandler = () => {
    this.setState({ creatingQ: false });
  }

  //TODO: there might not be existing custom questions -- hide the delete button and dialog info if there isn't
  render() {
    const { classes } = this.props;

    return (
      <Dialog
        open={this.props.isOpen}
        onClose={this.handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {this.state.creatingQ === ""
            ? "Add/Remove "
            : this.state.creatingQ === true
              ? "Add "
              : "Remove "}
          Custom Questions
        </DialogTitle>
        <DialogContent>
          <Grid justify="space-around" container spacing={24}>
            <Grid item xs={12}>
              <DialogContentText>
                {this.state.creatingQ === ""
                  ? "Create or Delete a custom question in your user configuration."
                  : this.state.creatingQ === true
                    ? "Create a new custom question, to be saved to your user configuration."
                    : "Remove an existing custom question from your user configuration."}
              </DialogContentText>
            </Grid>
            {this.state.creatingQ === ""
              ? <React.Fragment>

                <Grid item xs={6}>
                  <Paper className={classes.paper}><Button onClick={this.createQButtonHandler}>Create a New Question</Button></Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper className={classes.paper}><Button onClick={this.deleteButtonHandler}>Delete an existing Question</Button></Paper>
                </Grid>
              </React.Fragment>
              : null}

            {this.state.creatingQ === ""
              ? <React.Fragment>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  id="addQuestion_id"
                  label="Question ID"
                  placeholder="Must Be Globally Unique"
                  onChange={this.textChangeHandler}
                  value={this.state.addQuestion_id_value}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  id="addQuestion_label"
                  label="Question Label"
                  onChange={this.textChangeHandler}
                  value={this.state.addQuestion_label}
                />
              </Grid>
              <Grid item xs={4}>
                <InputLabel htmlFor="age-simple">Age</InputLabel>
                <Select
                  value={this.state.age}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'age',
                    id: 'age-simple',
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </Grid> 
              </React.Fragment>
            : null}



            {/* {this.state.showSedLOGINQs ?
            <React.Fragment>
              <Divider></Divider>
              <Grid item xs={12}><Typography>{this.props.username}, enter the SedLOGIN project ID and your Active Directory password</Typography></Grid>
              <Grid item xs={4}>
                  <TextField
                    margin="dense"
                    id="sedLOGINProjectID"
                    label="SedLOGIN Project ID"
                    fullWidth
                    onChange={this.projectIDChangeHandler}
                    value={this.state.SedLOGINprojectID}
                  />
              </Grid>
              <Grid item xs={8}>
                  <TextField
                    margin="dense"
                    type="password"
                    id="ADPass"
                    label="Active Directory Password"
                    onChange={this.passwordChangeHandler}
                    fullWidth
                    value={this.state.pw}
                  />
              </Grid>
              <Grid item xs={12}>
                  <Button
                    variant="contained"
                    margin="dense"
                    onClick={this.sedLoginSubmitHandler}
                  >Submit to SedLOGIN</Button>
              </Grid> 
              </React.Fragment>
              : null} */}

          </Grid>



        </DialogContent>
        <DialogActions>
          <Button onClick={this.doneClickHandler} color="primary">
            Done
            </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

QuestionDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  appBarTextCB: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(QuestionDialog);