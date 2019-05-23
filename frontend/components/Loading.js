import React from 'react';
import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { WaveSpinner } from 'react-spinners-kit';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    margin: 'auto',
    position: 'absolute',
    left: '43%',
    top: '44%',
    width: '100%',
    textAlign: 'center',
  },
});
class Loading extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root} elevation={7}>
        <WaveSpinner size={70} color="#004655" loading={true} />
      </div>
    );
  }
}

export default withStyles(styles)(Loading);
