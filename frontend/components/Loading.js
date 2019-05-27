import React from 'react';
import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { WaveSpinner } from 'react-spinners-kit';

/************************* STYLES *************************/

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    margin: 'auto',
    position: 'absolute',
    left: '43%',
    top: '44%',
    textAlign: 'center',
  },
});

/************************ CLASS ********************************/

class Loading extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <WaveSpinner size={70} color="#004655" loading={true} />
      </div>
    );
  }
}

// EXPORT
export default withStyles(styles)(Loading);
