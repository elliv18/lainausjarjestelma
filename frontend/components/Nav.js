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

const styles = {
    root: {
        flexGrow: 1,
    },
    login:{
        right: 0,
    },
    group:{
        marginRight: 10,
    },
    drawerDiv:{
        height: '100%',
        width: 170,
        borderWidth: 1,
    },
    drawerButton:{
        width: '100%',
        textAlign: 'center'
    },
    titleText:{
        fontSize: '20px',
        flexGrow: 1,
    },
    menuButton:{
      marginLeft: -12,
      marginRight: 20,
    }
}

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
    const{classes} = this.props
    const sideList = (
      <div className={classes.drawerDiv}>
        <Link href="/"><Button className={classes.drawerButton}><HomeIcon/></Button></Link>
        <Divider />
        <Link href="/users"><Button className={classes.drawerButton}>Users</Button></Link>
        <Divider />
        <Link href="/equipments"><Button className={classes.drawerButton}>Equipments</Button></Link>
        <Divider />
      </div>
    )

  return(
<div className={classes.root}>
  <AppBar position="static">
    <Toolbar>
      <IconButton className={classes.menuButton} color="inherit" arial-label="Menu" onClick={this.toggleDrawer('left',true)}>
        <MenuIcon />
      </IconButton>
      <Typography className={classes.titleText}>
        Loan System
      </Typography>
      <Button className={classes.login} color="inherit" ><Group className={classes.group}></Group> My account</Button>
    </Toolbar>
  </AppBar>

      <Drawer open={this.state.left} onClose={this.toggleDrawer('left',false)}>
        <div>
          {sideList}
        </div>
      </Drawer>
</div>
  )
  }
}

export default withStyles(styles)(Nav)
