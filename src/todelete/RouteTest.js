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


class RouteTest extends React.Component {


    render() {

        return (
            <div>
              Route Test Page!!
            </div>
        );
    }
}



export default RouteTest;