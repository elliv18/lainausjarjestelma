import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { WaveSpinner } from 'react-spinners-kit';

/************************* STYLES *************************/

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    position: 'inherit',
    paddingTop: '15%',
    width: '50%',
    margin: '0 auto',
    textAlign: 'center',
  },
});

/************************ CLASS ********************************/

class Loading extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs>
            <WaveSpinner size={80} color="#004655" loading={true} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

// EXPORT
export default withStyles(styles)(Loading);
