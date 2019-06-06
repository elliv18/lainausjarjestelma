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
import { Face, Fingerprint } from '@material-ui/icons';
import { LOGIN_MUTATION } from '../lib/gql/mutation';
import Router from 'next/router';
import { primaryColor } from '../src/theme/color';
import Loading from './Loading';
import { withApollo } from 'react-apollo';

/********************** STYLES ****************************/

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
    backgroundColor: '#E7EEEF',
  },

  message: {
    textAlign: 'center',
    padding: '10px',
    color: 'red',
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
    localStorage.removeItem('jwtToken');
    // TODO - is backend up?
    this.setState({ loading: false });
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

      localStorage.setItem('jwtToken', data.login.jwt);
    } catch (e) {
      this.setState({
        alertMsg: e.message.replace('GraphQL error:', '').trim(),
      });
    }

    if (localStorage.getItem('jwtToken') !== null) {
      console.log('WUTT!!!');
      Router.push({
        pathname: '/',
      });
      window.location.href = '/';
    }
  };

  // RENDER
  render() {
    const { classes } = this.props;
    const { loading, client } = this.state;

    if (loading) {
      return <Loading />;
    } else {
      return (
        <Paper className={classes.root} elevation={5}>
          <MuiThemeProvider theme={theme}>
            <div className={classes.margin}>
              <Typography
                variant="h4"
                gutterBottom
                align="center"
                style={{ color: 'rgba(0,70,85)' }}
              >
                LOAN SYSTEM
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
                        this.logIn();
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
    }
  }
}

// EXPORT
export default withStyles(styles)(withApollo(LoginTab));
