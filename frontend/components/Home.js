import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


const styles = {
  root:{
    backgroundColor: '#051530',
    position: 'absolute',
    width: '100%',
    height: '100%',
    color: 'white',
    justify: 'center',
  },
  paper: {
    padding: 12,
    textAlign: 'center',
    color: "black",
    width: '100%',
    height: '100%',
  },
  text:{
     color: 'black',
     textAlign: 'center'
  },
  Grid:{
    wrap: "nowrap",
    spacing: 16,
  }
}

class Home extends React.Component {



  render() {
    const { classes } = this.props;
    return (
     <div className={classes.root}>
      <Paper className={classes.paper}>
        <h1>Summary</h1>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              User data
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              info feed
            </Paper>
          </Grid>
          <h2>Loans</h2>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              loans
            </Paper>
          </Grid>
        </Grid>
      </Paper>
     </div>
    )
  };
}


export default withStyles(styles)(Home);
