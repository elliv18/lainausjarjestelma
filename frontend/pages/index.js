import Home from '../components/Home';
import MiniDrawer from '../components/MiniDrawer';

export default class Index extends React.Component {
  componentDidMount = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(err => console.error('Service worker registration failed', err));
    } else {
      console.log('Service worker not supported');
    }
  };
  render() {
    return (
      <MiniDrawer>
        <Home />
      </MiniDrawer>
    );
  }
}
