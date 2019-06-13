import React from 'react';
import App from '../components/App';
import { Paper, Typography, Grid, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Router from 'next/router';

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
  logo: {
    width: '65%',
    maxWidth: '300px',
  },
});

class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }
  loginPage = () => {
    try {
      Router.push({
        pathname: '/',
      });
      window.location.href = '/';
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <App>
        <Paper className={classes.root} elevation={6}>
          <div className={classes.margin}>
            <Typography
              variant="h4"
              align="center"
              style={{ color: 'rgba(0,70,85)' }}
              gutterBottom
            >
              <img
                src="/static/logo/logo.png"
                alt="borrowd"
                className={classes.logo}
              />
            </Typography>
            <Typography variant="h4" align="center" gutterBottom>
              {this.props.statusCode
                ? `${this.props.statusCode}`
                : 'Client Error'}
            </Typography>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <Typography variant="h6" align="center">
                  {this.props.statusCode
                    ? `An error ${this.props.statusCode} occurred on server`
                    : 'An error occurred on client'}
                </Typography>
              </Grid>
            </Grid>
            <Grid container justify="center" style={{ marginTop: '20px' }}>
              <Button
                id="loginButton"
                size="large"
                onClick={() => this.loginPage()}
                variant="outlined"
                color="primary"
                style={{
                  textTransform: 'none',
                  backgroundColor: 'rgba(0,70,85)',
                  color: '#fff',
                }}
              >
                Home
              </Button>
            </Grid>
          </div>
        </Paper>
      </App>
    );
  }
}

export default withStyles(styles)(Error);
