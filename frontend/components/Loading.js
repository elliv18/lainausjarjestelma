import React from "react";
import {
  Paper,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    width: "30%",
    minWidth: "230px",
    position: "fixed",
    left: "35%",
    top: "30%",
    margin: "auto",
    textAlign: "center"
  }
});
class Loading extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} elevation={7}>
        <h3>LOADING...</h3>
      </Paper>
    );
  }
}

export default withStyles(styles)(Loading);
