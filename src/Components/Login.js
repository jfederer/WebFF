import React from 'react';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }
    render() {
        return (
                    <div>
                        <AppBar
                            title="Login"
                        />
                        <TextField
                            placeholder="username@usgs.gov"
                            label="Enter Your Username"
                            onChange={(event, newValue) => this.setState({ username: newValue })}
                        />
                        <br />
                        <br />
                        <Button label="Submit" primary  onClick={(event) => this.handleClick(event)} />
                    </div>
        );
    }
}


export default Login;