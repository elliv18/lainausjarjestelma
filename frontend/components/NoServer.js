import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { PongSpinner } from 'react-spinners-kit';

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

class NoServer extends React.Component {
  constructor(props) {
    super(props);
  }

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
            <PongSpinner size={180} color="#004655" loading={true} />
          </Grid>
          <br />
          <Grid item xs>
            <Typography variant="h4">Database is not available!</Typography>
            <Typography>Trying to reconnect</Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default withStyles(styles)(NoServer);
