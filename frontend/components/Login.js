import React from 'react';
import {
  Paper,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import { primaryColor } from '../src/theme/color';
import { Face, Fingerprint } from '@material-ui/icons';

import { LOGIN_MUTATION, CURRENTUSER } from '../lib/gql/mutation';

import Loading from './Loading';
import Router from 'next/router';
import { withApollo } from 'react-apollo';
import Cookies from 'js-cookie';
import { BACKENDTEST_QUERY } from '../lib/gql/queries';

import NoServer from './NoServer';

/********************** STYLES ****************************/

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2,
  },
  root: {
    padding: theme.spacing.unit,
    minWidth: '230px',
    position: 'inherit',
    marginTop: '10%',
    width: '50%',
    margin: 'auto',
    backgroundColor: '#F4F7F7',
  },

  message: {
    textAlign: 'center',
    padding: '10px',
    color: 'red',
  },
  logo: {
    width: '65%',
    maxWidth: '300px',
  },
  dialogTitle: {
    backgroundColor: 'rgba(0,70,85)',
  },
});

/************************** CLASS *******************************/

class LoginTab extends React.Component {
  constructor(props) {
    super(props);

    // STATE
    this.state = {
      email: '',
      password: '',
      alertMsg: null,
      loggedIn: false,
      loading: true,
      client: props.client,
      currentUser: null,
      isToken: false,
      isBackend: undefined,
      dialogOpen: false,
    };
    // STATE ENDS
  }

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  setEmail = e => {
    this.setState({ email: e.target.value });
  };

  setPassword = e => {
    this.setState({ password: e.target.value });
  };

  async componentDidMount() {
    let server = await this.state.client
      .query({
        query: BACKENDTEST_QUERY,
      })
      .then(result => {
        this.setState({ isBackend: true });
        console.log('backend', this.state.isBackend);
      })
      .catch(e => {
        console.log(e);
        this.setState({ isBackend: false, loading: false });
        setTimeout(function() {
          window.location.reload();
        }, 7000);
      });

    if (this.state.isBackend) {
      if (Cookies.get('jwtToken')) {
        let CU = await this.state.client
          .mutate({
            mutation: CURRENTUSER,
          })
          .catch(e => {
            console.log('catch');
            Cookies.remove('jwtToken');
          });
        console.log('cu', CU);
        this.setState({
          currentUser: CU.data.currentUser ? CU.data.currentUser.userType : '',
        });
        this.setState({ isToken: true });
      }

      this.state.currentUser === 'ADMIN' ||
      this.state.currentUser === 'STAFF' ||
      this.state.currentUser === 'STUDENT'
        ? Router.push({
            pathname: '/home',
          })
        : Cookies.remove('jwtToken');

      this.setState({ loading: false });
    }
  }

  logIn = async () => {
    const { email, password, client } = this.state;
    console.log('login', email);

    try {
      const { data } = await client.mutate({
        variables: {
          email: email,
          password: password,
        },
        mutation: LOGIN_MUTATION,
      });

      console.log(data.login.jwt);

      await Cookies.set('jwtToken', data.login.jwt);
    } catch (e) {
      this.setState({
        alertMsg: e.message.replace('GraphQL error:', '').trim(),
      });
    }

    if ((await Cookies.get('jwtToken')) !== undefined) {
      try {
        Router.replace({
          pathname: '/home',
        });
        window.location.href = '/home';
      } catch (e) {
        console.log(e);
      }
    }
  };

  // RENDER
  render() {
    const { classes } = this.props;
    const { loading, client, isToken, isBackend } = this.state;

    if (loading) {
      return <Loading />;
    } else if (!loading && !isToken && isBackend) {
      return (
        <Paper className={classes.root} elevation={5}>
          <div className={classes.margin}>
            <Typography
              variant="h4"
              align="center"
              style={{ color: 'rgba(0,70,85)' }}
            >
              <img
                src="/static/logo/logo.png"
                alt="borrowd"
                className={classes.logo}
              />
            </Typography>
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
                  autoComplete="email"
                  fullWidth
                  autoFocus
                  required
                  onChange={this.setEmail}
                  onKeyPress={async ev => {
                    if (ev.key === 'Enter') {
                      document.getElementById('passwordInput').focus();
                    }
                  }}
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
                  autoComplete="password"
                  fullWidth
                  required
                  onChange={this.setPassword}
                  onKeyPress={async ev => {
                    if (ev.key === 'Enter') {
                      this.logIn();
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              container
              alignItems="flex-start"
              justify="flex-start"
              style={{ paddingTop: '10px' }}
            >
              <Grid item>
                <Button
                  disableFocusRipple
                  disableRipple
                  style={{ textTransform: 'none' }}
                  variant="text"
                  color="primary"
                  onClick={() => this.handleDialogOpen()}
                >
                  Forgot password ?
                </Button>
              </Grid>
            </Grid>

            <Grid container justify="center" style={{ marginTop: '20px' }}>
              <Button
                id="loginButton"
                size="large"
                onClick={() => this.logIn()}
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </Grid>
            <Dialog
              open={this.state.dialogOpen}
              onClose={this.handleDialogClose}
              aria-labelledby="forgot-password-info"
            >
              <DialogTitle
                className={classes.dialogTitle}
                id="forgot-password-title"
              >
                <a style={{ color: '#fff', textShadow: '1px 1px #000000' }}>
                  Password reseting...
                </a>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="forgot-password-description">
                  <br />
                  Send email at same email address that you log in to email
                  address <b>admin@borrowd.fi</b> request password reset. Admins
                  will prosseed it when they can. You will get new password to
                  you login email address.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={this.handleDialogClose}
                  color="primary"
                  autoFocus
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Paper>
      );
    } else {
      return <NoServer />;
    }
  }
}

// EXPORT
export default withStyles(styles)(withApollo(LoginTab));
