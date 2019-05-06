import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Link from 'next/link'
import HomeIcon from '@material-ui/icons/Home'
import Group from '@material-ui/icons/Group'
import { shouldInclude } from 'apollo-utilities';

const styles = {
  root:{
    width: '100%',
    
  },
  list: {
    width: 170,
    backgroundColor: 'black',
    height: '100%',
    borderRight: 'solid',
    borderColor: 'red',
    borderWidth: 1
  },
  group:{
    padding: 10,
  },

  grow: {
    flexGrow: 1,
    color: 'white',
    marginLeft: 10
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appbar:{
    backgroundColor: 'black',
    color: 'white',
  },
  button:{
    width: '100%',
    color: 'white',
    textAlign: 'center'
  },
  divider:{
    backgroundColor: 'red'
  },
  drawerDiv:{
    height: '100%'
  },

};

class Nav extends React.Component{
  state ={
    left: false,
  }

  toggleDrawer = (side, open) =>() =>{
    this.setState({
      [side]: open,
    })
  }

  render(){
    const { classes } = this.props
    const sideList = (
      <div className={classes.list}>
        <Link href="/"><Button className={classes.button}><HomeIcon/></Button></Link>
        <Divider className={classes.divider}/>
        <Link href="/"><Button className={classes.button}>Users</Button></Link>
        <Divider className={classes.divider}/>
        <Link href="/"><Button className={classes.button}>Equipments</Button></Link>
        <Divider className={classes.divider}/>
      </div>
    )

  return(
<div className={classes.root}>
  <AppBar position="static" className={classes.appbar}>
    <Toolbar>
      <IconButton className={classes.menuButton} color="inherit" arial-label="Menu" onClick={this.toggleDrawer('left',true)}>
        <MenuIcon />
      </IconButton>
      <Typography className={classes.grow}>
        LOAN SYSTEM
      </Typography>
      <Button color="inherit" ><Group className={classes.group}></Group> Login</Button>
    </Toolbar>
  </AppBar>

      <Drawer open={this.state.left} onClose={this.toggleDrawer('left',false)}>
        <div className={classes.drawerDiv}>
          {sideList}
        </div>
      </Drawer>
</div>
  )
  }
}

export default withStyles(styles)(Nav)
