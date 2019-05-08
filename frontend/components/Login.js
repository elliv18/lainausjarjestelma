import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint} from '@material-ui/icons'
import Router from 'next/router';

import { Mutation } from 'react-apollo'

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit * 2,
    },
    root: {
        padding: theme.spacing.unit,
        width: '50%',
        minWidth: '230px',
        position: 'fixed',
        left: '25%',
        top: '10%',
        margin:'auto'
    }
});

class LoginTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: 'x',
            password: 'x',
            email2: 'y'
          
        }
    }

    setEmail = (e) => {
        this.setState({ email: e.target.value })
    }

    setPassword = (e) => {
        this.setState({ password: e.target.value })
    }

    getEmail(email, password) {
        console.log(email)
        console.log(password)

        if(email=='matti' && password== 'matti19'){
            Router.push({
                pathname: '/users',
              });
        }
      }
        
      
 
    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root} elevation = {5}>
                <div className={classes.margin}>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Face />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField 
                            id="username" 
                            label="Username" 
                            type="email" 
                            //autoComplete = "email"
                            fullWidth autoFocus required
                            onChange={this.setEmail} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Fingerprint />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField 
                            id="username" 
                            label="Password" 
                            type="password" 
                            //autoComplete = "password"
                            fullWidth required 
                            onChange={this.setPassword}/>
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <FormControlLabel control={
                                <Checkbox
                                    color="primary"
                                />
                            } label="Remember me" />
                        </Grid>
                        <Grid item>
                            <Button 
                            disableFocusRipple 
                            disableRipple style={{ textTransform: "none" }} 
                            variant="text" 
                            color="primary">Forgot password ?</Button>
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <Button 
                        onClick={() => this.getEmail(this.state.email, this.state.password)}
                        variant="outlined" 
                        color="primary" 
                        style={{ textTransform: "none" }}>Login</Button>
                    </Grid>
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(LoginTab);