import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import { Redirect } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { isReasonablyValidUsernameInLS } from '../Utils/ValidationUtilities';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            toDashboard: false,
            showLoginButton: false
        }
    }

    componentWillMount() {
        this.setState({ toDashboard: isReasonablyValidUsernameInLS() ? true : false });
    }

    handleClick = (e) => {
        //console.log(this.state.username); //TODO: validation
        this.props.setLoggedInUser(this.state.username);
        this.setState({ toDashboard: isReasonablyValidUsernameInLS() })
    }

    handleTextChange = (e) => {
        localStorage.setItem('loggedInUser', JSON.stringify(e.target.value));
        this.setState({ username: e.target.value }, this.setState({ showLoginButton: isReasonablyValidUsernameInLS() }));
    }

    render() {
        if (this.state.toDashboard === true) {
            return <Redirect to='/Dashboard' />
        }

        return (
            <div>
                <Dialog
                    open={true}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Log In</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            SedFF uses your email address to save all your events, settings, and customizations to the local computer as well attempt to sync to national databases. You should only be asked this once per computer and you can change your login ID using the system menu.<br /><br /> Please enter your @usgs.gov email.
            </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            placeholder="username@usgs.gov"
                            label="Enter Your Username"
                            type="email"
                            fullWidth
                            onChange={this.handleTextChange}
                            value={this.state.username}
                        />
                    </DialogContent>
                    <DialogActions>
                        {this.state.showLoginButton
                            ? <Button variant="contained" color="primary" onClick={(event) => this.handleClick(event)}>
                                Login
                <Icon></Icon>
                            </Button>
                            : null}
                    </DialogActions>
                </Dialog>




            </div>
        );
    }
}


export default Login;