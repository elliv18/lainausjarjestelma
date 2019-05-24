import React from 'react';
import {
  Paper,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import { Face, Fingerprint } from '@material-ui/icons';
import { LOGIN_MUTATION } from '../lib/gql/mutation';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import green from '@material-ui/core/colors/green';
import { primaryColor } from '../src/theme/color';

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
    margin: 'auto',
  },

  message: {
    textAlign: 'center',
    padding: '10px',
    color: 'red',
  },
});

const theme = createMuiTheme({
  palette: {
    primary: primaryColor,
  },
  typography: {
    useNextVariants: true,
  },
});

class LoginTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      alertMsg: null,
      loggedIn: false,
    };
  }

  setEmail = e => {
    this.setState({ email: e.target.value });
  };

  setPassword = e => {
    this.setState({ password: e.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <Mutation mutation={LOGIN_MUTATION}>
        {(login, { error }) => (
          <Paper className={classes.root} elevation={5}>
            <MuiThemeProvider theme={theme}>
              <div className={classes.margin}>
                <div className={classes.message}>{this.state.alertMsg}</div>
                <Grid container spacing={8} alignItems="flex-end">
                  <Grid item>
                    <Face />
                  </Grid>
                  <Grid item md={true} sm={true} xs={true}>
                    <TextField
                      id="usernameInput"
                      label="Email"
                      type="email"
                      //autoComplete = "email"
                      fullWidth
                      autoFocus
                      required
                      onChange={this.setEmail}
                    />
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
                      fullWidth
                      required
                      onChange={this.setPassword}
                    />
                  </Grid>
                </Grid>
                <Grid container alignItems="center" justify="space-between">
                  <Grid item>
                    <FormControlLabel
                      control={<Checkbox color="primary" />}
                      label="Remember me"
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      disableFocusRipple
                      disableRipple
                      style={{ textTransform: 'none' }}
                      variant="text"
                      color="primary"
                    >
                      Forgot password ?
                    </Button>
                  </Grid>
                </Grid>
                <Grid container justify="center" style={{ marginTop: '10px' }}>
                  <Button
                    size="large"
                    onClick={async () => {
                      //console.log('logging in', this.state.password);

                      const { email, password } = this.state;
                      try {
                        const { data } = await login({
                          variables: { email, password },
                        });

                        console.log('jwt', data.login.jwt);

                        localStorage.setItem('jwtToken', data.login.jwt);
                      } catch (e) {
                        console.log(
                          e.message.replace('GraphQL error:', '').trim()
                        );
                        this.setState({
                          alertMsg: e.message
                            .replace('GraphQL error:', '')
                            .trim(),
                        });
                      }

                      if (localStorage.getItem('jwtToken') !== null) {
                        Router.push({
                          pathname: '/',
                        });
                        window.location.href = '/';
                      }
                    }}
                    variant="outlined"
                    color="primary"
                    style={{ textTransform: 'none' }}
                  >
                    Login
                  </Button>
                </Grid>
              </div>
            </MuiThemeProvider>
          </Paper>
        )}
      </Mutation>
    );
  }
}

export default withStyles(styles)(LoginTab);
