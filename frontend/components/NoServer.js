import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { PongSpinner } from 'react-spinners-kit';

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

class NoServer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <PongSpinner size={200} color="#004655" loading={true} />
        <h1>Backend not ready yet</h1>
      </div>
    );
  }
}
export default withStyles(styles)(NoServer);
