import App from '../components/App'
import Home from '../components/Home'
import MiniDrawer from '../components/MiniDrawer';


export default () => (
  <App>
    <MiniDrawer>
      <Home/>
    </MiniDrawer>
  </App>
)
