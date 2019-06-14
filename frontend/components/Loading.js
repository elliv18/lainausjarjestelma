import React from 'react';
import { Paper } from '@material-ui/core';
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
        <WaveSpinner size={70} color="#004655" loading={true} />
      </div>
    );
  }
}

// EXPORT
export default withStyles(styles)(Loading);
