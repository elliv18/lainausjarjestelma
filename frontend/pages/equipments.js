import App from '../components/App'
import Nav from '../components/Nav'
import Equipments from '../components/Equipments'
import Grid from '@material-ui/core/Grid'
import MiniDrawer from '../components/MiniDrawer'

export default() => (
    <App>
        <MiniDrawer> 
            <Grid container direction="column" justify="center" alignItems="center" spacing={24}>
                <Grid xs={12}>
                    <Equipments/>
                </Grid>
            </Grid>
        </MiniDrawer>
    </App>
)