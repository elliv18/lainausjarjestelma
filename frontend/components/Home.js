import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    root:{
    backgroundColor: '#051530',
     position: 'absolute',
     width: '100%',
     height: '100%',
     color: 'white',
     display: 'flex',
     justifyContent: 'center'

   },

   text:{
     color: 'white',
     textAlign: 'center'
   }
  }

class Home extends React.Component {



  render() {
    const { classes } = this.props;
    return (
     <div className={classes.root}>
      <h1>HOME</h1>
     </div>
    )
  };
}


export default withStyles(styles)(Home);
