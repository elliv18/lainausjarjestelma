import React from 'react';
import {
  Paper,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@material-ui/core';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import { primaryColor } from '../src/theme/color';
import { Face, Fingerprint } from '@material-ui/icons';

import { LOGIN_MUTATION } from '../lib/gql/mutation';

import Loading from './Loading';
import Router from 'next/router';
import { withApollo } from 'react-apollo';
import Cookies from 'js-cookie';
import { BACKENDTEST_QUERY } from '../lib/gql/queries';
import { CURRENTUSER } from '../lib/gql/mutation';

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
    backgroundColor: '#E7EEEF',
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
});

/************************ THEME ***************************/

const theme = createMuiTheme({
  palette: {
    primary: primaryColor,
  },
  typography: {
    useNextVariants: true,
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
    };
    // STATE ENDS
  }

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
            pathname: '/',
          })
        : Cookies.remove('jwtToken');

      // TODO - is backend up?
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

      await Cookies.set('jwtToken', data.login.jwt, { expires: 1 });
    } catch (e) {
      this.setState({
        alertMsg: e.message.replace('GraphQL error:', '').trim(),
      });
    }

    if ((await Cookies.get('jwtToken')) !== undefined) {
      try {
        Router.push({
          pathname: '/',
        });
        window.location.href = '/';
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
          <MuiThemeProvider theme={theme}>
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
                        console.log('Enter pressed');
                        /*setTimeout(
                          function() {*/
                        // console.log('paska');
                        this.logIn();
                        /*}.bind(this),
                          3000
                        );*/
                      }
                    }}
                  />
                </Grid>
              </Grid>
              {/*<Grid container alignItems="center" justify="space-between">
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
                    onClick={() => localStorage.removeItem('jwtToken')}
                  >
                    Forgot password ?
                  </Button>
                </Grid>
              </Grid>*/}
              <Grid container justify="center" style={{ marginTop: '20px' }}>
                <Button
                  id="loginButton"
                  size="large"
                  onClick={() => this.logIn()}
                  variant="outlined"
                  color="primary"
                  style={{
                    textTransform: 'none',
                    backgroundColor: 'rgba(0,70,85)',
                    color: '#fff',
                  }}
                >
                  Login
                </Button>
              </Grid>
            </div>
          </MuiThemeProvider>
        </Paper>
      );
    } else {
      return <NoServer />;
    }
  }
}

// EXPORT
export default withStyles(styles)(withApollo(LoginTab));
