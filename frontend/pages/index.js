import Home from '../components/Home';
import MiniDrawer from '../components/MiniDrawer';

export default class Index extends React.Component {
  componentDidMount = () => {
    if ('serviceWorker' in navigator) {
      // Use the window load event to keep the page load performant
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
      });
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
