import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
             username: ''
        }
    }

    handleClick = (e) => {
        //console.log(this.state.username);
        this.props.setLoggedInUser(this.state.username);
        window.location.href = '/Dashboard';
    }

    handleTextChange = (e) => {
        //console.log(e.target.value);
        this.setState({ username: e.target.value });
    }

    render() {
        return (
            <div>
                <TextField
                    placeholder="username@usgs.gov"
                    label="Enter Your Username"
                    onChange={this.handleTextChange}
                    value={this.state.username}
                />
                <br />
                <br />
                <Button variant="contained" color="primary" onClick={(event) => this.handleClick(event)}>
                    Login
                <Icon></Icon>
                </Button>
            </div>
        );
    }
}


export default Login;