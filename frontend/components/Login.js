import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint} from '@material-ui/icons';
import { LOGIN_MUTATION } from '../lib/gql/mutation' 
import { Mutation } from 'react-apollo'
import Router from 'next/router'


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
            email: '1',
            password: '1',
          
        }
    }

    setEmail = (e) => {
        this.setState({ email: e.target.value })
    }

    setPassword = (e) => {
        this.setState({ password: e.target.value })
    }

    
 
    render() {
        const { classes } = this.props;
        return (
            <Mutation mutation={LOGIN_MUTATION}>
                {(login, {error}) => (
                  <Paper className={classes.root} elevation = {5}>
                    <div className={classes.margin}>
                        <Grid container spacing={8} alignItems="flex-end">
                            <Grid item>
                                <Face />
                            </Grid>
                            <Grid item md={true} sm={true} xs={true}>
                                <TextField 
                                id="usernameInput" 
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
                                id="passwordInput" 
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
                            onClick={async () => {
                                // console.log('logging in', this.state);
                                const { email, password } = this.state;
                                const { data } = await login({ variables: { email, password } });
                                console.log('jwt', data.login.jwt);
                                //localStorage.setItem('token', data.login.jwt);
                                if (data.login.jwt != 0){
                                    Router.push({
                                        pathname: '/users',
                                      });
                                }
                              }}
                            variant="outlined" 
                            color="primary" 
                            style={{ textTransform: "none" }}>Login</Button>
                        </Grid>
                    </div>

                
                    {error && (
                      <div color="danger">{error.message}</div>
                    )}
            
              </Paper>
                )}        
                
            </Mutation>
           
        );
    }
}

export default withStyles(styles)(LoginTab);


/*
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
*/